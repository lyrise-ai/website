// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for the ROIGEN pipeline
// ─────────────────────────────────────────────────────────────────────────────

// ── Questionnaire input ──────────────────────────────────────────────────────

export interface ProcessInput {
  name: string
  department: string
  icon: string
  volume_per_month: string | null
  time_per_item: string | null
  owner_role: string | null
  systems_used: string[]
  decision_points: string[]
  handoffs: string[]
  steps: string[]
}

export interface QuestionnairePayload {
  'Company Name': string
  'Company Website URL': string
  'What does your company do?': string
  'Number of Employees': string
  'Estimated Annual Revenue': string
  'Operating Currency': string
  Email: string
  'Recipient Name'?: string
  'Recipient Title'?: string
  Industry: string
  Country: string
  'Key Priorities': string[]
  processes: ProcessInput[]
  // Legacy flat fields (backward compat)
  'Biggest time drain on your team'?: string
  'Monthly volume of this process (approx.)'?: string
  'Primary process time per item'?: string
  'Any other bottlenecks to mention? (optional)'?: string
}

// ── Normalized input (output of normalize.ts) ───────────────────────────────

export interface NormalizedInput {
  companyName: string
  website: string
  email: string
  recipientName: string
  recipientTitle: string
  selectedCurrency: string
  businessDescription: string
  teamSize: string
  revenueRange: string
  industry: string
  country: string
  keyPriorities: string[]
  processes: ProcessInput[]
  primaryProcess: string
  volumeHint: string
  primaryTimeHint: string
  additionalContext: string
  workContext: string
}

// ── Research Agent output ────────────────────────────────────────────────────

export interface CompanyProfile {
  company: string
  industry: string
  country: string | null
  primaryFocus: string | null
  keyPriorities: string[]
  employees: number | null
  revenueEstimateM: number | null
}

export interface PainPoint {
  title: string
  description: string
  confidence: 'high' | 'medium' | 'low'
  source: 'user_stated' | 'inferred' | 'research_derived'
}

export interface WorkflowPlan {
  name: string
  function: string
  owner: string
  whyItMatters: string
  agentName: string
  expectedOutcome: string
  sourceType: 'user_stated' | 'inferred' | 'research_derived'
  // Research-derived volume estimates
  monthlyVolume?: number
  minutesPerItemBefore?: number
  minutesPerItemAfter?: number
  volumeRationale?: string
}

export interface ResearchAgentOutput {
  company_profile: CompanyProfile
  pain_points: PainPoint[]
  workflows: WorkflowPlan[]
  researchSummary?: string
}

// ── ROI Modeler output ───────────────────────────────────────────────────────

export interface Currency {
  code: string
  symbol: string
  name: string
}

export interface WorkflowAssumption {
  workflowName: string
  monthlyVolume: number
  minutesPerItemBefore: number
  minutesPerItemAfter: number
  exceptionRate: number
  exceptionMinutes: number
  adoption_low: number
  adoption_base: number
  adoption_high: number
  rationale: string
  // v3.0 Rule 6A — per-workflow seniority-differentiated rate
  fullyLoadedHourlyCostOverride?: number // overrides labor.fullyLoadedHourlyCost for this workflow
  rateSource?: string // e.g. "Gulf Talent mid-market rate, 2024"
  seniorityLevel?: string // e.g. "Junior analyst", "Senior consultant"
}

export interface RoiModelerOutput {
  currency: Currency
  costs: {
    implementationCost: number
    monthlyToolingCost: number
  }
  labor: {
    fullyLoadedHourlyCost: number
    workWeeksPerYear: number
  }
  realizationFactor: number
  profitMultiplier: number
  workflowAssumptions: WorkflowAssumption[]
  rollout: {
    timeToDeployWeeks: number
    rampUpWeeks: number
  }
  notes: {
    assumptions: string[]
  }
}

// ── ROI Calculator output ────────────────────────────────────────────────────

