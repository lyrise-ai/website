// ─────────────────────────────────────────────────────────────────────────────
// ROI Modeler system prompt
// Receives research agent output + questionnaire data.
// Produces financial assumptions for the ROI Calculator.
// ─────────────────────────────────────────────────────────────────────────────

export const ROI_MODELER_SYSTEM_PROMPT = `
You are generating numeric ROI assumptions for an AI automation report.

Input fields: company_profile, workflows[] (4 workflows from the Research Agent,
each with research-derived monthlyVolume and minutesPerItemBefore),
processes[] (questionnaire data), selectedCurrency.

CURRENCY: Parse from selectedCurrency (format "CODE – Name (symbol)").
Use exact GCC symbols: SAR→"ر.س", AED→"د.إ", QAR→"ر.ق", KWD→"د.ك", BHD→"BD", OMR→"ر.ع.".
If blank, infer from country.

VOLUME & TIME ANCHORING:
The Research Agent has already derived monthlyVolume and minutesPerItemBefore
for each workflow from company research. Use these as your primary anchors.
Only override if they are clearly unrealistic (e.g. exceed employees × 3).
If questionnaire process data provides a more specific volume, use it to validate
or refine — but do not blindly override the research-derived value.

minutesPerItemAfter: use the research agent's minutesPerItemAfter if provided,
otherwise apply these reduction targets:
- Document generation: 70–85% reduction
- Data entry / CRM / logging: 80–92% reduction
- Status reporting: 72–85% reduction
- Onboarding / scheduling: 55–72% reduction
- Email / communications: 70–82% reduction
- Invoice / reconciliation: 65–80% reduction
minutesPerItemAfter must be ≤ 40% of minutesPerItemBefore.

VOLUME CEILING: No single workflow monthlyVolume may exceed employees × 2.

COSTS:
- implementationCost: MUST equal 6–10× estimated monthly labor savings.
- monthlyToolingCost: recurring platform/license fees (typically $200–800/month for SMBs).

RULE 6A — PER-WORKFLOW SENIORITY-DIFFERENTIATED RATES:
You MUST set fullyLoadedHourlyCostOverride for EACH workflow individually.
Do NOT use the same rate for all workflows.
Rate must reflect the seniority of the role that performs this task:
  - Junior/admin roles (data entry, scheduling, reporting): use lower end of regional range
  - Mid-level roles (account management, ops, compliance): use mid range
  - Senior roles (strategy, sales, legal, finance): use upper end
Source your rates from a named benchmark. Cite it in rateSource:
  GCC: Gulf Talent or Bayt.com ($18–28/hr for junior, up to $45/hr for senior)
  Turkey/Egypt: Glassdoor regional ($12–20/hr)
  US/EU: Robert Half or LinkedIn Salary Insights ($45–75/hr)
  UK: Robert Half UK ($40–65/hr)
Set seniorityLevel to describe the role (e.g. "Junior operations analyst", "Senior sales executive").

LABOR (global fallback — used if no override set):
- fullyLoadedHourlyCost: blended rate for this country and industry.
  GCC: $18–28/hr | Turkey/Egypt: $12–20/hr | US/EU: $45–75/hr | UK: $40–65/hr
- workWeeksPerYear: 48 for GCC/Egypt, 50 for US/EU/UK.

realizationFactor: 0.70–0.85.
profitMultiplier: 1.5–4.0. Cap at 3.5 for companies under 500 employees.

workflowAssumptions (exactly 4, names must match workflows input):
- exceptionRate: 0.05–0.20
- adoption_low/base/high
- rationale: 1 sentence citing company scale and why volume is realistic.
- fullyLoadedHourlyCostOverride: required for each workflow (Rule 6A)
- rateSource: required — name the benchmark (Gulf Talent, Bayt.com, Robert Half, LinkedIn Salary Insights, Glassdoor)
- seniorityLevel: required — describe the role seniority

SANITY CHECK — annual labor savings = sum(volume × timeSaved/60 × rate × realization × 12):
- Under 200 employees: $60K–$300K total
- 200–2000 employees: $150K–$700K total
Scale down volumes only if substantially exceeded.

Return valid JSON only.
`.trim()

export const ROI_MODELER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['currency', 'costs', 'labor', 'realizationFactor', 'profitMultiplier', 'workflowAssumptions', 'rollout', 'notes'],
  properties: {
    currency: {
      type: 'object',
      additionalProperties: false,
      required: ['code', 'symbol', 'name'],
      properties: {
        code: { type: 'string' },
        symbol: { type: 'string' },
        name: { type: 'string' },
      },
    },
    costs: {
      type: 'object',
      additionalProperties: false,
      required: ['implementationCost', 'monthlyToolingCost'],
      properties: {
        implementationCost: { type: 'number', minimum: 0 },
        monthlyToolingCost: { type: 'number', minimum: 0 },
      },
    },
    labor: {
      type: 'object',
      additionalProperties: false,
      required: ['fullyLoadedHourlyCost', 'workWeeksPerYear'],
      properties: {
        fullyLoadedHourlyCost: { type: 'number', minimum: 1 },
        workWeeksPerYear: { type: 'number', minimum: 40, maximum: 52 },
      },
    },
    realizationFactor: { type: 'number', minimum: 0.5, maximum: 0.95 },
    profitMultiplier: { type: 'number', minimum: 1.5, maximum: 4.0 },
    workflowAssumptions: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['workflowName', 'monthlyVolume', 'minutesPerItemBefore', 'minutesPerItemAfter',
          'exceptionRate', 'exceptionMinutes', 'adoption_low', 'adoption_base', 'adoption_high',
          'rationale', 'fullyLoadedHourlyCostOverride', 'rateSource', 'seniorityLevel'],
        properties: {
          workflowName: { type: 'string' },
          monthlyVolume: { type: 'number', minimum: 0 },
          minutesPerItemBefore: { type: 'number', minimum: 0 },
          minutesPerItemAfter: { type: 'number', minimum: 0 },
          exceptionRate: { type: 'number', minimum: 0, maximum: 1 },
          exceptionMinutes: { type: 'number', minimum: 0 },
          adoption_low: { type: 'number', minimum: 0, maximum: 1 },
          adoption_base: { type: 'number', minimum: 0, maximum: 1 },
          adoption_high: { type: 'number', minimum: 0, maximum: 1 },
          rationale: { type: 'string' },
          // Rule 6A — per-workflow seniority-differentiated rate
          fullyLoadedHourlyCostOverride: { type: 'number', minimum: 1 },
          rateSource: { type: 'string' },
          seniorityLevel: { type: 'string' },
        },
      },
    },
    rollout: {
      type: 'object',
      additionalProperties: false,
      required: ['timeToDeployWeeks', 'rampUpWeeks'],
      properties: {
        timeToDeployWeeks: { type: 'number', minimum: 0 },
        rampUpWeeks: { type: 'number', minimum: 0 },
      },
    },
    notes: {
      type: 'object',
      additionalProperties: false,
      required: ['assumptions'],
      properties: {
        assumptions: { type: 'array', items: { type: 'string' }, maxItems: 10 },
      },
    },
  },
} as const
