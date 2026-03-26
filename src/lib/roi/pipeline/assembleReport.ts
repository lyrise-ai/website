// ─────────────────────────────────────────────────────────────────────────────
// assembleReport — port of the Assemble Report n8n Code node
// Pure TypeScript, fully deterministic — no LLM calls
// Builds all display strings and HTML blobs for the template
// ─────────────────────────────────────────────────────────────────────────────

import type {
  RoiCalculatorOutput,
  ReportWriterOutput,
  NormalizedInput,
  AssembleReportOutput,
  DisplayObject,
} from '@/src/lib/roi/types'

// ── Formatters ────────────────────────────────────────────────────────────────

function addCommas(n: number): string {
  const str = String(Math.round(n || 0))
  let out = ''
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) out += ','
    out += str[i]
  }
  return out
}

function esc(s: string | null | undefined): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Case studies ──────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  {
    client: 'Quantrax Corporation',
    industry: 'Financial Services',
    headline: '5.2x ROI in 14 months',
    results: ['~3,300 hrs freed per year', '$67K/year in agent cost savings', '+159% profit per account'],
    quote: 'The LyRise team helped Quantrax create outstanding scoring models in a complex debt-collection industry. I would recommend them if you want to build your AI team or solution easier and faster.',
    author: 'Ranjan Dharmaraja, Founder & CEO',
    tags: ['financial', 'banking', 'debt', 'insurance', 'healthcare', 'auto', 'utilities', 'energy', 'finance'],
  },
  {
    client: 'NY Law Firm',
    industry: 'Legal & Professional Services',
    headline: '10,000 hours saved per year',
    results: ['$300K/year in recovered billable capacity', '1.7x productivity improvement', '~40% drafting time reduction'],
    quote: 'LyRise helped us reclaim thousands of attorney hours and redirect them to higher-value client work.',
    author: 'Managing Partner, NY Law Firm',
    tags: ['legal', 'law', 'consulting', 'professional', 'advisory', 'audit', 'tax', 'accounting', 'services'],
  },
  {
    client: 'Zampa Partners',
    industry: 'Audit, Tax & Advisory',
    headline: '15x annual return on AI investment',
    results: ['55%+ no-touch onboarding rate', 'Cycle time cut from 21 → 7 days', '€75,600/year in savings'],
    quote: 'LyRise transformed our onboarding from a 3-week bottleneck into a streamlined 7-day process.',
    author: 'Senior Partner, Zampa Partners',
    tags: ['audit', 'tax', 'advisory', 'compliance', 'government', 'public', 'real estate', 'construction', 'manufacturing', 'industrial'],
  },
  {
    client: 'Startup Fuel',
    industry: 'Technology & SaaS',
    headline: 'Full payback in under 8 months',
    results: ['€1,688+/month in savings', '40% reduction in intro call time', '50% demo preparation time saved'],
    quote: 'LyRise pinpointed exactly where our sales process was leaking time and built agents that paid for themselves in months.',
    author: 'Ashley, Founder',
    tags: ['technology', 'software', 'saas', 'startup', 'retail', 'ecommerce', 'e-commerce', 'education', 'hospitality', 'consumer', 'other', 'tech'],
  },
]

function selectCaseStudies(industry: string, count: number) {
  const norm = (v: string) => String(v ?? '').toLowerCase()
  const indWords = norm(industry).split(/[\s,/&\-+]+/).filter(w => w.length > 2)
  const scored = CASE_STUDIES.map(cs => {
    const score = cs.tags.reduce((acc, tag) => {
      const matched = indWords.some(word => tag === word || tag.includes(word) || word.includes(tag))
      return matched ? acc + 2 : acc
    }, 0)
    return { cs, score }
  }).sort((a, b) => b.score - a.score)
  return scored.slice(0, count).map(s => s.cs)
}

function buildCaseStudiesHTML(studies: typeof CASE_STUDIES): string {
  const cols = studies.map(cs => {
    const truncQuote = cs.quote.length > 130 ? cs.quote.slice(0, 127) + '...' : cs.quote
    return `<td style="width:33%;vertical-align:top;background:#f8fafc;border:1px solid #dde1e7;padding:9px 11px">`
      + `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;font-weight:bold;margin-bottom:2px">${esc(cs.industry)}</div>`
      + `<div style="font-size:10pt;font-weight:bold;color:#0a1628;margin-bottom:4px">${esc(cs.client)}</div>`
      + `<div style="font-size:12pt;font-weight:bold;color:#0a1628;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #e2e8f0">${esc(cs.headline)}</div>`
      + cs.results.map(r => `<div style="font-size:8.5pt;color:#1e293b;padding:2px 0">&rsaquo; ${esc(r)}</div>`).join('')
      + `<div style="font-size:8pt;color:#64748b;margin-top:7px;font-style:italic;line-height:1.4;border-top:1px solid #e2e8f0;padding-top:5px">&ldquo;${esc(truncQuote)}&rdquo;</div>`
      + `<div style="font-size:7.5pt;color:#94a3b8;margin-top:3px;font-weight:bold">${esc(cs.author)}</div>`
      + `</td>`
  }).join('')
  return `<table style="width:100%;border-collapse:separate;border-spacing:5px;margin-bottom:0"><tr>${cols}</tr></table>`
}

