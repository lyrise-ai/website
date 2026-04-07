// ─────────────────────────────────────────────────────────────────────────────
// renderTemplate — fills {{$json.display.*}} placeholders in the HTML template
// Extracted from pages/api/roi-report.js for shared use by agent + email routes
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'

import type { AssembleReportOutput } from '@/src/lib/roi/types'

export function loadTemplate(): string {
  return fs.readFileSync(path.join(process.cwd(), 'public', 'roi-template.html'), 'utf-8')
}

export function renderTemplate(templateHtml: string, assembled: AssembleReportOutput): string {
  let out = templateHtml
  // Replace all {{$json.display.<key>}} placeholders
  Object.entries(assembled.display).forEach(([key, value]) => {
    const placeholder = new RegExp(`\\{\\{\\s*\\$json\\.display\\.${key}\\s*\\}\\}`, 'g')
    out = out.replace(placeholder, String(value ?? ''))
  })
  // Top-level fields
  out = out.replace(/\{\{\s*\$json\.roi_data\.company\s*\}\}/g, String(assembled.roi_data?.company ?? ''))
  out = out.replace(/\{\{\s*\$json\.current_date\s*\}\}/g, String(assembled.current_date ?? ''))
  return out
}
