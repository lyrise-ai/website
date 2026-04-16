import { assembleReport } from '@/src/lib/roi/pipeline/assembleReport'
import { roiCalculator } from '@/src/lib/roi/pipeline/roiCalculator'
import { renderTemplate } from '@/src/lib/roi/pipeline/renderTemplate'

import type {
  Currency,
  NormalizedInput,
  ReportState,
  ResearchAgentOutput,
  ReportWriterOutput,
  RoiModelerOutput,
} from '@/src/lib/roi/types'

const CURRENCY_MAP: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: 'EUR ', name: 'Euro' },
  GBP: { code: 'GBP', symbol: 'GBP ', name: 'British Pound' },
  SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  EGP: { code: 'EGP', symbol: 'EGP ', name: 'Egyptian Pound' },
}

function getCurrency(code: string): Currency {
  return CURRENCY_MAP[code] ?? CURRENCY_MAP.USD
}

function buildResearchOutput(normInput: NormalizedInput): ResearchAgentOutput {
  const company = normInput.companyName || 'LyRise'
  const industry = normInput.industry || 'Technology / SaaS'

  return {
    company_profile: {
      company,
      industry,
      country: normInput.country || 'United Arab Emirates',
      primaryFocus: normInput.businessDescription || 'Selling AI solutions for businesses',
      keyPriorities: normInput.keyPriorities.length > 0
        ? normInput.keyPriorities
        : ['Scale delivery without adding headcount', 'Shorten sales cycles', 'Reduce manual ops work'],
      employees: 35,
      revenueEstimateM: 6,
    },
    pain_points: [
      {
        title: 'Founders and operators are trapped in repeatable GTM work',
        description: `${company} appears to be handling a meaningful amount of lead qualification, scoping, and follow-up work manually.`,
        confidence: 'high',
        source: 'research_derived',
      },
      {
        title: 'Proposal creation and follow-up are slower than they need to be',
        description: 'Sales momentum is likely being lost between discovery calls, proposal drafting, and next-step coordination.',
        confidence: 'medium',
        source: 'inferred',
      },
    ],
    workflows: [
      {
        name: 'Inbound lead qualification',
        function: 'Revenue Operations',
        owner: 'COO',
        whyItMatters: 'Quicker qualification increases response speed and prevents strong inbound interest from going cold.',
        agentName: 'Lead Qualification Agent',
        expectedOutcome: 'Qualified inbound opportunities routed with context in minutes instead of hours.',
        sourceType: 'research_derived',
        monthlyVolume: 180,
        minutesPerItemBefore: 35,
        minutesPerItemAfter: 8,
        volumeRationale: 'Assumes a healthy inbound mix for a growing AI services firm with active outbound and referrals.',
      },
      {
        name: 'Proposal drafting and tailoring',
        function: 'Sales',
        owner: 'COO',
        whyItMatters: 'Proposal turnaround speed directly affects close rates and the team’s ability to run more active deals in parallel.',
        agentName: 'Proposal Drafting Agent',
        expectedOutcome: 'High-quality first drafts generated from discovery notes and reusable proof points.',
        sourceType: 'inferred',
        monthlyVolume: 24,
        minutesPerItemBefore: 180,
        minutesPerItemAfter: 45,
        volumeRationale: 'Assumes a mid-market deal flow where custom proposals still require leadership review.',
      },
      {
        name: 'Discovery recap and follow-up emails',
        function: 'Client Success',
        owner: 'COO',
        whyItMatters: 'Fast follow-up keeps deals moving and reduces leakage between meetings and next actions.',
        agentName: 'Follow-Up Agent',
        expectedOutcome: 'Recaps, action lists, and next-step emails produced automatically after calls.',
        sourceType: 'inferred',
        monthlyVolume: 70,
        minutesPerItemBefore: 50,
        minutesPerItemAfter: 10,
        volumeRationale: 'Assumes multiple discovery and check-in calls per week across pipeline and active prospects.',
      },
      {
        name: 'CRM updates and meeting prep',
        function: 'Operations',
        owner: 'Revenue Ops Lead',
        whyItMatters: 'Manual CRM hygiene is expensive, error-prone, and frequently delayed until after customer-facing work.',
        agentName: 'CRM Ops Agent',
        expectedOutcome: 'Deal records, notes, and meeting briefs updated automatically before and after calls.',
        sourceType: 'research_derived',
        monthlyVolume: 220,
        minutesPerItemBefore: 18,
        minutesPerItemAfter: 4,
        volumeRationale: 'Assumes a high count of touchpoints across leads, opportunities, and delivery stakeholders.',
      },
    ],
    researchSummary: 'Development fixture used to speed up local ROI report testing.',
  }
}

