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
  'Email': string
  'Recipient Name'?: string
  'Recipient Title'?: string
  'Industry': string
  'Country': string
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
  // Research-derived volume estimates (new — not in n8n version)
  monthlyVolume?: number
  minutesPerItemBefore?: number
  minutesPerItemAfter?: number
  volumeRationale?: string
}

export interface ResearchAgentOutput {
  company_profile: CompanyProfile
  pain_points: PainPoint[]
  workflows: WorkflowPlan[]
  researchSummary?: string  // What was found during research
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

// ── Report Writer output ─────────────────────────────────────────────────────

export interface ProfitLever {
  lever_name: string
  baseline_data: string
  assumption: string
  rationale: string
  profit: string  // raw integer as string, no symbols
}

export interface ReportWriterOutput {
  cta_paragraph: string
  profit_levers: ProfitLever[]
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
}

export interface AssembleReportOutput {
  roi_data: RoiData
  copy: ReportWriterOutput
  display: DisplayObject
  current_date: string
  recipient_email: string
}

// ── SSE event types ──────────────────────────────────────────────────────────

export type PipelineEvent =
  | { type: 'progress'; step: string; message: string }
  | { type: 'complete'; reportHtml: string; company: string; email: string }
  | { type: 'error'; message: string }
