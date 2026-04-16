// ─────────────────────────────────────────────────────────────────────────────
// POST /api/roi-agent — Unified ROI agent endpoint (generation + chat editing)
//
// Replaces /api/roi-report for all new flows.
// Streams SSE events:
//   { type: 'text_delta', delta }           — agent is typing
//   { type: 'tool_start', tool }            — agent called a tool
//   { type: 'report_update', state }        — report HTML changed
//   { type: 'done', messages? }             — agent finished
//   { type: 'error', message }
// ─────────────────────────────────────────────────────────────────────────────

import { normalizeInput } from '@/src/lib/roi/pipeline/normalize'
import { loadTemplate } from '@/src/lib/roi/pipeline/renderTemplate'
import { runReportAgent } from '@/src/lib/roi/agent'
import { buildDevMockReportState } from '@/src/lib/roi/devMockReport'
import { generatePdf } from '@/src/lib/roi/services/pdf'
import { sendReportEmail } from '@/src/lib/roi/services/email'

export const config = {
  maxDuration: 300,
}

const IS_DEV = process.env.NODE_ENV === 'development'

function send(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`)
  if (typeof res.flush === 'function') res.flush()
}

function mapFormToPayload(body) {
  return {
    ...body,
    'Company Name':         body.companyName    ?? body['Company Name']    ?? '',
    'Company Website URL':  body.website        ?? body['Company Website URL'] ?? '',
    Email:                  body.email          ?? body.Email              ?? '',
    Industry:               body.industry       ?? body.Industry           ?? '',
    'Company LinkedIn URL': body.linkedin       ?? body['Company LinkedIn URL'] ?? '',
    'Recipient Name':       body.recipientName  ?? body['Recipient Name']  ?? '',
    'Recipient Title':      body.recipientTitle ?? body['Recipient Title'] ?? '',
    'Operating Currency':   body.currency       ?? body['Operating Currency'] ?? 'USD',
    processes:              body.processes      ?? [],
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

  const {
    mode,
    formData,
    message,
    chatHistory,
    state: clientState,
    devOptions,
  } = req.body

  if (!mode || !['generate', 'chat'].includes(mode)) {
    send(res, { type: 'error', message: 'Invalid mode. Must be "generate" or "chat".' })
    res.end()
    return
  }

  try {
    const execTemplateHtml = loadTemplate('roi-exec-template.html')
    const fullTemplateHtml = loadTemplate('roi-template.html')

    let state
    if (mode === 'generate') {
      const payload = mapFormToPayload(formData ?? req.body)
      const normInput = normalizeInput(payload)

      if (IS_DEV && devOptions?.skipLLM === true) {
        state = buildDevMockReportState({
          normInput,
          execTemplateHtml,
          fullTemplateHtml,
        })
        send(res, { type: 'text_delta', delta: 'Using dev mock report. Skipping research, LLM calls, PDF, and email.' })
        send(res, { type: 'report_update', state })
        send(res, { type: 'done', assembled: true, messages: [{ role: 'assistant', content: 'Dev mock report ready.' }] })
        res.end()
        return
      }

      state = {
        normInput,
        researchOutput: null,
        modelerOutput: null,
        calcOutput: null,
        writerOutput: null,
        assembled: null,
        renderedHtml: null,
        renderedFullHtml: null,
        confidenceLevel: null,
        revenueAnchor: null,
        revenueAnchorSource: null,
        coreThesis: null,
      }
    } else {
      // Chat mode — client sends full current state
      state = clientState
      if (!state) {
        send(res, { type: 'error', message: 'Chat mode requires state in request body.' })
        res.end()
        return
      }
    }

    await runReportAgent({
      mode,
      state,
      message,
      chatHistory,
      templateHtml: execTemplateHtml,
      fullTemplateHtml,
      callbacks: {
        onTextDelta: (delta) => send(res, { type: 'text_delta', delta }),
        onToolStart: (tool) => send(res, { type: 'tool_start', tool }),
        onReportUpdate: (s) => {
          const { renderedHtml, renderedFullHtml, ...rest } = s
          send(res, { type: 'report_update', state: { ...rest, renderedHtml, renderedFullHtml } })
        },
        onDone: (messages) => send(res, { type: 'done', assembled: Boolean(state?.assembled), messages }),
        onError: (err) => send(res, { type: 'error', message: err.message }),
      },
    })

    // Fire-and-forget PDF + email after generation
    if (!IS_DEV && mode === 'generate' && state.assembled && state.renderedHtml && state.normInput?.email) {
      try {
        const company = state.assembled.roi_data?.company ?? 'Report'
        const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const filename = `LyRise_ROI_${slug}.pdf`
        const pdf = await generatePdf(state.renderedHtml, filename)
        await sendReportEmail(state.normInput.email, company, pdf.base64, pdf.filename)
        send(res, { type: 'email_sent' })
      } catch (bgErr) {
        console.error('[roi-agent] PDF/email failed:', bgErr)
        send(res, { type: 'email_error', message: bgErr.message })
      }
    }
  } catch (err) {
    console.error('[roi-agent] Error:', err)
    send(res, { type: 'error', message: err?.message ?? 'Unknown error' })
  }

  res.end()
}
