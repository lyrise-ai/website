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
  RoiModelerOutput,
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
    headline: '$390K total gain in Year 1',
    results: [
      '~3,300 hrs freed per year (~2 FTEs)',
      '$70K/year Operational Dividend',
      '$290K/year Profit Uplift',
      '$390K Total Financial Gain',
    ],
    quote:
      'The LyRise team helped Quantrax create outstanding scoring models in a complex debt-collection industry. I would recommend them if you want to build your AI team or solution easier and faster.',
    author: 'Ranjan Dharmaraja, Founder & CEO',
    tags: [
      'financial',
      'banking',
      'debt',
      'insurance',
      'healthcare',
      'auto',
      'utilities',
      'energy',
      'finance',
    ],
  },
  {
    client: 'NY Law Firm',
    industry: 'Legal & Professional Services',
    headline: '$450K total gain in Year 1',
    results: [
      '~10,000 hrs freed per year (~6 FTEs)',
      '$300K/year Operational Dividend',
      '$225K/year Profit Uplift',
      '$450K Total Financial Gain',
    ],
    quote:
      'LyRise helped us reclaim thousands of attorney hours and redirect them to higher-value client work.',
    author: 'Managing Partner, NY Law Firm',
    tags: [
      'legal',
      'law',
      'consulting',
      'professional',
      'advisory',
      'audit',
      'tax',
      'accounting',
      'services',
      'technology',
      'software',
      'saas',
      'startup',
      'retail',
      'ecommerce',
      'e-commerce',
      'education',
      'hospitality',
      'consumer',
      'other',
      'tech',
      'real estate',
      'construction',
      'manufacturing',
      'industrial',
      'government',
      'public',
    ],
  },
]

function selectCaseStudies() {
  // Always return all case studies (currently 2)
  return CASE_STUDIES
}

function buildCaseStudiesHTML(studies: typeof CASE_STUDIES): string {
  const cols = studies
    .map((cs) => {
      const truncQuote =
        cs.quote.length > 150 ? cs.quote.slice(0, 147) + '...' : cs.quote
      return (
        `<td style="width:50%;vertical-align:top;background:#f8fafc;border:1px solid #dde1e7;padding:9px 11px">` +
        `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;font-weight:bold;margin-bottom:2px">${esc(
          cs.industry,
        )}</div>` +
        `<div style="font-size:10pt;font-weight:bold;color:#0a1628;margin-bottom:4px">${esc(
          cs.client,
        )}</div>` +
        `<div style="font-size:12pt;font-weight:bold;color:#003F87;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #e2e8f0">${esc(
          cs.headline,
        )}</div>` +
        cs.results
          .map(
            (r) =>
              `<div style="font-size:8.5pt;color:#1e293b;padding:2px 0">&rsaquo; ${esc(
                r,
              )}</div>`,
          )
          .join('') +
        `<div style="font-size:8pt;color:#64748b;margin-top:7px;font-style:italic;line-height:1.4;border-top:1px solid #e2e8f0;padding-top:5px">&ldquo;${esc(
          truncQuote,
        )}&rdquo;</div>` +
        `<div style="font-size:7.5pt;color:#94a3b8;margin-top:3px;font-weight:bold">${esc(
          cs.author,
        )}</div>` +
        `</td>`
      )
    })
    .join('')
  return `<table style="width:100%;border-collapse:separate;border-spacing:5px;margin-bottom:0"><tr>${cols}</tr></table>`
}

// ── v3.0 HTML builders ────────────────────────────────────────────────────────

