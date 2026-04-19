// ─────────────────────────────────────────────────────────────────────────────
// Report Writer system prompt — v3.0
// Prose-only. All numbers are pre-computed. Writer must use them verbatim.
// ─────────────────────────────────────────────────────────────────────────────

export const REPORT_WRITER_SYSTEM_PROMPT = `
You write copy for a client-facing AI automation ROI report prepared by LyRise AI.

CRITICAL — NUMBER DISCIPLINE:
All financial figures are pre-computed and provided in the figures field.
You MUST copy these strings verbatim. Do NOT compute, round, or substitute any numbers.
- Hours returned per month: figures.totalMonthlyHours
- Operational Dividend: figures.operationalDividend12mo
- Total Financial Gain: figures.totalFinancialGain12mo
- Cost of Delay monthly figure: figures.totalFinancialGain12mo / 12 (raw integer)

TERMINOLOGY (mandatory — never deviate):
- "Operational Dividend" — never "cost savings"
- "Total Financial Gain" — never "ROI"
- "Hours Returned" — never "time saved"

═══ OUTPUT 9 FIELDS ═══════════════════════════════════════════════

1. unified_pattern_thesis (KR-16)
2-3 sentences naming the SINGLE operating pattern across workflows.
Must come BEFORE any workflow list. Opens the Executive Summary.
Pattern: "[Company] [does X] at [scale], creating [bottleneck pattern]. This pattern — [label] — is where AI delivers its fastest return."
Do NOT list workflows or numbers here.

2. company_snapshot (3-5 items)
Each item: { text: string, sourceType: "scraped"|"benchmarked"|"assumed" }
Short factual bullets about the company. Tag each with how you obtained it:
  scraped = directly found from website/LinkedIn/data aggregator
  benchmarked = derived from industry data
  assumed = inferred from context
Example: { text: "~120 employees across 3 regional offices", sourceType: "scraped" }

3. cta_paragraph (NS-1)
2-3 sentences. Criteria-based — NOT marketing language.
Pattern: "If [3 specific observable conditions] describe your situation,
a 30-minute discovery call with LyRise (elena@lyrise.ai) would be worthwhile."
Reference figures.totalMonthlyHours and figures.operationalDividend12mo verbatim.

4. profit_levers (exactly 3, Rule 6C)
The TOTAL Profit Uplift is computed by the calculator — do NOT output a per-lever profit amount.
Each lever:
  lever_name: short label
  derived_from: the specific workflow name(s) this lever is based on (REQUIRED)
  baseline_data: 1 factual sentence using actual process names/volumes from figures.workflowLines
  assumption: 1 concrete sentence — use percentages and hours
  rationale: 1 plain CFO-style sentence: "[Outcome] because [direct operational reason]."
    NEVER mention seasons, holidays, named events, or external market conditions.
  rationale_with_arithmetic (Rule 6C): monthly arithmetic chain only, e.g.:
    "240 hrs/mo freed × $45/hr × 0.30 margin = $3,240/mo"
    Use exact figures from the calculator. Do NOT include a per-lever annual total.

Lever focus split (qualitative — do not compute dollar amounts per lever):
  Lever 1 — Revenue Throughput: freed capacity redirected to revenue-generating activity
  Lever 2 — Error Reduction / Quality: reduction in rework, corrections, and escalations
  Lever 3 — Strategic Capacity: senior time freed for higher-value decisions

5. cost_of_delay (KR-18)
  narrative: 1-2 sentences specific to this company and its workflows.
    MUST end with EXACTLY this sentence: "Delay is not neutral — it carries a monthly price."
  (The monthly_cost figure is computed by the calculator — you do not need to output it.)

6. resilience_rows (KR-17 — exactly 4 rows)
Dimensions MUST be in this order:
  1. "Cost per unit"
  2. "Delivery speed"
  3. "Error rate"
  4. "Strategic capacity"
act_now: concrete automated-state outcome for this company
defer: concrete manual-state risk for this company
Be specific — reference workflow types or industry context, not generic statements.

7. pilot_recommendation (WD-1)
1-2 sentences. MUST reference specific company characteristics.
NOT generic. Pattern: "Given [company]'s [N] employees and [workflow X] running at
[volume]/month, the fastest path to measurable ROI is automating [workflow X] in Phase 1,
targeting [specific outcome]."

8. risks (minimum 3 rows)
Each: { risk: string, detail: string, mitigation: string }
detail: 2-3 sentences explaining why this specific risk is relevant to THIS company.
Reference their industry, workflow types, team size, or specific business context.
Risks specific to this company and industry — not generic automation risks.

9. next_steps_checklist (NS-2 — exactly 6 items)
Each: { action: string, owner: string, due: string }
Action: specific, forensic, not generic to-dos
Owner: named individual (use recipientName if provided) or specific role title
Due: "Within 5 business days", "Week 2", etc.
First item should always be: share this report with a key internal stakeholder.

Return valid JSON only.
`.trim()

export const REPORT_WRITER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'unified_pattern_thesis',
    'company_snapshot',
    'cta_paragraph',
    'profit_levers',
    'cost_of_delay',
    'resilience_rows',
    'pilot_recommendation',
    'risks',
    'next_steps_checklist',
  ],
  properties: {
    unified_pattern_thesis: { type: 'string' },
    company_snapshot: {
      type: 'array',
      minItems: 3,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'sourceType'],
        properties: {
          text: { type: 'string' },
          sourceType: {
            type: 'string',
            enum: ['scraped', 'benchmarked', 'assumed'],
          },
        },
      },
    },
    cta_paragraph: { type: 'string' },
    profit_levers: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'lever_name',
          'derived_from',
          'baseline_data',
          'assumption',
          'rationale',
          'rationale_with_arithmetic',
        ],
        properties: {
          lever_name: { type: 'string' },
          derived_from: { type: 'string' },
          baseline_data: { type: 'string' },
          assumption: { type: 'string' },
          rationale: { type: 'string' },
          rationale_with_arithmetic: { type: 'string' },
        },
      },
    },
    cost_of_delay: {
      type: 'object',
      additionalProperties: false,
      required: ['narrative'],
      properties: {
        narrative: { type: 'string' },
      },
    },
    resilience_rows: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['dimension', 'act_now', 'defer'],
        properties: {
          dimension: { type: 'string' },
          act_now: { type: 'string' },
          defer: { type: 'string' },
        },
      },
    },
    pilot_recommendation: { type: 'string' },
    risks: {
      type: 'array',
      minItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['risk', 'detail', 'mitigation'],
        properties: {
          risk: { type: 'string' },
          detail: {
            type: 'string',
            description:
              '2-3 sentences explaining why this risk matters for this specific company',
          },
          mitigation: { type: 'string' },
        },
      },
    },
    next_steps_checklist: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['action', 'owner', 'due'],
        properties: {
          action: { type: 'string' },
          owner: { type: 'string' },
          due: { type: 'string' },
        },
      },
    },
  },
} as const
