/* eslint-disable no-console */
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/roi-email — Re-render, re-generate PDF, and re-send report email
//
// Body: { state: ReportState }
// Response: { ok: true } | { error: string }
// ─────────────────────────────────────────────────────────────────────────────

import {
  loadTemplate,
  renderTemplate,
} from '@/src/lib/roi/pipeline/renderTemplate'
import { generatePdf } from '@/src/lib/roi/services/pdf'
import { sendReportEmail } from '@/src/lib/roi/services/email'
import { createClient, createAdminClient } from '../../src/lib/supabase-server'
import { buildStateFromReportRow } from '@/src/lib/roi/reportState'

export const config = {
  maxDuration: 120,
}

const IS_DEV = process.env.NODE_ENV === 'development'

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

  const { reportId } = req.body ?? {}

  if (!reportId) {
    res.status(400).json({ error: 'reportId is required' })
    return
  }

  const admin = createAdminClient()
  const [{ data: userData }, { data: report }] = await Promise.all([
    admin.from('users').select('role').eq('id', user.id).single(),
    admin
      .from('reports')
      .select(
        'id, user_id, company_name, email, input_data, state_data, rendered_html, rendered_full_html',
      )
      .eq('id', reportId)
      .single(),
  ])

  const isEmployee =
    userData?.role === 'EMPLOYEE' || user.email?.endsWith('@lyrise.ai')

  if (!report || (!isEmployee && report.user_id !== user.id)) {
    res.status(403).json({ error: 'Unauthorized' })
    return
  }

  const state = buildStateFromReportRow(report)

  if (!state?.assembled || !state?.normInput?.email) {
    res
      .status(400)
      .json({ error: 'state.assembled and state.normInput.email are required' })
    return
  }

  if (IS_DEV) {
    res.status(200).json({ ok: true, skipped: true })
    return
  }

  try {
    const templateHtml = loadTemplate('roi-exec-template.html')
    const renderedHtml = renderTemplate(templateHtml, state.assembled)

    const company = state.assembled.roi_data?.company ?? 'Report'
    const slug = company
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const filename = `LyRise_ROI_${slug}.pdf`

    const pdf = await generatePdf(renderedHtml, filename)
    await sendReportEmail(
      state.normInput.email,
      company,
      pdf.base64,
      pdf.filename,
    )

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[roi-email] Error:', err)
    res.status(500).json({ error: err?.message ?? 'Failed to send email' })
  }
}