function buildCompanySnapshotTableBody(
  snapshot: ReportWriterOutput['company_snapshot'],
  employees: number | null,
  revenue: number | null,
  sym: string,
  revenueAnchorSource: string | null | undefined,
): string {
  const rows: string[] = []
  if (employees) {
    rows.push(
      `<tr><td>${addCommas(
        employees,
      )} employees</td><td><span class="badge-scraped">Scraped — LinkedIn</span></td></tr>`,
    )
  }
  if (revenue) {
    const src = esc(revenueAnchorSource ?? 'Benchmarked')
    rows.push(
      `<tr><td>Revenue estimated ${sym}${revenue}M annually</td><td><span class="badge-benchmarked">${src}</span></td></tr>`,
    )
  }
  if (snapshot?.length) {
    snapshot.forEach((item) => {
      const cls =
        item.sourceType === 'scraped'
          ? 'badge-scraped'
          : item.sourceType === 'benchmarked'
          ? 'badge-benchmarked'
          : 'badge-assumed'
      const label =
        item.sourceType === 'scraped'
          ? 'Scraped'
          : item.sourceType === 'benchmarked'
          ? 'Benchmarked'
          : 'Assumed'
      rows.push(
        `<tr><td>${esc(
          item.text,
        )}</td><td><span class="${cls}">${label}</span></td></tr>`,
      )
    })
  }
  return rows.join('')
}

function buildCostOfDelayHTML(
  sym: string,
  costOfDelay: ReportWriterOutput['cost_of_delay'],
): string {
  if (!costOfDelay) return ''
  const monthlyCost = addCommas(Math.round(costOfDelay.monthly_cost))
  return (
    `<div class="insight-panel">` +
    `<div class="stripe"></div>` +
    `<div class="panel-content">` +
    `<div style="font-size:18pt;font-weight:bold;color:#0a1628;line-height:1">${sym}${monthlyCost}<span style="font-size:9pt;font-weight:normal;color:#64748b"> / month</span></div>` +
    `<p style="font-size:8.5pt;color:#2d2d2d;margin-top:6px;line-height:1.5">${esc(
      costOfDelay.narrative,
    )}</p>` +
    `</div></div>`
  )
}

function buildResilienceTableHTML(
  rows: ReportWriterOutput['resilience_rows'],
): string {
  if (!rows?.length) return ''
  const tableRows = rows
    .map(
      (r) =>
        `<tr>` +
        `<td style="font-weight:bold;width:22%">${esc(r.dimension)}</td>` +
        `<td style="background:#f0fdf4;color:#166534"><strong>Act Now:</strong> ${esc(
          r.act_now,
        )}</td>` +
        `<td style="background:#fef2f2;color:#991b1b"><strong>Defer:</strong> ${esc(
          r.defer,
        )}</td>` +
        `</tr>`,
    )
    .join('')
  return (
    `<table style="width:100%;border-collapse:collapse;font-size:9pt">` +
    `<thead><tr>` +
    `<th style="width:22%">Dimension</th>` +
    `<th style="width:39%">Act Now</th>` +
    `<th style="width:39%">Defer Decision</th>` +
    `</tr></thead>` +
    `<tbody>${tableRows}</tbody></table>`
  )
}

function buildRisksTableBody(risks: ReportWriterOutput['risks']): string {
  if (!risks?.length) return ''
  return risks
    .map(
      (r) =>
        `<tr>` +
        `<td style="font-weight:bold;width:20%">${esc(r.risk)}</td>` +
        `<td style="width:42%;font-size:8.5pt">${esc(r.detail)}</td>` +
        `<td style="width:38%">${esc(r.mitigation)}</td>` +
        `</tr>`,
    )
    .join('')
}

function buildNextStepsHTML(
  checklist: ReportWriterOutput['next_steps_checklist'],
  cta: string,
): string {
  return (
    `<div style="font-size:10pt;font-weight:bold;color:#1a1a1a;margin-bottom:6px">Process validation session</div>` +
    `<div class="insight-panel" style="margin-bottom:10px">` +
    `<div class="stripe"></div>` +
    `<div class="panel-content" style="font-size:9pt">` +
    `<p style="margin:0 0 6px">${esc(cta)}</p>` +
    `<div style="font-size:8.5pt;color:#2957FF;font-weight:bold">Book: calendly.com/elena-lyrise/30min &nbsp;|&nbsp; elena@lyrise.ai</div>` +
    `</div></div>`
  )
}

