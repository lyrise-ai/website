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
import {
  buildStateFromReportRow,
  splitStoredState,
} from '@/src/lib/roi/reportState'
import { persistReportEvidence } from '@/src/lib/roi/reportEvidence'
import { assessReportSpecificity } from '@/src/lib/roi/specificity'

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
    'What does your company do?':
      body.businessDescription ?? body['What does your company do?'] ?? '',
    Email: body.email ?? body.Email ?? '',
    Industry: body.industry ?? body.Industry ?? '',
    Country: body.country ?? body.Country ?? '',
    'Number of Employees': body.teamSize ?? body['Number of Employees'] ?? '',
    'Estimated Annual Revenue':
      body.revenueRange ?? body['Estimated Annual Revenue'] ?? '',
    'Key Priorities': body.keyPriorities ?? body['Key Priorities'] ?? [],
    'Company LinkedIn URL': body.linkedin ?? body['Company LinkedIn URL'] ?? '',
    'Recipient Name': body.recipientName ?? body['Recipient Name'] ?? '',
    'Recipient Title': body.recipientTitle ?? body['Recipient Title'] ?? '',
    'Operating Currency': body.currency ?? body['Operating Currency'] ?? 'USD',
    processes: body.processes ?? [],
  }
}

function buildPersistedChatHistory(rows = []) {
  return rows
    .filter((row) => row?.role === 'user' || row?.role === 'assistant')
    .map((row) => ({ role: row.role, content: row.content }))
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const supabase = createClient(req, res)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const { data: report } = await supabase
      .from('reports')
      .select('id, rendered_html, rendered_full_html, state_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let messagesUsed = 0
    if (report) {
      const adminSupabase = createAdminClient()
      const { data: usage } = await adminSupabase
        .from('chat_usage')
        .select('message_count')
        .eq('user_id', user.id)
        .eq('report_id', report.id)
        .maybeSingle()
      messagesUsed = usage?.message_count ?? 0
    }

    res.status(200).json({
      report: report ? { ...report, messages_used: messagesUsed } : null,
    })
    return
  }

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

  const { mode, formData, message, chatHistory, devOptions, reportId } =
    req.body

  if (!mode || !['generate', 'chat'].includes(mode)) {
    res
      .status(400)
      .json({ error: 'Invalid mode. Must be "generate" or "chat".' })
    return
  }

  const CHAT_LIMIT = 5
  let chatUserRole = 'CLIENT'
  const adminSupabase = createAdminClient()
  let persistedReport = null
  let persistedChatHistory = []

  if (mode === 'chat') {
    if (!reportId) {
      res.status(400).json({ error: 'reportId is required for chat mode' })
      return
    }

    const [{ data: userData }, { data: report }] = await Promise.all([
      adminSupabase.from('users').select('role').eq('id', user.id).single(),
      adminSupabase
        .from('reports')
        .select(
          'id, user_id, email, status, input_data, state_data, rendered_html, rendered_full_html',
        )
        .eq('id', reportId)
        .single(),
    ])
    const isEmployeeChat =
      userData?.role === 'EMPLOYEE' ||
      user.email?.endsWith('@lyrise.ai') === true

    // Employees see all messages on the report; clients see only their own
    let msgQuery = adminSupabase
      .from('chat_messages')
      .select('role, content')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true })
      .limit(20)
    if (!isEmployeeChat) msgQuery = msgQuery.eq('user_id', user.id)
    const { data: messages } = await msgQuery
    chatUserRole = isEmployeeChat ? 'EMPLOYEE' : userData?.role ?? 'CLIENT'

    if (!report || (report.user_id !== user.id && !isEmployeeChat)) {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    if (!isEmployeeChat) {
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

    persistedReport = report
    persistedChatHistory = buildPersistedChatHistory(messages ?? [])
  }

  if (mode === 'generate') {
    const { data: genUserData } = await adminSupabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    // fall back to email domain if the users row is missing or has wrong role
    const isEmployee =
      genUserData?.role === 'EMPLOYEE' ||
      user.email?.endsWith('@lyrise.ai') === true

    if (!isEmployee) {
      const { data: existingReport } = await supabase
        .from('reports')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()
      if (existingReport) {
        res
          .status(409)
          .json({ error: 'report_exists', report_id: existingReport.id })
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
        painPoints: [],
        researchSummary: null,
        evidenceItems: [],
        specificityAssessment: null,
      }
    } else {
      state = buildStateFromReportRow(persistedReport)
    }

    let capturedMessages = []

    await runReportAgent({
      mode,
      state,
      message,
      chatHistory: mode === 'chat' ? persistedChatHistory : chatHistory,
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
      state.specificityAssessment = assessReportSpecificity(state)

      await supabase.from('chat_messages').insert({
        report_id: reportId,
        user_id: user.id,
        role: 'user',
        content: message?.trim() ?? '',
      })

      const assistantText = capturedMessages
        .filter((m) => m.role === 'assistant')
        .map((m) => {
          if (typeof m.content === 'string') return m.content
          if (Array.isArray(m.content))
            return m.content
              .filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('')
          return ''
        })
        .join('\n')
        .trim()

      if (assistantText) {
        await supabase.from('chat_messages').insert({
          report_id: reportId,
          user_id: user.id,
          role: 'assistant',
          content: assistantText,
        })
      }

      const { stateData, renderedHtml, renderedFullHtml } =
        splitStoredState(state)
      await adminSupabase
        .from('reports')
        .update({
          rendered_html: renderedHtml,
          rendered_full_html: renderedFullHtml,
          state_data: stateData,
        })
        .eq('id', reportId)

      await persistReportEvidence(adminSupabase, reportId, state.evidenceItems)

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
      state.specificityAssessment = assessReportSpecificity(state)

      if (state.specificityAssessment.level === 'weak') {
        send(res, {
          type: 'text_delta',
          delta:
            '\n\nLow-confidence note: public company evidence was limited, so some workflow assumptions may still rely on benchmarks.',
        })
      }

      const { stateData, renderedHtml, renderedFullHtml } =
        splitStoredState(state)
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
          rendered_html: renderedHtml,
          rendered_full_html: renderedFullHtml,
          state_data: stateData,
        })
        .select('id')
        .single()

      if (savedReport?.id) {
        await persistReportEvidence(
          adminSupabase,
          savedReport.id,
          state.evidenceItems,
        )
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