export interface WorkflowResult {
  name: string
  function: string
  owner: string
  agentName: string
  whyItMatters: string
  expectedOutcome: string
  source: 'user_stated' | 'inferred' | 'research_derived'
  volume: number
  timeBefore: number
  timeAfter: number
  timeSaved: number
  savingsPct: number
  costPerRun: number
  monthlyCost: number
  monthlyHours: number
  monthlyValue: number
  annualHours: number
  annualValue: number
  rate: number
  rationale: string
}

export interface RoiSummary {
  totalAnnualHours: number
  operationalDividend12mo: number
  profitUplift12mo: number
  totalFinancialGain12mo: number
  operationalDividend24mo: number
  profitUplift24mo: number
  totalFinancialGain24mo: number
  operationalDividend36mo: number
  profitUplift36mo: number
  totalFinancialGain36mo: number
  implCost: number
  monthlyTooling: number
  paybackMonths: number | null
}

export interface RoiData {
  company: string
  industry: string
  country: string | null
  primaryFocus: string | null
  keyPriorities: string[]
  employees: number | null
  revenue: number | null
  currency: Currency
  workflows: WorkflowResult[]
  totalMonthlyHours: number
  totalAnnualHours: number
  profitMultiplier: number
  realizationFactor: number
  workWeeksPerYear: number
  summary: RoiSummary
}

export interface Figures {
  totalMonthlyHours: string
  totalAnnualHours: string
  statFTE: string
  operationalDividend12mo: string
  profitUplift12mo: string
  totalFinancialGain12mo: string
  totalFinancialGainShort: string
  workflowLines: string[]
}

export interface RoiCalculatorOutput {
  roi_data: RoiData
  figures: Figures
  analystData: ResearchAgentOutput
  modelerNotes: string[]
}

// ── v3.0 Report Writer types ─────────────────────────────────────────────────

// Company snapshot item with source provenance
export interface CompanySnapshotItem {
  text: string
  sourceType: 'scraped' | 'benchmarked' | 'assumed'
}

// Cost of delay block (KR-18)
export interface CostOfDelayData {
  monthly_cost: number // totalFinancialGain12mo / 12 — exact model number
  narrative: string // MUST end with: "Delay is not neutral — it carries a monthly price."
}

// Resilience positioning row (KR-17) — 4 rows × 2 columns
export interface ResilienceRow {
  dimension: string // e.g. "Cost per unit", "Delivery speed"
  act_now: string // concrete automated-state outcome
  defer: string // concrete manual-state risk
}

// Risk row for Risks & Mitigations section
export interface RiskRow {
  risk: string
  detail: string // 2-3 sentences explaining why this risk matters for this specific company
  mitigation: string
}

// Next steps checklist item (NS-2) — assignable to named individuals
export interface ChecklistItem {
  action: string
  owner: string // named individual or role
  due: string // e.g. "Within 5 business days"
}

export interface ProfitLever {
  lever_name: string
  baseline_data: string
  assumption: string
  rationale: string // plain business sentence (kept for compat)
  rationale_with_arithmetic: string // Rule 6C: full arithmetic chain
  derived_from: string // workflow name(s) this lever originates from
  profit: string // raw integer as string, no symbols
}

export interface ReportWriterOutput {
  // Original fields
  cta_paragraph: string // NS-1: criteria-based, not marketing language
  profit_levers: ProfitLever[]

  // v3.0 additions
  unified_pattern_thesis: string // KR-16: 2-3 sentences naming single operating pattern
  company_snapshot: CompanySnapshotItem[] // 3-5 bullets with source tags
  cost_of_delay: CostOfDelayData // KR-18
  resilience_rows: ResilienceRow[] // KR-17: exactly 4 rows
  pilot_recommendation: string // WD-1: references specific company characteristics
  risks: RiskRow[] // 3+ rows
  next_steps_checklist: ChecklistItem[] // NS-2: exactly 6 items with named owners
}