function buildModelerOutput(normInput: NormalizedInput, researchOutput: ResearchAgentOutput): RoiModelerOutput {
  const currency = getCurrency(normInput.selectedCurrency || 'USD')
  const workWeeksPerYear = ['USD', 'EUR', 'GBP'].includes(currency.code) ? 50 : 48

  return {
    currency,
    costs: {
      implementationCost: 28000,
      monthlyToolingCost: 950,
    },
    labor: {
      fullyLoadedHourlyCost: 52,
      workWeeksPerYear,
    },
    realizationFactor: 0.8,
    profitMultiplier: 2.4,
    workflowAssumptions: researchOutput.workflows.map((workflow, index) => {
      const rateOverrides = [42, 68, 48, 34]
      const seniorityLevels = [
        'Revenue operations specialist',
        'Senior solutions consultant',
        'Account executive',
        'Revenue operations coordinator',
      ]
      const rateSources = [
        'LinkedIn Salary Insights blended RevOps benchmark',
        'Robert Half US solutions consultant benchmark',
        'LinkedIn Salary Insights mid-market AE benchmark',
        'Glassdoor operations coordinator benchmark',
      ]

      return {
        workflowName: workflow.name,
        monthlyVolume: workflow.monthlyVolume ?? 100,
        minutesPerItemBefore: workflow.minutesPerItemBefore ?? 60,
        minutesPerItemAfter: workflow.minutesPerItemAfter ?? 15,
        exceptionRate: 0.08,
        exceptionMinutes: index === 1 ? 20 : 12,
        adoption_low: 0.5,
        adoption_base: 0.72,
        adoption_high: 0.88,
        rationale: `${researchOutput.company_profile.company} can realistically automate this workflow quickly because the steps are high-volume, repetitive, and already documented in common tools.`,
        fullyLoadedHourlyCostOverride: rateOverrides[index] ?? 45,
        rateSource: rateSources[index] ?? 'LinkedIn Salary Insights benchmark',
        seniorityLevel: seniorityLevels[index] ?? 'Operations specialist',
      }
    }),
    rollout: {
      timeToDeployWeeks: 4,
      rampUpWeeks: 2,
    },
    notes: {
      assumptions: [
        'Development fast-mode fixture using benchmarked workflow assumptions.',
        'Volumes and rates are calibrated for fast local preview, not external delivery.',
      ],
    },
  }
}

