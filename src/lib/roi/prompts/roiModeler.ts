// ─────────────────────────────────────────────────────────────────────────────
// ROI Modeler system prompt
// Receives research agent output + questionnaire data.
// Produces financial assumptions for the ROI Calculator.
// ─────────────────────────────────────────────────────────────────────────────

export const ROI_MODELER_SYSTEM_PROMPT = `
You are generating numeric ROI assumptions for an AI automation report.

Input fields: company_profile, workflows[] (from the Research Agent, each with
research-derived monthlyVolume and minutesPerItemBefore), processes[] (questionnaire
data), selectedCurrency, and optionally researchEvidence[] (web search snippets).

CURRENCY: Parse from selectedCurrency (format "CODE – Name (symbol)").
Always use English/Latin symbols only — never Arabic script. GCC currencies: SAR→"SAR", AED→"AED", QAR→"QAR", KWD→"KWD", BHD→"BHD", OMR→"OMR".
If blank, infer from country.

RATE EVIDENCE — USE FIRST WHEN AVAILABLE:
If researchEvidence is provided, scan every snippet for salary, rate, or compensation
figures (e.g. "AED 70/hr", "$65,000/year", "£55,000 per annum", "SAR 25,000/month").
Scraped figures take priority over the regional ranges below.
Convert annual → hourly: annual ÷ (workWeeksPerYear × 40) × 1.30 (fully-loaded overhead multiplier).
Convert monthly → hourly: monthly × 12 ÷ (workWeeksPerYear × 40) × 1.30.

RULE 6A — PER-WORKFLOW SENIORITY-DIFFERENTIATED RATES (MANDATORY):
You MUST set fullyLoadedHourlyCostOverride for EACH workflow individually.
Do NOT use the same rate for all workflows.

Use the workflow's \`owner\` field to determine seniority tier:
  - "Analyst", "Coordinator", "Associate", "Assistant", "Clerk", "Admin" → junior tier
  - "Manager", "Specialist", "Consultant", "Account Executive", "Officer" → mid tier
  - "Director", "VP", "Partner", "Head of", "C-Level", "Principal", "Senior Manager" → senior tier

Source your rates from a named benchmark. Cite it in rateSource. Use the currency
that matches the company's operating currency (AED for UAE, SAR for Saudi, EGP for Egypt, etc.):

  UAE / GCC (AED): Gulf Talent
    junior/ops: AED 55–75/hr | mid-level: AED 75–100/hr | senior: AED 95–135/hr
  Saudi Arabia (SAR): Bayt.com
    junior/ops: SAR 55–75/hr | mid-level: SAR 75–105/hr | senior: SAR 100–140/hr
  Qatar / Kuwait / Bahrain / Oman (local currency): Gulf Talent
    ops: local equiv of AED 55–75/hr | senior: local equiv of AED 95–135/hr
  Egypt (EGP): Glassdoor MENA
    ops/admin: EGP 650–1,400/hr | mid: EGP 1,400–2,200/hr | senior: EGP 2,200–4,000/hr
  Turkey: Glassdoor regional — $10–18/hr (USD equivalent)
  US: Robert Half or LinkedIn Salary Insights
    ops/marketing: $50–70/hr | compliance/legal-ops: $65–90/hr | senior: $80–115/hr
  EU: Robert Half EU
    ops: €40–65/hr | mid: €55–85/hr | senior: €75–115/hr
  UK: Robert Half UK
    ops: £40–60/hr | mid: £55–82/hr | senior: £75–110/hr

Set seniorityLevel to describe the role (e.g. "Junior operations analyst", "Senior sales executive").

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
- monthlyToolingCost: recurring platform/license fees (typically $200–800/month for SMBs, or local currency equivalent).

LABOR (global fallback — used if no per-workflow override):
- fullyLoadedHourlyCost: blended rate for this country and industry.
  UAE/GCC (AED): AED 80–110 | Saudi (SAR): SAR 80–115 | Egypt (EGP): EGP 1,400–2,200
  Turkey: $12–18/hr | US: $55–85/hr | EU: €50–80/hr | UK: £50–80/hr
- workWeeksPerYear: 48 for GCC/Egypt, 50 for US/EU/UK.

realizationFactor: 0.70–0.85.
profitMultiplier: 1.8–4.0. Cap at 3.5 for companies under 500 employees.

workflowAssumptions (one entry per workflow in the input — names must match exactly):
- exceptionRate: 0.05–0.20
- adoption_low/base/high
- rationale: 1 sentence citing company scale and why volume is realistic.
- fullyLoadedHourlyCostOverride: required for each workflow (Rule 6A)
- rateSource: required — name the benchmark (Gulf Talent, Bayt.com, Robert Half, LinkedIn Salary Insights, Glassdoor)
- seniorityLevel: required — describe the role seniority

SANITY CHECK — annual labor savings = sum(volume × timeSaved/60 × rate × realization × 12):
- Under 200 employees: $60K–$300K total (or local currency equivalent)
- 200–2000 employees: $150K–$700K total (or local currency equivalent)
Scale down volumes only if substantially exceeded.

Return valid JSON only.
`.trim()

export const ROI_MODELER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'currency',
    'costs',
    'labor',
    'realizationFactor',
    'profitMultiplier',
    'workflowAssumptions',
    'rollout',
    'notes',
  ],
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
    profitMultiplier: { type: 'number', minimum: 1.8, maximum: 4.0 },
    workflowAssumptions: {
      type: 'array',
      minItems: 3,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'workflowName',
          'monthlyVolume',
          'minutesPerItemBefore',
          'minutesPerItemAfter',
          'exceptionRate',
          'exceptionMinutes',
          'adoption_low',
          'adoption_base',
          'adoption_high',
          'rationale',
          'fullyLoadedHourlyCostOverride',
          'rateSource',
          'seniorityLevel',
        ],
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