// ── Assemble Report output (display object) ──────────────────────────────────

export interface DisplayObject {
  // Original fields
  currencyCode: string
  currencySymbol: string
  workflowCount: string
  coverHeadline: string
  statHours: string
  statHoursSub: string
  statOD: string
  statTF: string
  statFTE: string
  totalAnnualHours: string
  totalMonthlyHours: string
  od12: string
  pu12: string
  tf12: string
  hrs24: string
  od24: string
  pu24: string
  tf24: string
  hrs36: string
  od36: string
  pu36: string
  tf36: string
  employeesDisplay: string
  revenueDisplay: string
  recipientDisplay: string
  caseStudiesHTML: string
  scopeListHTML: string
  asisTableBody: string
  bvaTableBody: string
  profitLeversBody: string
  deployTableBody: string
  provenanceTableHTML: string
  cta: string

  // v3.0 additions
  revenueContextStatement: string // "This represents X% of your estimated annual revenue…"
  companySnapshotTableBody: string // <tr> rows for Company Snapshot table (Detail | Source)
  confidenceBadge: string // "Insight-Driven Analysis" | "Hypothesis-Driven Projection"
  unifiedPatternThesis: string // verbatim from writerOutput.unified_pattern_thesis
  costOfDelayHTML: string // KR-18 formatted insight panel
  resilienceTableHTML: string // KR-17 2-column comparison table
  pilotRecommendation: string // verbatim from writerOutput.pilot_recommendation
  risksTableBody: string // <tr> rows for Risks & Mitigations table
  nextStepsHTML: string // NS-1 criteria intro + NS-2 6-item checklist
  odVsPuPanelHTML: string // OD vs PU distinction panel (after Profit Uplift)
  calculationPanelHTML: string // arithmetic transparency panel (Rule 6C)
  roadmapTableBody: string // <tr> rows for company-specific roadmap table
  statPU: string // short profit uplift e.g. "€387K"
  blufParagraph: string // auto-assembled BLUF intro paragraph
  bvaTableBodyCompact: string // 6-col BVA compact table rows for exec template
  profitUpliftLogicBody: string // 3-col profit uplift logic table rows for exec template
}

export interface AssembleReportOutput {
  roi_data: RoiData
  copy: ReportWriterOutput
  display: DisplayObject
  current_date: string
  recipient_email: string
}

// ── Unified Agent types ──────────────────────────────────────────────────────

export interface ReportState {
  normInput: NormalizedInput
  researchOutput: ResearchAgentOutput | null
  modelerOutput: RoiModelerOutput | null
  calcOutput: RoiCalculatorOutput | null
  writerOutput: ReportWriterOutput | null
  assembled: AssembleReportOutput | null
  renderedHtml: string | null
  renderedFullHtml: string | null
  // v3.0 intelligence fields (set during research phase)
  confidenceLevel: 'high' | 'low' | null
  revenueAnchor: number | null // estimated annual revenue in base currency
  revenueAnchorSource: string | null // e.g. "scraped from Clodura" / "headcount × industry avg"
  coreThesis: string | null // "[bottleneck] + [automation opportunity]"
}

export interface AgentCallbacks {
  onTextDelta(delta: string): void
  onToolStart(toolName: string): void
  onReportUpdate(state: ReportState): void
  onDone(newMessages: import('ai').ModelMessage[]): void
  onError(err: Error): void
}

// ── SSE event types ──────────────────────────────────────────────────────────

export type PipelineEvent =
  | { type: 'progress'; step: string; message: string }
  | { type: 'complete'; reportHtml: string; company: string; email: string }
  | { type: 'error'; message: string }

export type AgentEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_start'; tool: string }
  | { type: 'report_update'; state: ReportState }
  | { type: 'done'; messages?: import('ai').ModelMessage[] }
  | { type: 'error'; message: string }