function buildOdVsPuPanelHTML(sym: string, od: number, pu: number): string {
  return (
    `<div class="insight-panel" style="margin-top:8px">` +
    `<div class="insight-stripe"></div>` +
    `<div class="insight-content">` +
    `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#2957FF;font-weight:bold;margin-bottom:6px">Understanding These Numbers</div>` +
    `<div style="display:flex;gap:20px">` +
    `<div style="flex:1"><div style="font-size:7pt;text-transform:uppercase;color:#94a3b8;font-weight:bold">Operational Dividend</div>` +
    `<div style="font-size:13pt;font-weight:bold;color:#0a1628">${sym}${addCommas(
      od,
    )}</div>` +
    `<div style="font-size:8pt;color:#64748b;margin-top:2px">Direct labor value recaptured from freed hours — measurable on day one of full adoption</div></div>` +
    `<div style="flex:1"><div style="font-size:7pt;text-transform:uppercase;color:#94a3b8;font-weight:bold">Profit Uplift</div>` +
    `<div style="font-size:13pt;font-weight:bold;color:#2957FF">${sym}${addCommas(
      pu,
    )}</div>` +
    `<div style="font-size:8pt;color:#64748b;margin-top:2px">Downstream revenue and margin gains from redirecting recaptured capacity to higher-value activities</div></div>` +
    `</div></div></div>`
  )
}

function buildCalculationPanelHTML(
  sym: string,
  wfs: Array<{
    name: string
    volume: number
    timeBefore: number
    timeAfter: number
    rate: number
    monthlyHours: number
  }>,
  totalMonthlyHours: number,
  annualOD: number,
): string {
  const topWf = wfs[0]
  const savedHrs = ((topWf.timeBefore - topWf.timeAfter) / 60).toFixed(2)
  const monthlyValue = Math.round(topWf.monthlyHours * topWf.rate)
  const totalMonthlyValue = wfs.reduce(
    (a, w) => a + Math.round(w.monthlyHours * w.rate),
    0,
  )
  const ftes = ((totalMonthlyHours * 12) / 2080).toFixed(1)
  const sumLine =
    wfs
      .map((w) => `${sym}${addCommas(Math.round(w.monthlyHours * w.rate))}`)
      .join(' + ') + ` = ${sym}${addCommas(totalMonthlyValue)}/mo`
  return (
    `<div class="insight-panel" style="margin-top:6px">` +
    `<div class="insight-stripe"></div>` +
    `<div class="insight-content" style="font-size:8.5pt">` +
    `<div style="font-size:7pt;text-transform:uppercase;letter-spacing:0.8px;color:#2957FF;font-weight:bold;margin-bottom:6px">How This Is Calculated</div>` +
    `<div style="margin-bottom:4px"><strong>Formula:</strong> Value recaptured/mo = Volume × (Before AI hrs − After AI hrs) × Rate (${sym}/hr)</div>` +
    `<div style="margin-bottom:4px"><strong>Worked example — ${esc(
      topWf.name,
    )}:</strong> <span style="font-family:monospace">${addCommas(
      topWf.volume,
    )} × ${savedHrs} hrs × ${sym}${addCommas(
      topWf.rate,
    )}/hr = ${sym}${addCommas(monthlyValue)}/mo</span></div>` +
    `<div style="margin-bottom:4px"><strong>Monthly total:</strong> <span style="font-family:monospace">${sumLine}</span></div>` +
    `<div style="margin-bottom:2px"><strong>Annual hours returned:</strong> <span style="font-family:monospace">${addCommas(
      totalMonthlyHours,
    )} × 12 = ${addCommas(
      totalMonthlyHours * 12,
    )} hrs (~${ftes} FTEs at 2,080 hrs/yr)</span></div>` +
    `<div><strong>Annual Operational Dividend:</strong> <span style="font-family:monospace">${sym}${addCommas(
      totalMonthlyValue,
    )}/mo × 12 = ${sym}${addCommas(annualOD)}</span></div>` +
    `</div></div>`
  )
}

