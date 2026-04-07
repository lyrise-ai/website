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
  ReportState,
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

// ── v3.0 HTML builders ────────────────────────────────────────────────────────

function buildCompanySnapshotHTML(snapshot: ReportWriterOutput['company_snapshot']): string {
  if (!snapshot?.length) return '<p class="muted">No company snapshot available.</p>'
  const items = snapshot.map(item => {
    const badgeClass = item.sourceType === 'scraped'
      ? 'badge-scraped'
      : item.sourceType === 'benchmarked'
      ? 'badge-benchmarked'
      : 'badge-assumed'
    const badgeLabel = item.sourceType === 'scraped' ? 'Verified' : item.sourceType === 'benchmarked' ? 'Benchmarked' : 'Assumed'
    return `<li style="padding:3px 0;border-bottom:1px dotted #e2e8f0;font-size:9pt;">`
      + `${esc(item.text)} <span class="${badgeClass}">${badgeLabel}</span>`
      + `</li>`
  }).join('')
  return `<ul style="list-style:none;margin:0;padding:0">${items}</ul>`
}

function buildCostOfDelayHTML(sym: string, costOfDelay: ReportWriterOutput['cost_of_delay']): string {
  if (!costOfDelay) return ''
  const monthlyCost = addCommas(Math.round(costOfDelay.monthly_cost))
  return `<div class="insight-panel">`
    + `<div class="insight-stripe"></div>`
    + `<div class="insight-content">`
    + `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#2957FF;font-weight:bold;margin-bottom:4px">Cost of Delay</div>`
    + `<div style="font-size:18pt;font-weight:bold;color:#0a1628;line-height:1">${sym}${monthlyCost}<span style="font-size:9pt;font-weight:normal;color:#64748b"> / month</span></div>`
    + `<p style="font-size:8.5pt;color:#2d2d2d;margin-top:6px;line-height:1.5">${esc(costOfDelay.narrative)}</p>`
    + `</div></div>`
}

function buildResilienceTableHTML(rows: ReportWriterOutput['resilience_rows']): string {
  if (!rows?.length) return ''
  const tableRows = rows.map(r =>
    `<tr>`
    + `<td style="font-weight:bold;width:22%">${esc(r.dimension)}</td>`
    + `<td style="background:#f0fdf4;color:#166534"><strong>Act Now:</strong> ${esc(r.act_now)}</td>`
    + `<td style="background:#fef2f2;color:#991b1b"><strong>Defer:</strong> ${esc(r.defer)}</td>`
    + `</tr>`
  ).join('')
  return `<table style="width:100%;border-collapse:collapse;font-size:9pt">`
    + `<thead><tr>`
    + `<th style="width:22%">Dimension</th>`
    + `<th style="width:39%">Act Now</th>`
    + `<th style="width:39%">Defer Decision</th>`
    + `</tr></thead>`
    + `<tbody>${tableRows}</tbody></table>`
}

function buildRisksTableBody(risks: ReportWriterOutput['risks']): string {
  if (!risks?.length) return ''
  return risks.map(r => {
    const likelihoodColor = r.likelihood === 'High' ? '#991b1b' : r.likelihood === 'Medium' ? '#854d0e' : '#166534'
    return `<tr>`
      + `<td>${esc(r.risk)}</td>`
      + `<td style="color:${likelihoodColor};font-weight:bold;text-align:center">${esc(r.likelihood)}</td>`
      + `<td>${esc(r.mitigation)}</td>`
      + `</tr>`
  }).join('')
}

function buildNextStepsHTML(
  checklist: ReportWriterOutput['next_steps_checklist'],
  cta: string
): string {
  if (!checklist?.length) return ''
  const items = checklist.map((item, i) =>
    `<tr>`
    + `<td style="text-align:center;width:4%;font-weight:bold;color:#2957FF">${i + 1}</td>`
    + `<td>${esc(item.action)}</td>`
    + `<td style="color:#64748b">${esc(item.owner)}</td>`
    + `<td style="color:#64748b;font-style:italic">${esc(item.due)}</td>`
    + `</tr>`
  ).join('')
  return `<div class="insight-panel" style="margin-bottom:10px">`
    + `<div class="insight-stripe"></div>`
    + `<div class="insight-content" style="font-size:9pt">${esc(cta)}</div>`
    + `</div>`
    + `<table style="width:100%;border-collapse:collapse;font-size:9pt">`
    + `<thead><tr>`
    + `<th style="width:4%">#</th>`
    + `<th style="width:52%">Action</th>`
    + `<th style="width:26%">Owner</th>`
    + `<th style="width:18%">Timeline</th>`
    + `</tr></thead>`
    + `<tbody>${items}</tbody></table>`
}

