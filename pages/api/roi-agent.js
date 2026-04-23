/* eslint-disable no-console */
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
import { createClient, createAdminClient } from '../../src/lib/supabase-server'

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
    'Company Name': body.companyName ?? body['Company Name'] ?? '',
    'Company Website URL': body.website ?? body['Company Website URL'] ?? '',
    Email: body.email ?? body.Email ?? '',
    Industry: body.industry ?? body.Industry ?? '',
    'Company LinkedIn URL': body.linkedin ?? body['Company LinkedIn URL'] ?? '',
    'Recipient Name': body.recipientName ?? body['Recipient Name'] ?? '',
    'Recipient Title': body.recipientTitle ?? body['Recipient Title'] ?? '',
    'Operating Currency': body.currency ?? body['Operating Currency'] ?? 'USD',
    processes: body.processes ?? [],
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const {
    mode,
    formData,
    message,
    chatHistory,
    state: clientState,
    devOptions,
    reportId,
  } = req.body

  if (!mode || !['generate', 'chat'].includes(mode)) {
    res
      .status(400)
      .json({ error: 'Invalid mode. Must be "generate" or "chat".' })
    return
  }

  const CHAT_LIMIT = 5
  let chatUserRole = 'CLIENT'
  const adminSupabase = createAdminClient()

  if (mode === 'chat' && reportId) {
    const [{ data: userData }, { data: report }] = await Promise.all([
      supabase.from('users').select('role').eq('id', user.id).single(),
      supabase.from('reports').select('user_id').eq('id', reportId).single(),
    ])
    chatUserRole = userData?.role ?? 'CLIENT'

    if (
      !report ||
      (report.user_id !== user.id && chatUserRole !== 'EMPLOYEE')
    ) {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    if (chatUserRole !== 'EMPLOYEE') {
      const { data: usage } = await adminSupabase
        .from('chat_usage')
        .select('id, message_count')
        .eq('user_id', user.id)
        .eq('report_id', reportId)
        .single()

      if (usage && usage.message_count >= CHAT_LIMIT) {
        adminSupabase
          .from('events')
          .insert({
            user_id: user.id,
            report_id: reportId,
            type: 'chat_limit_reached',
          })
          .then(() => {})
        res.status(403).json({ error: 'limit_reached' })
        return
      }
    }
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

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
        send(res, {
          type: 'text_delta',
          delta:
            'Using dev mock report. Skipping research, LLM calls, PDF, and email.',
        })
        send(res, { type: 'report_update', state })
        send(res, {
          type: 'done',
          assembled: true,
          messages: [{ role: 'assistant', content: 'Dev mock report ready.' }],
        })
        res.end()
        return
      }

      state = {
        normInput,
        company: null,
        globals: null,
        workflows: null,
        copy: null,
        calcOutput: null,
        assembled: null,
        renderedHtml: null,
        renderedFullHtml: null,
        confidenceLevel: null,
        coreThesis: null,
      }
    } else {
      // Chat mode — client sends full current state
      state = clientState
      if (!state) {
        send(res, {
          type: 'error',
          message: 'Chat mode requires state in request body.',
        })
        res.end()
        return
      }
    }

    let capturedMessages = []

    await runReportAgent({
      mode,
      state,
      message,
      chatHistory,
      templateHtml: execTemplateHtml,
      fullTemplateHtml,
      estimatesOnly: Boolean(devOptions?.estimatesOnly),
      callbacks: {
        onTextDelta: (delta) => send(res, { type: 'text_delta', delta }),
        onToolStart: (tool) => send(res, { type: 'tool_start', tool }),
        onReportUpdate: (s, changedSections) => {
          const { renderedHtml, renderedFullHtml, ...rest } = s
          send(res, {
            type: 'report_update',
            state: { ...rest, renderedHtml, renderedFullHtml },
            changedSections,
          })
        },
        onDone: (messages) => {
          capturedMessages = messages ?? []
          send(res, {
            type: 'done',
            assembled: Boolean(state?.assembled),
            messages,
          })
        },
        onError: (err) => send(res, { type: 'error', message: err.message }),
      },
    })

    if (mode === 'chat' && reportId) {
      const userRole = chatUserRole

      await supabase.from('chat_messages').insert({
        report_id: reportId,
        user_id: user.id,
        role: 'user',
        content: message,
      })

      const assistantText = capturedMessages
        .filter((m) => m.role === 'assistant')
        .map((m) => (typeof m.content === 'string' ? m.content : ''))
        .join('')

      if (assistantText) {
        await supabase.from('chat_messages').insert({
          report_id: reportId,
          user_id: user.id,
          role: 'assistant',
          content: assistantText,
        })
      }

      if (userRole !== 'EMPLOYEE') {
        const { data: usage, error: usageReadErr } = await adminSupabase
          .from('chat_usage')
          .select('id, message_count')
          .eq('user_id', user.id)
          .eq('report_id', reportId)
          .single()

        if (usageReadErr && usageReadErr.code !== 'PGRST116') {
          console.error('[roi-agent] chat_usage read error:', usageReadErr)
        }

        if (usage) {
          const { error: updateErr } = await adminSupabase
            .from('chat_usage')
            .update({ message_count: usage.message_count + 1 })
            .eq('user_id', user.id)
            .eq('report_id', reportId)
            .lt('message_count', CHAT_LIMIT)
          if (updateErr)
            console.error('[roi-agent] chat_usage update error:', updateErr)
        } else {
          const { error: upsertErr } = await adminSupabase
            .from('chat_usage')
            .upsert(
              { user_id: user.id, report_id: reportId, message_count: 1 },
              { onConflict: 'user_id,report_id' },
            )
          if (upsertErr)
            console.error('[roi-agent] chat_usage upsert error:', upsertErr)
        }
      }
    }

    // Save report to DB after generation
    if (mode === 'generate' && state.assembled) {
      const { data: savedReport } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          company_name:
            state.assembled.roi_data?.company ??
            state.normInput?.companyName ??
            '',
          email: state.normInput?.email ?? '',
          status: 'SUCCESS',
          input_data: state.normInput,
          completed_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (savedReport?.id) {
        send(res, { type: 'report_saved', report_id: savedReport.id })
      }
    }

    // Fire-and-forget PDF + email after generation
    if (
      !IS_DEV &&
      mode === 'generate' &&
      state.assembled &&
      state.renderedHtml &&
      state.normInput?.email
    ) {
      try {
        const company = state.assembled.roi_data?.company ?? 'Report'
        const slug = company
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        const filename = `LyRise_ROI_${slug}.pdf`
        const pdf = await generatePdf(state.renderedHtml, filename)
        await sendReportEmail(
          state.normInput.email,
          company,
          pdf.base64,
          pdf.filename,
        )
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
