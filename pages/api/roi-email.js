// ─────────────────────────────────────────────────────────────────────────────
// POST /api/roi-email — Re-render, re-generate PDF, and re-send report email
//
// Body: { state: ReportState }
// Response: { ok: true } | { error: string }
// ─────────────────────────────────────────────────────────────────────────────

import { loadTemplate, renderTemplate } from '@/src/lib/roi/pipeline/renderTemplate'
import { generatePdf } from '@/src/lib/roi/services/pdf'
import { sendReportEmail } from '@/src/lib/roi/services/email'

export const config = {
  maxDuration: 120,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { state } = req.body

  if (!state?.assembled || !state?.normInput?.email) {
    res.status(400).json({ error: 'state.assembled and state.normInput.email are required' })
    return
  }

  try {
    const templateHtml = loadTemplate()
    const renderedHtml = renderTemplate(templateHtml, state.assembled)

    const company = state.assembled.roi_data?.company ?? 'Report'
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const filename = `LyRise_ROI_${slug}.pdf`

    const pdf = await generatePdf(renderedHtml, filename)
    await sendReportEmail(state.normInput.email, company, pdf.base64, pdf.filename)

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[roi-email] Error:', err)
    res.status(500).json({ error: err?.message ?? 'Failed to send email' })
  }
}