function buildOdVsPuPanelHTML(sym: string, od: number, pu: number): string {
  return `<div class="insight-panel" style="margin-top:8px">`
    + `<div class="insight-stripe"></div>`
    + `<div class="insight-content">`
    + `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#2957FF;font-weight:bold;margin-bottom:6px">Understanding These Numbers</div>`
    + `<div style="display:flex;gap:20px">`
    + `<div style="flex:1"><div style="font-size:7pt;text-transform:uppercase;color:#94a3b8;font-weight:bold">Operational Dividend</div>`
    + `<div style="font-size:13pt;font-weight:bold;color:#0a1628">${sym}${addCommas(od)}</div>`
    + `<div style="font-size:8pt;color:#64748b;margin-top:2px">Direct labor value recaptured from freed hours — measurable on day one of full adoption</div></div>`
    + `<div style="flex:1"><div style="font-size:7pt;text-transform:uppercase;color:#94a3b8;font-weight:bold">Profit Uplift</div>`
    + `<div style="font-size:13pt;font-weight:bold;color:#2957FF">${sym}${addCommas(pu)}</div>`
    + `<div style="font-size:8pt;color:#64748b;margin-top:2px">Downstream revenue and margin gains from redirecting recaptured capacity to higher-value activities</div></div>`
    + `</div></div></div>`
}

function buildCalculationPanelHTML(
  sym: string,
  topWorkflow: { name: string; volume: number; timeBefore: number; timeAfter: number; rate: number; monthlyHours: number; annualValue: number }
): string {
  const timeSavedMin = topWorkflow.timeBefore - topWorkflow.timeAfter
  const timeSavedHrs = (topWorkflow.volume * timeSavedMin / 60).toFixed(1)
  return `<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:8px 12px;margin-top:6px;font-size:8.5pt">`
    + `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#2957FF;font-weight:bold;margin-bottom:4px">How This Is Calculated — ${esc(topWorkflow.name)}</div>`
    + `<div style="color:#2d2d2d;line-height:1.7">`
    + `<span style="font-family:monospace">${addCommas(topWorkflow.volume)} runs/mo × (${topWorkflow.timeBefore} − ${topWorkflow.timeAfter} min) ÷ 60 = ${timeSavedHrs} hrs/mo freed</span><br>`
    + `<span style="font-family:monospace">${timeSavedHrs} hrs/mo × ${sym}${topWorkflow.rate}/hr × 12 mo = ${sym}${addCommas(topWorkflow.annualValue)}/yr (Operational Dividend from this workflow)</span>`
    + `</div></div>`
}

// ── Main function ─────────────────────────────────────────────────────────────