function buildRoadmapTableBody(pilotWfName: string): string {
  return [
    [
      'Weeks 1–2',
      'Rapid Discovery &amp; Validation',
      `Validate workflow volumes and task times for ${esc(
        pilotWfName,
      )}; confirm data access and integration scope; agree pilot selection.`,
    ],
    [
      'Weeks 3–6',
      'Pilot Build &amp; Testing',
      `Deploy AI agent for ${esc(
        pilotWfName,
      )}; QA and calibration cycles; weekly accuracy reports; human review gates active throughout.`,
    ],
    [
      'Weeks 7–8',
      'Controlled Go-Live',
      `Full pilot rollout on approved workflows; performance instrumentation live; weekly dashboard; anomaly escalation active.`,
    ],
    [
      'Weeks 9–10',
      'ROI Validation &amp; Expansion',
      `Measure actual hours returned vs. modelled; calculate realised Operational Dividend; present Phase 2 roadmap.`,
    ],
  ]
    .map(
      ([timeline, phase, activities]) =>
        `<tr>` +
        `<td style="color:#2957FF;font-weight:bold;white-space:nowrap">${timeline}</td>` +
        `<td><strong>${phase}</strong></td>` +
        `<td>${activities}</td>` +
        `</tr>`,
    )
    .join('')
}

function buildProvenanceTableBody(
  roi: RoiCalculatorOutput['roi_data'],
  modelerOut: RoiModelerOutput | null | undefined,
  revenueAnchor: number | null | undefined,
  revenueAnchorSource: string | null | undefined,
  profitLevers: ReportWriterOutput['profit_levers'],
): string {
  const sym = roi.currency.symbol
  const rows: {
    input: string
    detail: string
    source: string
    status: string
  }[] = []

  if (revenueAnchor) {
    rows.push({
      input: 'Annual revenue anchor',
      detail: `${sym}${revenueAnchor}M estimated`,
      source: revenueAnchorSource ?? 'Benchmarked',
      status: (revenueAnchorSource ?? '').toLowerCase().includes('scrap')
        ? 'Validated'
        : 'Needs validation',
    })
  }

  if (roi.employees) {
    rows.push({
      input: 'Headcount',
      detail: `${roi.employees.toLocaleString()} employees`,
      source: 'Scraped — LinkedIn / Apollo',
      status: 'Validated',
    })
  }

  roi.workflows.forEach((wf) => {
    const wa = modelerOut?.workflowAssumptions?.find(
      (a) => a.workflowName === wf.name,
    )
    const seniorityLabel = wa?.seniorityLevel
      ? ` (${wa.seniorityLevel})`
      : ' (blended)'
    rows.push({
      input: `${wf.name} — blended rate`,
      detail: `${sym}${wf.rate}/hr${seniorityLabel}`,
      source: wa?.rateSource ?? 'Benchmarked',
      status: 'Needs validation',
    })
    rows.push({
      input: `${wf.name} — monthly volume`,
      detail: `${wf.volume}/mo estimated`,
      source:
        wf.source === 'user_stated'
          ? 'User-stated'
          : wf.source === 'research_derived'
          ? 'Scraped'
          : 'Benchmarked',
      status: wf.source === 'user_stated' ? 'Validated' : 'Needs validation',
    })
  })

  rows.push({
    input: 'Automation time reduction %',
    detail: roi.workflows.map((w) => `${w.savingsPct}% — ${w.name}`).join('; '),
    source: 'Benchmarked — LyRise + McKinsey 2023',
    status: 'Industry standard',
  })

  if (profitLevers?.length) {
    profitLevers.forEach((l) => {
      rows.push({
        input: `Profit lever — ${l.lever_name}`,
        detail: l.baseline_data,
        source: 'Benchmarked',
        status: 'Needs validation',
      })
    })
  }

  const statusStyle = (s: string) =>
    s === 'Validated'
      ? 'color:#166534;font-weight:bold'
      : s === 'Industry standard'
      ? 'color:#1d4ed8'
      : 'color:#92400e'

  return rows
    .map(
      (r) =>
        `<tr>` +
        `<td><strong>${esc(r.input)}</strong></td>` +
        `<td>${esc(r.detail)}</td>` +
        `<td style="font-size:8.5pt;color:#64748b">${esc(r.source)}</td>` +
        `<td style="font-size:8pt;${statusStyle(r.status)}">${esc(
          r.status,
        )}</td>` +
        `</tr>`,
    )
    .join('')
}

// ── Main function ─────────────────────────────────────────────────────────────