function buildWriterOutput(normInput: NormalizedInput, state: ReportState): ReportWriterOutput {
  const calc = state.calcOutput!
  const roi = calc.roi_data
  const summary = roi.summary
  const workflows = roi.workflows
  const recipient = normInput.recipientName || 'Yousef'
  const recipientTitle = normInput.recipientTitle || 'COO'
  const company = roi.company

  const [wf1, wf2, wf3, wf4] = workflows
  const lever1 = Math.round(summary.profitUplift12mo * 0.45)
  const lever2 = Math.round(summary.profitUplift12mo * 0.3)
  const lever3 = summary.profitUplift12mo - lever1 - lever2

  return {
    unified_pattern_thesis: `${company} is selling complex AI services into live business problems, which creates a repeatable coordination burden across lead handling, proposal assembly, and follow-up. That pattern — high-value commercial work slowed by manual orchestration — is where AI delivers its fastest return.`,
    company_snapshot: [
      { text: `${company} sells AI solutions for businesses.`, sourceType: 'scraped' },
      { text: `Testing fixture assumes a ${roi.employees ?? 35}-person commercial and delivery team.`, sourceType: 'assumed' },
      { text: `The business likely balances inbound demand capture with custom scoping and proposal work.`, sourceType: 'benchmarked' },
    ],
    cta_paragraph: `If your team is handling fast-moving inbound demand, manually drafting custom proposals, and still spending ${calc.figures.totalMonthlyHours} Hours Returned per month on repetitive coordination work, a 30-minute discovery call with LyRise (elena@lyrise.ai) would be worthwhile. This report models ${calc.figures.operationalDividend12mo} in Operational Dividend using only targeted workflow automation.`,
    profit_levers: [
      {
        lever_name: 'More proposals shipped without founder bottlenecks',
        derived_from: wf2.name,
        baseline_data: `${wf2.name} currently returns ${wf2.monthlyHours} hrs/mo according to the calculator output.`,
        assumption: 'Redirect 35% of those recovered commercial hours into additional proposal capacity and pipeline progression.',
        rationale: 'Proposal throughput improves because leadership can review and send more qualified opportunities each month.',
        rationale_with_arithmetic: `${wf2.monthlyHours} hrs/mo × ${wf2.rate}/hr × 0.35 = ${Math.round((wf2.monthlyHours * wf2.rate * 0.35))}/mo → ${lever1}/yr`,
        profit: String(lever1),
      },
      {
        lever_name: 'Faster follow-up lifts conversion efficiency',
        derived_from: `${wf1.name}, ${wf3.name}`,
        baseline_data: `${wf1.name} and ${wf3.name} together remove delay from qualification and post-call follow-up.`,
        assumption: 'Convert 25% of recovered customer-facing hours into faster response and reduced drop-off across active deals.',
        rationale: 'Deals advance more consistently because prospects get qualification decisions and next steps while intent is still high.',
        rationale_with_arithmetic: `${wf1.monthlyHours + wf3.monthlyHours} hrs/mo × ${Math.round((wf1.rate + wf3.rate) / 2)}/hr × 0.25 = ${Math.round(((wf1.monthlyHours + wf3.monthlyHours) * Math.round((wf1.rate + wf3.rate) / 2) * 0.25))}/mo → ${lever2}/yr`,
        profit: String(lever2),
      },
      {
        lever_name: 'Leadership capacity shifts into higher-value selling',
        derived_from: `${wf1.name}, ${wf2.name}, ${wf4.name}`,
        baseline_data: `${company} can redeploy operational and sales coordination time into client conversations, partnerships, and delivery oversight.`,
        assumption: 'Apply the residual recovered capacity to strategic selling, stakeholder management, and expansion work.',
        rationale: 'Profit rises because senior time moves from admin orchestration into revenue-bearing and client-retention activity.',
        rationale_with_arithmetic: `${summary.profitUplift12mo} total PU - ${lever1} - ${lever2} = ${lever3}/yr`,
        profit: String(lever3),
      },
    ],
    cost_of_delay: {
      monthly_cost: summary.totalFinancialGain12mo / 12,
      narrative: `Each month without automation leaves ${company} paying for manual lead handling, proposal assembly, and CRM coordination that do not require senior judgment. Delay is not neutral — it carries a monthly price.`,
    },
    resilience_rows: [
      {
        dimension: 'Cost per unit',
        act_now: 'More opportunities are processed with the same commercial team, lowering effort per qualified deal.',
        defer: 'Manual handling keeps proposal and qualification cost tied directly to headcount growth.',
      },
      {
        dimension: 'Delivery speed',
        act_now: 'Qualification, recap, and proposal cycles move in hours instead of waiting for founder bandwidth.',
        defer: 'High-intent prospects sit in queues between meetings, summaries, and tailored follow-up.',
      },
      {
        dimension: 'Error rate',
        act_now: 'CRM updates and meeting briefs become more consistent because the workflow is systematized.',
        defer: 'Commercial context continues to be lost in handoffs, notes, and incomplete record keeping.',
      },
      {
        dimension: 'Strategic capacity',
        act_now: `${recipientTitle} time is redirected into pricing, partnerships, and closing work.`,
        defer: 'Leadership stays trapped in repetitive revenue operations and coordination loops.',
      },
    ],
    pilot_recommendation: `Given ${company}'s ${roi.employees ?? 35} employees and ${wf2.volume}/month equivalent proposal workload, the fastest path to measurable ROI is automating ${wf2.name} in Phase 1, targeting faster turnaround on tailored commercial offers and cleaner handoff into follow-up.`,
    risks: [
      {
        risk: 'Messy source data',
        detail: `${company} likely stores qualification notes, call context, and commercial assets across multiple tools. If those inputs are inconsistent, the agent output will still need manual review early on.`,
        mitigation: 'Start with one system of record, define mandatory fields, and add human approval before external sending.',
      },
      {
        risk: 'Over-automation of nuanced sales work',
        detail: 'Some proposal and scoping decisions still require senior judgment, especially for bespoke AI engagements. Pushing too much automation too early could flatten quality.',
        mitigation: 'Keep pricing, final scope, and edge-case approvals with the COO until confidence is proven.',
      },
      {
        risk: 'Workflow adoption stalls',
        detail: `${recipient} and the broader team will only realize value if AI-generated drafts actually replace manual work. Partial adoption would slow the payback profile materially.`,
        mitigation: 'Choose one high-volume workflow first, instrument usage weekly, and tie rollout to explicit process ownership.',
      },
    ],
    next_steps_checklist: [
      {
        action: 'Share this report with a key internal stakeholder for commercial process validation.',
        owner: recipient,
        due: 'Within 2 business days',
      },
      {
        action: `Confirm current monthly volume and handling time for ${wf2.name}.`,
        owner: recipientTitle,
        due: 'Within 5 business days',
      },
      {
        action: `Export 20 recent examples from ${wf1.name} and ${wf3.name} for workflow design.`,
        owner: 'Revenue Ops Lead',
        due: 'Week 1',
      },
      {
        action: 'Agree a human-review policy for outbound drafts, proposals, and CRM write-backs.',
        owner: 'Commercial Lead',
        due: 'Week 1',
      },
      {
        action: 'Select a Phase 1 pilot workflow and define success metrics for hours returned and turnaround time.',
        owner: recipient,
        due: 'Week 2',
      },
      {
        action: 'Book a LyRise validation session to pressure-test assumptions and scope implementation.',
        owner: recipient,
        due: 'Week 2',
      },
    ],
  }
}

export function buildDevMockReportState(params: {
  normInput: NormalizedInput
  execTemplateHtml: string
  fullTemplateHtml: string
}): ReportState {
  const { normInput, execTemplateHtml, fullTemplateHtml } = params
  const researchOutput = buildResearchOutput(normInput)
  const modelerOutput = buildModelerOutput(normInput, researchOutput)

  const state: ReportState = {
    normInput,
    researchOutput,
    modelerOutput,
    calcOutput: roiCalculator(researchOutput, modelerOutput),
    writerOutput: null,
    assembled: null,
    renderedHtml: null,
    renderedFullHtml: null,
    confidenceLevel: 'high',
    revenueAnchor: (researchOutput.company_profile.revenueEstimateM ?? 0) * 1_000_000,
    revenueAnchorSource: 'Dev fixture benchmark',
    coreThesis: 'High-value revenue work is slowed by repetitive orchestration that can be automated safely.',
  }

  state.writerOutput = buildWriterOutput(normInput, state)
  state.assembled = assembleReport(state.calcOutput!, state.writerOutput, normInput, state)
  state.renderedHtml = renderTemplate(execTemplateHtml, state.assembled)
  state.renderedFullHtml = renderTemplate(fullTemplateHtml, state.assembled)

  return state
}
