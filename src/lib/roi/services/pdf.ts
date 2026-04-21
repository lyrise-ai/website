// ─────────────────────────────────────────────────────────────────────────────
// pdf — converts rendered HTML to PDF using Puppeteer + @sparticuz/chromium
// Works locally (uses locally-installed Chrome) and on Vercel serverless
// (uses the pre-built Chromium binary from @sparticuz/chromium).
// No external API or credentials required.
// ─────────────────────────────────────────────────────────────────────────────

export interface PdfResult {
  base64: string
  filename: string
}

export async function generatePdf(
  html: string,
  filename = 'ROI_Report.pdf',
): Promise<PdfResult> {
  const puppeteer = await import('puppeteer-core')

  let executablePath: string
  let args: string[]

  if (process.env.AWS_EXECUTION_ENV || process.env.VERCEL) {
    // Serverless — use the pre-built Chromium binary
    const chromium = (await import('@sparticuz/chromium')).default
    executablePath = await chromium.executablePath()
    args = chromium.args
  } else {
    // Local development — use the system Chrome / Chromium
    const localPaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
      '/usr/bin/google-chrome', // Linux
      '/usr/bin/chromium-browser', // Linux alt
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
    ]
    const fs = await import('fs')
    const found = localPaths.find((p) => fs.existsSync(p))
    if (!found) {
      throw new Error(
        'PDF generation: no Chrome/Chromium found locally. ' +
          'Install Google Chrome or set VERCEL=1 to use the bundled binary.',
      )
    }
    executablePath = found
    args = ['--no-sandbox', '--disable-setuid-sandbox']
  }

  const browser = await puppeteer.launch({
    executablePath,
    args,
    headless: true,
  })

  try {
    const page = await browser.newPage()

    // Load the HTML directly — base64 encode to avoid any URL length limits
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // Ensure web fonts (Inter via Google Fonts) are fully loaded before
    // rendering, so the PDF matches the browser preview byte-for-byte
    // instead of falling back to a generic sans-serif mid-render.
    await page.evaluate(() => document.fonts.ready)

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    const base64 = Buffer.from(pdfBuffer).toString('base64')
    return { base64, filename }
  } finally {
    await browser.close()
  }
}