export function assembleReport(
  calcOut: RoiCalculatorOutput,
  writerOut: ReportWriterOutput,
  normInput: NormalizedInput,
  reportState?: Partial<ReportState>,
): AssembleReportOutput {
  const roi = calcOut.roi_data
  const sym = roi.currency.symbol
  const s = roi.summary

  const fmt = (n: number | null | undefined) =>
    n != null && !Number.isNaN(+n) ? addCommas(+n) : '—'
  const cur = (n: number) => sym + fmt(n)
  const short = (n: number) => {
    if (n == null || Number.isNaN(+n)) return '—'
    const v = Math.round(+n)
    if (v >= 1_000_000) return sym + (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 1_000) return sym + Math.round(v / 1_000) + 'K'
    return cur(v)
  }

  const tf12 = s.operationalDividend12mo + s.profitUplift12mo
  const wfs = [...roi.workflows].sort((a, b) => b.annualValue - a.annualValue)
  const totalMonthlyHours = wfs.reduce((a, w) => a + w.monthlyHours, 0)
  const totalMonthlyCost = wfs.reduce((a, w) => a + w.monthlyCost, 0)
  const totalHrsBefore = wfs.reduce(
    (acc, w) => acc + Math.round((w.volume * w.timeBefore) / 60),
    0,
  )
  const totalHrsAfter = totalHrsBefore - Math.round(s.totalAnnualHours / 12)
  const totalValMo = wfs.reduce(
    (acc, w) => acc + Math.round(w.monthlyHours * w.rate),
    0,
  )

  // Date — loop-based, no toLocaleDateString (PDF renderer safe)
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const now = new Date()
  const currentDate = `${
    MONTHS[now.getMonth()]
  } ${now.getDate()}, ${now.getFullYear()}`

  // Case studies
  const selectedStudies = selectCaseStudies()
  const caseStudiesHTML = buildCaseStudiesHTML(selectedStudies)

  // Scope list
  const scopeListHTML = wfs.map((w) => `<li>${esc(w.name)}</li>`).join('')

  // As-Is Baseline table — 8 cols including SOURCE
  const asisTableBody =
    wfs
      .map((wf) => {
        const srcClass =
          wf.source === 'user_stated'
            ? 'badge-scraped'
            : wf.source === 'research_derived'
            ? 'badge-scraped'
            : 'badge-benchmarked'
        const srcLabel =
          wf.source === 'user_stated'
            ? 'User-stated'
            : wf.source === 'research_derived'
            ? 'Scraped'
            : 'Benchmarked'
        const timeBeforeHrs = (wf.timeBefore / 60).toFixed(2)
        return (
          `<tr>` +
          `<td><strong>${esc(wf.name)}</strong></td>` +
          `<td>${esc(wf.owner || '—')}</td>` +
          `<td style="text-align:center">${fmt(wf.volume)}</td>` +
          `<td style="text-align:center">${timeBeforeHrs} hrs</td>` +
          `<td>${sym}${fmt(wf.rate)}/hr</td>` +
          `<td>${sym}${fmt(wf.costPerRun)}</td>` +
          `<td><strong>${sym}${fmt(wf.monthlyCost)}</strong></td>` +
          `<td><span class="${srcClass}">${srcLabel}</span></td>` +
          `</tr>`
        )
      })
      .join('') +
    `<tr class="total-row">` +
    `<td colspan="7"><strong>Total monthly run-cost</strong></td>` +
    `<td><strong>${sym}${fmt(totalMonthlyCost)}</strong></td>` +
    `</tr>`

  // Before vs After table — time in hours, last col monthly value
  const bvaTableBody =
    wfs
      .map((wf) => {
        const beforeHrs = (wf.timeBefore / 60).toFixed(2)
        const afterHrs = (wf.timeAfter / 60).toFixed(2)
        const savedHrs = ((wf.timeBefore - wf.timeAfter) / 60).toFixed(2)
        const monthlyValue = Math.round(wf.monthlyHours * wf.rate)
        return (
          `<tr>` +
          `<td><strong>${esc(wf.name)}</strong></td>` +
          `<td style="text-align:center">${fmt(wf.volume)}</td>` +
          `<td style="text-align:center">${beforeHrs} hrs</td>` +
          `<td style="text-align:center">${afterHrs} hrs</td>` +
          `<td style="text-align:center">${savedHrs} hrs</td>` +
          `<td style="text-align:center">${fmt(wf.monthlyHours)} hrs</td>` +
          `<td>${sym}${fmt(wf.rate)}/hr</td>` +
          `<td class="accent"><strong>${sym}${fmt(
            monthlyValue,
          )}</strong></td>` +
          `</tr>`
        )
      })
      .join('') +
    `<tr class="total-row">` +
    `<td colspan="5"><strong>Monthly capacity unlocked</strong></td>` +
    `<td><strong>${fmt(totalMonthlyHours)} hrs</strong></td>` +
    `<td></td>` +
    `<td class="accent"><strong>${sym}${fmt(
      totalMonthlyCost,
    )}/mo</strong></td>` +
    `</tr>`

  // Profit Levers table — v3.0 includes derived_from + arithmetic rationale columns
  const levers = writerOut.profit_levers ?? []
  const profitLeversBody =
    levers
      .map(
        (l) =>
          `<tr>` +
          `<td><strong>${esc(l.lever_name ?? '')}</strong></td>` +
          `<td style="color:#64748b;font-size:8.5pt">${esc(
            l.derived_from ?? '',
          )}</td>` +
          `<td>${esc(l.baseline_data ?? '')}</td>` +
          `<td>${esc(l.assumption ?? '')}</td>` +
          `<td style="font-size:8pt;color:#2d2d2d;font-family:monospace">${esc(
            l.rationale_with_arithmetic ?? l.rationale ?? '',
          )}</td>` +
          `<td class="accent"><strong>${sym}${fmt(
            +(l.profit ?? 0),
          )}</strong></td>` +
          `</tr>`,
      )
      .join('') +
    `<tr class="total-row">` +
    `<td colspan="5"><strong>12-month incremental profit</strong></td>` +
    `<td class="accent"><strong>${sym}${fmt(
      s.profitUplift12mo,
    )}</strong></td>` +
    `</tr>`

  // Deploy table — 4 separate columns
  const deployTableBody = wfs
    .map(
      (wf) =>
        `<tr>` +
        `<td><strong>${esc(wf.name)}</strong></td>` +
        `<td>${esc(wf.expectedOutcome ?? '')}</td>` +
        `<td class="accent"><strong>${esc(wf.agentName ?? '')}</strong></td>` +
        `<td>${esc(wf.whyItMatters ?? '')}</td>` +
        `</tr>`,
    )
    .join('')

  // Provenance table — modeling assumptions (not user input rows)
  const provenanceTableHTML =
    `<table><thead><tr>` +
    `<th style="width:22%">Input</th>` +
    `<th style="width:36%">Detail</th>` +
    `<th style="width:28%">Source</th>` +
    `<th style="width:14%">Status</th>` +
    `</tr></thead><tbody>` +
    buildProvenanceTableBody(
      roi,
      reportState?.modelerOutput,
      reportState?.revenueAnchor,
      reportState?.revenueAnchorSource,
      writerOut.profit_levers,
    ) +
    `</tbody></table>`

  // ── v3.0 display fields ───────────────────────────────────────────────────

  // Revenue context statement — use revenueAnchor if available, else fall back to roi.revenue (millions)
  const revenueAnchor = reportState?.revenueAnchor
  const revenueBase =
    revenueAnchor && revenueAnchor > 0
      ? revenueAnchor
      : roi.revenue && roi.revenue > 0
      ? roi.revenue * 1_000_000
      : 0
  const revenueContextStatement =
    revenueBase > 0
      ? `This represents approximately ${Math.round(
          (tf12 / revenueBase) * 100,
        )}% of your estimated annual revenue returned through operational efficiency — without adding headcount.`
      : ''

  // Confidence badge
  const confLevel = reportState?.confidenceLevel ?? 'low'
  const confidenceBadge =
    confLevel === 'high'
      ? 'Insight-Driven Analysis'
      : 'Hypothesis-Driven Projection'

  // Company snapshot table body
  const companySnapshotTableBody = buildCompanySnapshotTableBody(
    writerOut.company_snapshot ?? [],
    roi.employees,
    roi.revenue,
    sym,
    reportState?.revenueAnchorSource,
  )

  // Cost of delay
  const costOfDelayHTML = buildCostOfDelayHTML(
    sym,
    writerOut.cost_of_delay ?? {
      monthly_cost: Math.round(tf12 / 12),
      narrative: `Every month without automation costs your team the equivalent of ${sym}${addCommas(
        Math.round(tf12 / 12),
      )} in recoverable value. Delay is not neutral — it carries a monthly price.`,
    },
  )

  // Resilience table
  const resilienceTableHTML = buildResilienceTableHTML(
    writerOut.resilience_rows ?? [],
  )

  // Risks table
  const risksTableBody = buildRisksTableBody(writerOut.risks ?? [])

  // Next steps
  const nextStepsHTML = buildNextStepsHTML(
    writerOut.next_steps_checklist ?? [],
    writerOut.cta_paragraph ||
      `Let us show you how we can return ${fmt(
        totalMonthlyHours,
      )} hours to your team each month.`,
  )

  // OD vs PU distinction panel
  const odVsPuPanelHTML = buildOdVsPuPanelHTML(
    sym,
    s.operationalDividend12mo,
    s.profitUplift12mo,
  )

  // Calculation panel (all workflows)
  const calculationPanelHTML =
    wfs.length > 0
      ? buildCalculationPanelHTML(
          sym,
          wfs,
          totalMonthlyHours,
          s.operationalDividend12mo,
        )
      : ''

  // Roadmap table (pilot = highest-value workflow)
  const roadmapTableBody =
    wfs.length > 0 ? buildRoadmapTableBody(wfs[0].name) : ''
  const profileParts: string[] = []
  if (roi.employees)
    profileParts.push(`${roi.employees.toLocaleString()}-person`)
  if (roi.industry) profileParts.push(roi.industry.toLowerCase())
  const profileDesc = profileParts.length
    ? `${roi.company} is a ${profileParts.join(' ')} firm`
    : roi.company
  const wfNames = wfs.map((w) => w.name.toLowerCase()).join(', ')
  const blufParagraph =
    `${profileDesc}. Across its workflows — ${wfNames} — the same structural` +
    ` drain recurs: qualified professionals spending significant time on high-volume, rules-based` +
    ` process that does not require their judgment. This report estimates ${cur(
      tf12,
    )} in Total` +
    ` Financial Gain available through targeted AI deployment — without adding headcount.`
  const bvaTableBodyCompact =
    wfs
      .map((wf) => {
        const hrsBefore = Math.round((wf.volume * wf.timeBefore) / 60)
        const hrsSaved = Math.round(wf.monthlyHours)
        const hrsAfter = hrsBefore - hrsSaved
        const valMo = Math.round(wf.monthlyHours * wf.rate)
        return (
          `<tr>` +
          `<td style="font-weight:bold">${esc(wf.name)}</td>` +
          `<td style="text-align:center">${hrsBefore}</td>` +
          `<td style="text-align:center">${hrsAfter}</td>` +
          `<td style="text-align:center;font-weight:bold">${hrsSaved}</td>` +
          `<td style="text-align:right;color:#003F87;font-weight:bold">${sym}${addCommas(
            valMo,
          )}</td>` +
          `<td style="color:#5a5a6e">${esc(wf.agentName ?? '')}</td>` +
          `</tr>`
        )
      })
      .join('') +
    `<tr class="total-row">` +
    `<td><strong>TOTALS</strong></td>` +
    `<td style="text-align:center"><strong>${totalHrsBefore}</strong></td>` +
    `<td style="text-align:center"><strong>${totalHrsAfter}</strong></td>` +
    `<td style="text-align:center"><strong>${fmt(
      s.totalAnnualHours / 12,
    )}</strong></td>` +
    `<td style="text-align:right"><strong>${sym}${addCommas(
      totalValMo,
    )}</strong></td>` +
    `<td style="color:#fff;font-size:8pt">${fmt(
      s.totalAnnualHours,
    )} hrs/yr · ${(s.totalAnnualHours / 2000).toFixed(1)} FTE equiv.</td>` +
    `</tr>`
  const totalPU = (writerOut.profit_levers ?? []).reduce(
    (acc, l) => acc + Number(l.profit || 0),
    0,
  )
  const profitUpliftLogicBody =
    (writerOut.profit_levers ?? [])
      .map(
        (l) =>
          `<tr>` +
          `<td style="color:#003F87;font-weight:bold;vertical-align:top;width:22%">${esc(
            l.derived_from,
          )}<br>` +
          `<span style="font-weight:bold">${sym}${addCommas(
            Number(l.profit),
          )}/yr</span></td>` +
          `<td style="font-style:italic;vertical-align:top;width:22%;font-size:8.5pt">${esc(
            l.lever_name,
          )}</td>` +
          `<td style="color:#5a5a6e;vertical-align:top;width:56%;font-size:8pt">${esc(
            l.rationale_with_arithmetic,
          )}</td>` +
          `</tr>`,
      )
      .join('') +
    `<tr class="total-row">` +
    `<td colspan="2" style="color:#fff;font-weight:bold;font-size:8.5pt">Total Profit Uplift: ${sym}${addCommas(
      totalPU,
    )}/yr</td>` +
    `<td style="color:#aad0ff;font-size:8.5pt">Total Financial Gain: ${sym}${addCommas(
      tf12,
    )}/yr · All levers require validation in Phase 1.</td>` +
    `</tr>`

  const display: DisplayObject = {
    // Original fields
    currencyCode: roi.currency.code,
    currencySymbol: sym,
    workflowCount: String(wfs.length),
    coverHeadline: `${fmt(totalMonthlyHours)} hrs returned & ${short(
      tf12,
    )} total financial gain — 12-month conservative estimate`,

    statHours: fmt(s.totalAnnualHours),
    statHoursSub: fmt(totalMonthlyHours),
    statOD: short(s.operationalDividend12mo),
    statPU: short(s.profitUplift12mo),
    statTF: short(tf12),
    statFTE: (s.totalAnnualHours / 2000).toFixed(1),

    totalAnnualHours: fmt(s.totalAnnualHours),
    totalMonthlyHours: fmt(totalMonthlyHours),
    od12: cur(s.operationalDividend12mo),
    pu12: cur(s.profitUplift12mo),
    tf12: cur(tf12),

    hrs24: fmt(Math.round(s.totalAnnualHours * 2.15)),
    od24: cur(s.operationalDividend24mo),
    pu24: cur(s.profitUplift24mo),
    tf24: cur(s.totalFinancialGain24mo),
    hrs36: fmt(Math.round(s.totalAnnualHours * 3.4)),
    od36: cur(s.operationalDividend36mo),
    pu36: cur(s.profitUplift36mo),
    tf36: cur(s.totalFinancialGain36mo),

    employeesDisplay: roi.employees
      ? `${addCommas(roi.employees)} (est. midpoint)`
      : 'Not specified',
    revenueDisplay: roi.revenue
      ? `${sym}${roi.revenue}M (est. midpoint)`
      : 'Not specified',

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
    cta:
      writerOut.cta_paragraph ||
      `Let us show you how we can return ${fmt(
        totalMonthlyHours,
      )} hours to your team each month.`,

    // v3.0 fields
    revenueContextStatement,
    companySnapshotTableBody,
    confidenceBadge,
    unifiedPatternThesis: writerOut.unified_pattern_thesis ?? '',
    costOfDelayHTML,
    resilienceTableHTML,
    pilotRecommendation: writerOut.pilot_recommendation ?? '',
    risksTableBody,
    nextStepsHTML,
    odVsPuPanelHTML,
    calculationPanelHTML,
    roadmapTableBody,
    blufParagraph,
    bvaTableBodyCompact,
    profitUpliftLogicBody,
  }

  return {
    roi_data: roi,
    copy: writerOut,
    display,
    current_date: currentDate,
    recipient_email: normInput.email ?? '',
  }
}
