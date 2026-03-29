// ─────────────────────────────────────────────────────────────────────────────
// email — sends the ROI report PDF via Resend
// Replaces the Gmail OAuth2 node from the n8n PDF Email Workflow
// Resend is simpler: no OAuth dance, just an API key
// ─────────────────────────────────────────────────────────────────────────────

export async function sendReportEmail(
  recipientEmail: string,
  companyName: string,
  pdfBase64: string,
  filename: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.EMAIL_FROM ?? 'reports@roi.lyrise.ai'

  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `LyRise AI <${fromEmail}>`,
      to: [recipientEmail],
      bcc: ['elena@lyrise.ai', 'mbanoub@lyrise.ai', 'yousef@lyrise.ai'], // always BCC sender for CRM tracking
      subject: `Your AI Automation ROI Report — ${companyName}`,
      html: `
        <p>Hi,</p>
        <p>Please find attached your personalised AI Automation ROI Analysis for <strong>${companyName}</strong>,
        prepared by LyRise AI.</p>
        <p>This report models the financial impact of deploying targeted AI workflows across your operations.
        All figures are conservative estimates and should be validated with your actual volumes and rates.</p>
        <p>Ready to explore next steps?
        <a href="https://calendly.com/elena-lyrise/30min">Book a 30-minute discovery call</a>.</p>
        <br>
        <p>Best,<br>Elena<br>LyRise AI — <a href="https://lyrise.ai">lyrise.ai</a></p>
      `.trim(),
      attachments: [
        {
          filename,
          content: pdfBase64,   // Resend accepts base64 content directly
        },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Resend HTTP ${res.status}: ${body.slice(0, 200)}`)
  }
}
