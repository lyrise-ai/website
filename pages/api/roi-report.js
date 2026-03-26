// ─────────────────────────────────────────────────────────────────────────────
// POST /api/roi-report — ROI pipeline with SSE streaming (Pages Router)
//
// Streams progress events to the client while the pipeline runs:
//   research → modeler → calculator → writer → assemble → render
//
// PDF generation + email run after the "done" event is streamed but before
// res.end(), keeping the SSE connection open briefly as fire-and-forget.
// ─────────────────────────────────────────────────────────────────────────────

import { generateObject, jsonSchema } from 'ai'
import fs from 'fs'
import path from 'path'

import { normalizeInput } from '@/src/lib/roi/pipeline/normalize'
import { runResearchAgent } from '@/src/lib/roi/agents/researchAgent'
import { roiCalculator } from '@/src/lib/roi/pipeline/roiCalculator'
import { assembleReport } from '@/src/lib/roi/pipeline/assembleReport'
import { generatePdf } from '@/src/lib/roi/services/pdf'
import { sendReportEmail } from '@/src/lib/roi/services/email'
import { fastModel, researchModel } from '@/src/lib/roi/llm'
import { ROI_MODELER_SYSTEM_PROMPT, ROI_MODELER_SCHEMA } from '@/src/lib/roi/prompts/roiModeler'
import { REPORT_WRITER_SYSTEM_PROMPT, REPORT_WRITER_SCHEMA } from '@/src/lib/roi/prompts/reportWriter'

export const config = {
  maxDuration: 300,
}

function send(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`)
  if (typeof res.flush === 'function') res.flush()
}

function renderTemplate(html, assembled) {
  let out = html
  Object.entries(assembled.display).forEach(([key, value]) => {
    const placeholder = new RegExp(`\\{\\{\\s*\\$json\\.display\\.${key}\\s*\\}\\}`, 'g')
    out = out.replace(placeholder, String(value ?? ''))
  })
  out = out.replace(/\{\{\s*\$json\.roi_data\.company\s*\}\}/g, String(assembled.roi_data?.company ?? ''))
  out = out.replace(/\{\{\s*\$json\.current_date\s*\}\}/g, String(assembled.current_date ?? ''))
  return out
}

// Map website form camelCase fields → normalizeInput title-case keys
// Spread body first so all title-case fields pass through, then override camelCase variants
function mapFormToPayload(body) {
  return {
    ...body,
    'Company Name':         body.companyName    ?? body['Company Name']    ?? '',
    'Company Website URL':  body.website        ?? body['Company Website URL'] ?? '',
    Email:                body.email          ?? body.Email           ?? '',
    Industry:             body.industry       ?? body.Industry        ?? '',
    'Company LinkedIn URL': body.linkedin       ?? body['Company LinkedIn URL'] ?? '',
    'Recipient Name':       body.recipientName  ?? body['Recipient Name']  ?? '',
    'Recipient Title':      body.recipientTitle ?? body['Recipient Title'] ?? '',
    'Operating Currency':   body.currency       ?? body['Operating Currency'] ?? 'USD',
    processes: body.processes ?? [],
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  try {
    const payload = mapFormToPayload(req.body)

    // ── 1. Normalize ─────────────────────────────────────────────────────────
    const input = normalizeInput(payload)

    // ── 2. Research Agent ─────────────────────────────────────────────────────
    send(res, { type: 'progress', stage: 'research', message: 'Researching company…' })
    const researchOutput = await runResearchAgent(input)

    // ── 3. ROI Modeler ────────────────────────────────────────────────────────
    send(res, { type: 'progress', stage: 'modeler', message: 'Modelling financial assumptions…' })
    const modelerResult = await generateObject({
      model: fastModel,
      system: ROI_MODELER_SYSTEM_PROMPT,
      prompt: JSON.stringify({
        company_profile: researchOutput.company_profile,
        workflows: researchOutput.workflows,
        currency: input.selectedCurrency,
        processes: input.processes,
      }),
      schema: jsonSchema(ROI_MODELER_SCHEMA),
    })
    const modelerOutput = modelerResult.object

    // ── 4. ROI Calculator ─────────────────────────────────────────────────────
    send(res, { type: 'progress', stage: 'calculator', message: 'Running financial calculations…' })
    const calcOutput = roiCalculator(researchOutput, modelerOutput)

    // ── 5. Report Writer ──────────────────────────────────────────────────────
    send(res, { type: 'progress', stage: 'writer', message: 'Writing report narrative…' })
    const writerResult = await generateObject({
      model: researchModel,
      system: REPORT_WRITER_SYSTEM_PROMPT,
      prompt: JSON.stringify({
        company_profile: researchOutput.company_profile,
        pain_points: researchOutput.pain_points,
        roi: calcOutput,
        currency: input.selectedCurrency,
      }),
      schema: jsonSchema(REPORT_WRITER_SCHEMA),
    })
    const writerOutput = writerResult.object

    // ── 6. Assemble ───────────────────────────────────────────────────────────
    send(res, { type: 'progress', stage: 'assemble', message: 'Assembling report…' })
    const assembled = assembleReport(calcOutput, writerOutput, input)

    // ── 7. Render Template ────────────────────────────────────────────────────
    send(res, { type: 'progress', stage: 'render', message: 'Rendering PDF template…' })
    const templatePath = path.join(process.cwd(), 'public', 'roi-template.html')
    const templateHtml = fs.readFileSync(templatePath, 'utf-8')
    const renderedHtml = renderTemplate(templateHtml, assembled)

    // Client receives "done" and shows success screen immediately
    send(res, { type: 'done', company: researchOutput.company_profile.company })

    // ── 8. PDF + Email (SSE stays open until complete) ────────────────────────
    if (input.email) {
      try {
        const slug = researchOutput.company_profile.company
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        const filename = `LyRise_ROI_${slug}.pdf`

        const pdf = await generatePdf(renderedHtml, filename)
        await sendReportEmail(input.email, researchOutput.company_profile.company, pdf.base64, pdf.filename)
        send(res, { type: 'email_sent' })
      } catch (bgErr) {
        console.error('[roi-report] PDF/email failed:', bgErr)
        send(res, { type: 'email_error', message: bgErr.message })
      }
    }
  } catch (err) {
    console.error('[roi-report] Pipeline error:', err)
    send(res, { type: 'error', message: err.message })
  }

  res.end()
}
