// ─────────────────────────────────────────────────────────────────────────────
// renderTemplate — fills {{$json.display.*}} placeholders in the HTML template
// Extracted from pages/api/roi-report.js for shared use by agent + email routes
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'

import type { AssembleReportOutput } from '@/src/lib/roi/types'

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u0870-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

function wrapIfRtl(text: string): string {
  if (!ARABIC_RE.test(text)) return text
  return `<span dir="rtl" style="font-family:'Cairo',sans-serif;unicode-bidi:embed;">${text}</span>`
}

// Fields whose values are plain names (not HTML blobs) and may contain Arabic
const NAME_FIELDS = new Set(['recipientDisplay'])

export function loadTemplate(filename = 'roi-template.html'): string {
  return fs.readFileSync(path.join(process.cwd(), 'public', filename), 'utf-8')
}

export function renderTemplate(
  templateHtml: string,
  assembled: AssembleReportOutput,
): string {
  let out = templateHtml
  // Replace all {{$json.display.<key>}} placeholders
  Object.entries(assembled.display).forEach(([key, value]) => {
    const placeholder = new RegExp(
      `\\{\\{\\s*\\$json\\.display\\.${key}\\s*\\}\\}`,
      'g',
    )
    const raw = String(value ?? '')
    out = out.replace(placeholder, NAME_FIELDS.has(key) ? wrapIfRtl(raw) : raw)
  })
  // Top-level fields
  out = out.replace(
    /\{\{\s*\$json\.roi_data\.company\s*\}\}/g,
    wrapIfRtl(String(assembled.roi_data?.company ?? '')),
  )
  out = out.replace(
    /\{\{\s*\$json\.current_date\s*\}\}/g,
    String(assembled.current_date ?? ''),
  )
  return out
}
