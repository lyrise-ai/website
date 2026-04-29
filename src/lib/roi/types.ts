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

// ── Currency ─────────────────────────────────────────────────────────────────

export interface Currency {
  code: string
  symbol: string
  name: string
}

// ── Single source of truth: company profile ──────────────────────────────────

export interface CompanyProfile {
  company: string
  industry: string
  country: string | null
  primaryFocus: string | null
  keyPriorities: string[]
  employees: number | null
  revenueEstimateM: number | null // estimated annual revenue in millions
}

// ── Single source of truth: per-workflow inputs ──────────────────────────────
// Identity fields come from research; numeric fields are set by the modeler
// and are directly editable via update_workflow in chat mode.

export interface WorkflowInput {
  // Identity (from research phase)
  name: string
  agentName: string
  function: string
  owner: string
  whyItMatters: string
  expectedOutcome: string
  sourceType: 'user_stated' | 'inferred' | 'research_derived'

  // Numeric inputs (set by modeler, editable in chat)
  monthlyVolume: number
  minutesPerItemBefore: number
  minutesPerItemAfter: number
  adoptionRate: number // 0–1
  exceptionRate: number // 0–1
  exceptionMinutes: number
  rateOverride: number | null // per-workflow hourly rate; null = use GlobalInputs.laborRate
  rationale: string
  rateSource?: string // benchmark name from modeler (e.g. "Gulf Talent", "Robert Half")
  seniorityLevel?: string // role seniority description from modeler (e.g. "Senior sales executive")
}

// ── Single source of truth: global financial inputs ──────────────────────────

export interface GlobalInputs {
  laborRate: number // fully-loaded hourly cost (global fallback)
  implementationCost: number
  monthlyToolingCost: number
  profitMultiplier: number
  realizationFactor: number
  workWeeksPerYear: number
  currency: Currency
}

// ── ROI Calculator output — derived values only ──────────────────────────────

export interface WorkflowCalc {
  name: string // mirrors WorkflowInput.name for lookup
  effectiveRate: number // rateOverride if set, else GlobalInputs.laborRate
  timeSaved: number // minutesPerItemBefore - minutesPerItemAfter (minutes)
  savingsPct: number
  costPerRun: number
  monthlyCost: number
  monthlyHours: number
  monthlyValue: number
  annualHours: number
  annualValue: number
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
  workflows: WorkflowCalc[]
  totalMonthlyHours: number
  totalAnnualHours: number
  summary: RoiSummary
  figures: Figures
}

// ── Report copy (formerly ReportWriterOutput) ─────────────────────────────────

export interface CompanySnapshotItem {
  text: string
  sourceType: 'scraped' | 'benchmarked' | 'assumed'
}

export interface PainPoint {
  title: string
  description: string
  confidence: 'high' | 'medium' | 'low'
  source: 'user_stated' | 'inferred' | 'research_derived'
}

export interface ReportEvidenceItem {
  kind:
    | 'search_result'
    | 'search_answer'
    | 'page_content'
    | 'research_summary'
    | 'workflow_signal'
    | 'company_fact'
    | 'unknown'
  url?: string | null
  title?: string | null
  query?: string | null
  snippet?: string | null
  content?: string | null
  sourceType?: 'scraped' | 'benchmarked' | 'assumed' | null
  confidence?: 'high' | 'medium' | 'low' | null
  facts?: Record<string, unknown>
  usedInSections?: string[]
  createdAt?: string
}

export interface SpecificityAssessment {
  score: number
  level: 'strong' | 'moderate' | 'weak'
  evidenceCount: number
  researchDerivedWorkflowCount: number
  inferredWorkflowCount: number
  scrapedSnapshotCount: number
  companySignalCount: number
  warnings: string[]
}

export interface CostOfDelayData {
  monthly_cost?: number // computed by calculator; LLM no longer outputs this
  narrative: string
}

export interface ResilienceRow {
  dimension: string
  act_now: string
  defer: string
}

export interface RiskRow {
  risk: string
  detail: string
  mitigation: string
}

export interface ChecklistItem {
  action: string
  owner: string
  due: string
}

export interface ProfitLever {
  lever_name: string
  baseline_data: string
  assumption: string
  rationale: string
  rationale_with_arithmetic: string
  derived_from: string
  profit?: string // legacy — not rendered; total comes from calculator
}

export interface ReportCopy {
  cta_paragraph: string
  profit_levers: ProfitLever[]
  unified_pattern_thesis: string
  company_snapshot: CompanySnapshotItem[]
  cost_of_delay: CostOfDelayData
  resilience_rows: ResilienceRow[]
  pilot_recommendation: string
  risks: RiskRow[]
  next_steps_checklist: ChecklistItem[]
}

// ── Assemble Report output (display object) ──────────────────────────────────

export interface DisplayObject {
  currencyCode: string
  currencySymbol: string
  workflowCount: string
  coverHeadline: string
  statHours: string
  statHoursSub: string
  statOD: string
  statTF: string
  statFTE: string
  statPU: string
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
  workflowMasterTableBody: string
  provenanceTableHTML: string
  cta: string
  revenueContextStatement: string
  companySnapshotTableBody: string
  confidenceBadge: string
  unifiedPatternThesis: string
  costOfDelayHTML: string
  resilienceTableHTML: string
  pilotRecommendation: string
  risksTableBody: string
  nextStepsHTML: string
  odVsPuPanelHTML: string
  calculationPanelHTML: string
  roadmapTableBody: string
  blufParagraph: string
  bvaTableBodyCompact: string
  profitUpliftLogicBody: string
}

// roi_data is a thin display-info object for template placeholders
export interface RoiDisplayData {
  company: string
  industry: string | null
  country: string | null
  employees: number | null
  revenue: number | null // millions
  currency: Currency
  summary: RoiSummary
  totalMonthlyHours: number
  totalAnnualHours: number
}

export interface AssembleReportOutput {
  roi_data: RoiDisplayData
  copy: ReportCopy
  display: DisplayObject
  current_date: string
  recipient_email: string
}

// ── Unified Agent state ───────────────────────────────────────────────────────

export interface ReportState {
  normInput: NormalizedInput | null

  // Single sources of truth — everything editable by tools
  company: CompanyProfile | null
  globals: GlobalInputs | null
  workflows: WorkflowInput[] | null
  copy: ReportCopy | null

  // Derived — recomputed by reAssemble() on every mutation
  calcOutput: RoiCalculatorOutput | null
  assembled: AssembleReportOutput | null
  renderedHtml: string | null
  renderedFullHtml: string | null

  // Metadata
  confidenceLevel: 'high' | 'low' | null
  coreThesis: string | null
  painPoints?: PainPoint[]
  researchSummary?: string | null
  evidenceItems?: ReportEvidenceItem[]
  specificityAssessment?: SpecificityAssessment | null
}

export interface AgentCallbacks {
  onTextDelta(delta: string): void
  onToolStart(toolName: string): void
  onReportUpdate(state: ReportState, changedSections?: string[]): void
  onDone(newMessages: import('ai').ModelMessage[]): void
  onError(err: Error): void
}

// ── SSE event types ──────────────────────────────────────────────────────────

export type AgentEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_start'; tool: string }
  | { type: 'report_update'; state: ReportState }
  | { type: 'done'; messages?: import('ai').ModelMessage[] }
  | { type: 'error'; message: string }