export function assembleReport(
  calcOut: RoiCalculatorOutput,
  writerOut: ReportWriterOutput,
  normInput: NormalizedInput,
  reportState?: Partial<ReportState>
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

  // Profit Levers table — v3.0 includes derived_from + arithmetic rationale columns
  const levers = writerOut.profit_levers ?? []
  const profitLeversBody = levers.map(l =>
    `<tr>`
    + `<td><strong>${esc(l.lever_name ?? '')}</strong></td>`
    + `<td style="color:#64748b;font-size:8.5pt">${esc(l.derived_from ?? '')}</td>`
    + `<td>${esc(l.baseline_data ?? '')}</td>`
    + `<td>${esc(l.assumption ?? '')}</td>`
    + `<td style="font-size:8pt;color:#2d2d2d;font-family:monospace">${esc(l.rationale_with_arithmetic ?? l.rationale ?? '')}</td>`
    + `<td class="accent"><strong>${sym}${fmt(+(l.profit ?? 0))}</strong></td>`
    + `</tr>`
  ).join('')
  + `<tr class="total-row">`
  + `<td colspan="5"><strong>12-month incremental profit</strong></td>`
  + `<td class="accent"><strong>${sym}${fmt(s.profitUplift12mo)}</strong></td>`
  + `</tr>`

  // Deploy table — v3.0 adds why it fits (WD-1)
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

  const provRows: { source: string; point: string; basis: string; status: string }[] = []

  painPoints.filter(p => p.source === 'user_stated').forEach(p => {
    provRows.push({ source: 'Your input', point: `Pain point — "${p.title ?? ''}"`, basis: 'Captured directly from your submission', status: 'Validated' })
  })
  wfs.filter(w => w.source === 'user_stated').forEach(w => {
    provRows.push({ source: 'Your input', point: `Workflow — ${w.name}`, basis: 'Identified as a bottleneck by your team', status: 'Validated' })
  })
  unmatchedProcs.forEach(n => {
    provRows.push({ source: 'Your input', point: `Process — "${n}"`, basis: 'Submitted directly by your team', status: 'Needs validation' })
  })
  wfs.filter(w => w.source === 'research_derived').forEach(w => {
    provRows.push({ source: 'Company research', point: `Workflow — ${w.name}`, basis: w.rationale || 'Derived from operational intelligence', status: 'Validated' })
  })
  wfs.filter(w => w.source === 'inferred').forEach(w => {
    provRows.push({ source: 'Industry benchmark', point: `Workflow — ${w.name} (inferred)`, basis: w.rationale || 'Industry-typical for this sector', status: 'Industry standard' })
  })
  modelerNotes.filter(n => typeof n === 'string' && n.trim()).forEach(n => {
    provRows.push({ source: 'Industry benchmark', point: 'Rate / volume assumption', basis: n, status: 'Industry standard' })
  })

  const provenanceTableHTML = provRows.length
    ? `<table><thead><tr>`
      + `<th style="width:16%">Source</th>`
      + `<th style="width:32%">Data Point</th>`
      + `<th style="width:38%">Basis</th>`
      + `<th style="width:14%">Status</th>`
      + `</tr></thead><tbody>`
      + provRows.map(r =>
          `<tr>`
          + `<td><strong>${esc(r.source)}</strong></td>`
          + `<td>${esc(r.point)}</td>`
          + `<td>${esc(r.basis)}</td>`
          + `<td style="font-size:8pt;color:#64748b;font-style:italic">${esc(r.status)}</td>`
          + `</tr>`
        ).join('')
      + `</tbody></table>`
    : `<p class="muted">All figures are based on industry benchmarks — no direct inputs captured.</p>`

  // ── v3.0 display fields ───────────────────────────────────────────────────

  // Revenue context statement
  const revenueAnchor = reportState?.revenueAnchor
  const revenueContextStatement = (revenueAnchor && revenueAnchor > 0)
    ? `This represents approximately ${Math.round(tf12 / revenueAnchor * 100)}% of your estimated annual revenue returned through operational efficiency — without adding headcount.`
    : ''

  // Confidence badge
  const confLevel = reportState?.confidenceLevel ?? 'low'
  const confidenceBadge = confLevel === 'high' ? 'Insight-Driven Analysis' : 'Hypothesis-Driven Projection'

  // Company snapshot
  const companySnapshotHTML = buildCompanySnapshotHTML(writerOut.company_snapshot ?? [])

  // Cost of delay
  const costOfDelayHTML = buildCostOfDelayHTML(sym, writerOut.cost_of_delay ?? {
    monthly_cost: Math.round(tf12 / 12),
    narrative: `Every month without automation costs your team the equivalent of ${sym}${addCommas(Math.round(tf12 / 12))} in recoverable value. Delay is not neutral — it carries a monthly price.`,
  })

  // Resilience table
  const resilienceTableHTML = buildResilienceTableHTML(writerOut.resilience_rows ?? [])

  // Risks table
  const risksTableBody = buildRisksTableBody(writerOut.risks ?? [])

  // Next steps
  const nextStepsHTML = buildNextStepsHTML(
    writerOut.next_steps_checklist ?? [],
    writerOut.cta_paragraph || `Let us show you how we can return ${fmt(totalMonthlyHours)} hours to your team each month.`
  )

  // OD vs PU distinction panel
  const odVsPuPanelHTML = buildOdVsPuPanelHTML(sym, s.operationalDividend12mo, s.profitUplift12mo)

  // Calculation panel (top workflow example)
  const topWf = wfs[0]
  const calculationPanelHTML = topWf ? buildCalculationPanelHTML(sym, topWf) : ''

  const display: DisplayObject = {
    // Original fields
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

    // v3.0 fields
    revenueContextStatement,
    companySnapshotHTML,
    confidenceBadge,
    unifiedPatternThesis: writerOut.unified_pattern_thesis ?? '',
    costOfDelayHTML,
    resilienceTableHTML,
    pilotRecommendation: writerOut.pilot_recommendation ?? '',
    risksTableBody,
    nextStepsHTML,
    odVsPuPanelHTML,
    calculationPanelHTML,
  }

  return {
    roi_data:        roi,
    copy:            writerOut,
    display,
    current_date:    currentDate,
    recipient_email: normInput.email ?? '',
  }
}
