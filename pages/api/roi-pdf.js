/* eslint-disable no-console */
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/roi-pdf — Generate and stream a PDF for direct download
//
// Body: { state: ReportState, reportType: 'exec' | 'full' }
// Response: application/pdf binary with Content-Disposition: attachment
//
// Used by the "Download PDF" button so the user gets the real Puppeteer-
// rendered PDF (with the correct CSS-driven margins, no browser print
// header, and a proper filename) instead of the browser's print dialog.
// ─────────────────────────────────────────────────────────────────────────────

import {
  loadTemplate,
  renderTemplate,
} from '@/src/lib/roi/pipeline/renderTemplate'
import { generatePdf } from '@/src/lib/roi/services/pdf'

export const config = {
  maxDuration: 120,
  api: {
    responseLimit: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { state, reportType = 'full' } = req.body ?? {}

  if (!state?.assembled) {
    res.status(400).json({ error: 'state.assembled is required' })
    return
  }

  try {
    const templateName =
      reportType === 'exec' ? 'roi-exec-template.html' : 'roi-template.html'
    const templateHtml = loadTemplate(templateName)
    const renderedHtml = renderTemplate(templateHtml, state.assembled)

    const company = state.assembled.roi_data?.company ?? 'Report'
    const safeCompany =
      company.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'Report'
    const typeLabel = reportType === 'exec' ? 'Executive' : 'Full'
    const filename = `${safeCompany}_${typeLabel}_ROI.pdf`

    const pdf = await generatePdf(renderedHtml, filename)
    const buffer = Buffer.from(pdf.base64, 'base64')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.length)
    res.status(200).send(buffer)
  } catch (err) {
    console.error('[roi-pdf] Error:', err)
    res.status(500).json({ error: err?.message ?? 'Failed to generate PDF' })
  }
}
