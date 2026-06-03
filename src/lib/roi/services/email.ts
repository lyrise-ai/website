// ─────────────────────────────────────────────────────────────────────────────
// email — sends the ROI report PDF via Resend
// Replaces the Gmail OAuth2 node from the n8n PDF Email Workflow
// Resend is simpler: no OAuth dance, just an API key
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_REPORT_BCC = ['elena@lyrise.ai', 'mbanoub@lyrise.ai']

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function sendReportEmail(
  recipientEmail: string,
  companyName: string,
  pdfBase64: string,
  filename: string,
  bcc: string[] = DEFAULT_REPORT_BCC,
  chatUrl?: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.EMAIL_FROM ?? 'reports@roi.lyrise.ai'

  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const chatCta = chatUrl
    ? `
        <p style="margin: 18px 0 8px;">Want to refine the numbers, change the currency, or ask follow-up questions?</p>
        <p style="margin: 0 0 18px;">
          <a href="${escapeHtmlAttr(chatUrl)}"
             style="display: inline-block; padding: 10px 18px; background: #2957FF; color: #fff;
                    text-decoration: none; border-radius: 6px; font-weight: 600;">
            Open editing chat
          </a>
        </p>
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px;">
          Opens the live executive and full reports with our AI assistant — no login needed.
        </p>
      `
    : ''

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `LyRise AI <${fromEmail}>`,
      to: [recipientEmail],
      bcc, // CRM-tracking copy; filtered to avoid duplicates with `to`
      subject: `Your AI Automation ROI Report — ${companyName}`,
      html: `
        <p>Hi,</p>
        <p>Please find attached your personalised AI Automation ROI Analysis for <strong>${companyName}</strong>,
        prepared by LyRise AI.</p>
        <p>This report models the financial impact of deploying targeted AI workflows across your operations.
        All figures are conservative estimates and should be validated with your actual volumes and rates.</p>
        ${chatCta}
        <p>Ready to explore next steps?
        <a href="https://api.leadconnectorhq.com/widget/bookings/strategy-call-with-lyrisesivto9">Book a 30-minute discovery call</a>.</p>
        <br>
        <p>Best,<br>LyRise Team<br>LyRise AI — <a href="https://lyrise.ai">lyrise.ai</a></p>
      `.trim(),
      attachments: [
        {
          filename,
          content: pdfBase64, // Resend accepts base64 content directly
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