// ── Main function ─────────────────────────────────────────────────────────────

export function assembleReport(
  calcOut: RoiCalculatorOutput,
  writerOut: ReportWriterOutput,
  normInput: NormalizedInput
): AssembleReportOutput {
  const roi          = calcOut.roi_data
  const analystData  = calcOut.analystData
  const painPoints   = analystData.pain_points ?? []
  const modelerNotes = calcOut.modelerNotes    ?? []
  const sym          = roi.currency.symbol
  const s            = roi.summary

  const fmt   = (n: number | null | undefined) => (n != null && !Number.isNaN(+n)) ? addCommas(+n) : '—'
  const cur   = (n: number) => sym + fmt(n)
  const short = (n: number) => {
    if (n == null || Number.isNaN(+n)) return '—'
    const v = Math.round(+n)
    if (v >= 1_000_000) return sym + (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 1_000)     return sym + Math.round(v / 1_000) + 'K'
    return cur(v)
  }

  const tf12 = s.operationalDividend12mo + s.profitUplift12mo
  const wfs  = [...roi.workflows].sort((a, b) => b.annualValue - a.annualValue)
  const totalMonthlyHours = wfs.reduce((a, w) => a + w.monthlyHours, 0)
  const totalMonthlyCost  = wfs.reduce((a, w) => a + w.monthlyCost,  0)

  // Date — loop-based, no toLocaleDateString (PDF renderer safe)
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
  const now = new Date()
  const currentDate = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

  // Case studies
  const selectedStudies = selectCaseStudies(roi.industry ?? '', 3)
  const caseStudiesHTML = buildCaseStudiesHTML(selectedStudies)

  // Scope list
  const scopeListHTML = wfs.map(w => `<li>${esc(w.name)}</li>`).join('')

  // As-Is Baseline table
  const asisTableBody = wfs.map(wf =>
    `<tr>`
    + `<td><strong>${esc(wf.name)}</strong></td>`
    + `<td>${esc(wf.owner || '—')}</td>`
    + `<td style="text-align:center">${fmt(wf.volume)}</td>`
    + `<td style="text-align:center">${fmt(wf.timeBefore)} min</td>`
    + `<td>${sym}${fmt(wf.rate)}/hr</td>`
    + `<td>${sym}${fmt(wf.costPerRun)}</td>`
    + `<td><strong>${sym}${fmt(wf.monthlyCost)}</strong></td>`
    + `</tr>`
  ).join('')
  + `<tr class="total-row">`
  + `<td colspan="6"><strong>Total monthly run-cost</strong></td>`
  + `<td><strong>${sym}${fmt(totalMonthlyCost)}</strong></td>`
  + `</tr>`

  // Before vs After table
  const bvaTableBody = wfs.map(wf =>
    `<tr>`
    + `<td><strong>${esc(wf.name)}</strong></td>`
    + `<td style="text-align:center">${fmt(wf.volume)}</td>`
    + `<td style="text-align:center">${fmt(wf.timeBefore)} min</td>`
    + `<td style="text-align:center">${fmt(wf.timeAfter)} min</td>`
    + `<td style="text-align:center">${fmt(wf.timeSaved)} min (-${wf.savingsPct || 0}%)</td>`
    + `<td style="text-align:center">${fmt(wf.monthlyHours)} hrs</td>`
    + `<td>${sym}${fmt(wf.rate)}/hr</td>`
    + `<td class="accent">${sym}${fmt(wf.annualValue)}</td>`
    + `</tr>`
  ).join('')
  + `<tr class="total-row">`
  + `<td colspan="5"><strong>Monthly capacity unlocked</strong></td>`
  + `<td><strong>${fmt(totalMonthlyHours)} hrs</strong></td>`
  + `<td></td>`
  + `<td class="accent"><strong>${sym}${fmt(s.operationalDividend12mo)}/yr</strong></td>`
  + `</tr>`

  // Profit Levers table
  const levers = writerOut.profit_levers ?? []
  const profitLeversBody = levers.map(l =>
    `<tr>`
    + `<td><strong>${esc(l.lever_name ?? '')}</strong></td>`
    + `<td>${esc(l.baseline_data ?? '')}</td>`
    + `<td>${esc(l.assumption ?? '')}</td>`
    + `<td>${esc(l.rationale ?? '')}</td>`
    + `<td class="accent"><strong>${sym}${fmt(+(l.profit ?? 0))}</strong></td>`
    + `</tr>`
  ).join('')
  + `<tr class="total-row">`
  + `<td colspan="4"><strong>12-month incremental profit</strong></td>`
  + `<td class="accent"><strong>${sym}${fmt(s.profitUplift12mo)}</strong></td>`
  + `</tr>`

  // Deploy table
  const deployTableBody = wfs.map(wf =>
    `<tr>`
    + `<td><strong>${esc(wf.name)}</strong><br>`
    + `<span class="muted">${esc(wf.expectedOutcome ?? '')}</span></td>`
    + `<td class="accent"><strong>${esc(wf.agentName ?? '')}</strong></td>`
    + `<td>${esc(wf.whyItMatters ?? '')}</td>`
    + `</tr>`
  ).join('')

  // Provenance table
  const inputProcNames = normInput.processes.map(p => p.name).filter(Boolean)
  const userWfNames    = wfs.filter(w => w.source === 'user_stated').map(w => w.name)
  const unmatchedProcs = inputProcNames.filter(n => !userWfNames.includes(n))

  const provRows: { source: string; point: string; basis: string }[] = []

  painPoints.filter(p => p.source === 'user_stated').forEach(p => {
    provRows.push({ source: 'Your input', point: `Pain point — "${p.title ?? ''}"`, basis: 'Captured directly from your submission' })
  })
  wfs.filter(w => w.source === 'user_stated').forEach(w => {
    provRows.push({ source: 'Your input', point: `Workflow — ${w.name}`, basis: 'Identified as a bottleneck by your team' })
  })
  unmatchedProcs.forEach(n => {
    provRows.push({ source: 'Your input', point: `Process — "${n}"`, basis: 'Submitted directly by your team' })
  })
  wfs.filter(w => w.source === 'research_derived').forEach(w => {
    provRows.push({ source: 'Company research', point: `Workflow — ${w.name}`, basis: w.rationale || 'Derived from operational intelligence' })
  })
  wfs.filter(w => w.source === 'inferred').forEach(w => {
    provRows.push({ source: 'Industry benchmark', point: `Workflow — ${w.name} (inferred)`, basis: w.rationale || 'Industry-typical for this sector' })
  })
  modelerNotes.filter(n => typeof n === 'string' && n.trim()).forEach(n => {
    provRows.push({ source: 'Industry benchmark', point: 'Rate / volume assumption', basis: n })
  })

  const provenanceTableHTML = provRows.length
    ? `<table><thead><tr>`
      + `<th style="width:18%">Source</th>`
      + `<th style="width:35%">Data Point</th>`
      + `<th style="width:47%">Basis</th>`
      + `</tr></thead><tbody>`
      + provRows.map(r =>
          `<tr>`
          + `<td><strong>${esc(r.source)}</strong></td>`
          + `<td>${esc(r.point)}</td>`
          + `<td>${esc(r.basis)}</td>`
          + `</tr>`
        ).join('')
      + `</tbody></table>`
    : `<p class="muted">All figures are based on industry benchmarks — no direct inputs captured.</p>`

  const display: DisplayObject = {
    currencyCode:   roi.currency.code,
    currencySymbol: sym,
    workflowCount:  String(wfs.length),
    coverHeadline:  `${fmt(totalMonthlyHours)} hrs returned & ${short(tf12)} total financial gain — 12-month conservative estimate`,

    statHours:    fmt(s.totalAnnualHours),
    statHoursSub: fmt(totalMonthlyHours),
    statOD:       short(s.operationalDividend12mo),
    statTF:       short(tf12),
    statFTE:      (s.totalAnnualHours / 2000).toFixed(1),

    totalAnnualHours:  fmt(s.totalAnnualHours),
    totalMonthlyHours: fmt(totalMonthlyHours),
    od12: cur(s.operationalDividend12mo),
    pu12: cur(s.profitUplift12mo),
    tf12: cur(tf12),

    hrs24: fmt(Math.round(s.totalAnnualHours * 2.15)),
    od24:  cur(s.operationalDividend24mo),
    pu24:  cur(s.profitUplift24mo),
    tf24:  cur(s.totalFinancialGain24mo),
    hrs36: fmt(Math.round(s.totalAnnualHours * 3.40)),
    od36:  cur(s.operationalDividend36mo),
    pu36:  cur(s.profitUplift36mo),
    tf36:  cur(s.totalFinancialGain36mo),

    employeesDisplay: roi.employees ? `${addCommas(roi.employees)} (est. midpoint)` : 'Not specified',
    revenueDisplay:   roi.revenue   ? `${sym}${roi.revenue}M (est. midpoint)` : 'Not specified',

    recipientDisplay: normInput.recipientName
      ? normInput.recipientTitle
        ? `${normInput.recipientName}, ${normInput.recipientTitle}`
        : normInput.recipientName
      : `${roi.company} Leadership`,
    caseStudiesHTML,
    scopeListHTML,
    asisTableBody,
    bvaTableBody,
    profitLeversBody,
    deployTableBody,
    provenanceTableHTML,
    cta: writerOut.cta_paragraph || `Let us show you how we can return ${fmt(totalMonthlyHours)} hours to your team each month.`,
  }

  return {
    roi_data:        roi,
    copy:            writerOut,
    display,
    current_date:    currentDate,
    recipient_email: normInput.email ?? '',
  }
}
