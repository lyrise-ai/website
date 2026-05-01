/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
// ─────────────────────────────────────────────────────────────────────────────
// Unified ROI Report Agent
// Single streamText agent handles both generation and chat-based editing.
// Tools mutate ReportState in-place; onReportUpdate fires on every assembled change.
// Single sources of truth: state.company, state.globals, state.workflows, state.copy
// Everything else (calcOutput, assembled, renderedHtml) is derived on demand.
// ─────────────────────────────────────────────────────────────────────────────

import {
  streamText,
  generateObject,
  jsonSchema,
  tool,
  stepCountIs,
  type ModelMessage,
} from 'ai'
import { z } from 'zod'

import { researchModel, fastModel } from '@/src/lib/roi/llm'
import { UsageTracker } from '@/src/lib/roi/services/usageTracker'
import { webSearch } from '@/src/lib/roi/tools/webSearch'
import { fetchPage } from '@/src/lib/roi/tools/fetchPage'
import { roiCalculator } from '@/src/lib/roi/pipeline/roiCalculator'
import { assembleReport } from '@/src/lib/roi/pipeline/assembleReport'
import { renderTemplate } from '@/src/lib/roi/pipeline/renderTemplate'
import {
  ROI_MODELER_SYSTEM_PROMPT,
  ROI_MODELER_SCHEMA,
} from '@/src/lib/roi/prompts/roiModeler'

import type {
  ReportState,
  AgentCallbacks,
  WorkflowInput,
  GlobalInputs,
  ReportCopy,
  ProfitLever,
  ResilienceRow,
  RiskRow,
  CostOfDelayData,
} from '@/src/lib/roi/types'

// ── Modeler LLM output type (local — not exported) ────────────────────────────

interface ModelerResult {
  currency: { code: string; symbol: string; name: string }
  costs: { implementationCost: number; monthlyToolingCost: number }
  labor: { fullyLoadedHourlyCost: number; workWeeksPerYear: number }
  realizationFactor: number
  profitMultiplier: number
  workflowAssumptions: Array<{
    workflowName: string
    monthlyVolume: number
    minutesPerItemBefore: number
    minutesPerItemAfter: number
    exceptionRate: number
    exceptionMinutes: number
    adoption_base: number
    rationale: string
    fullyLoadedHourlyCostOverride: number
    rateSource: string
    seniorityLevel: string
  }>
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function reAssemble(
  state: ReportState,
  execTemplateHtml: string,
  fullTemplateHtml: string,
  callbacks: AgentCallbacks,
  changedSections?: string[],
) {
  if (!state.workflows || !state.globals || !state.company) return
  state.calcOutput = roiCalculator(
    state.workflows,
    state.globals,
    state.company,
  )
  if (!state.copy || !state.normInput) return
  state.assembled = assembleReport(state)
  state.renderedHtml = renderTemplate(execTemplateHtml, state.assembled)
  state.renderedFullHtml = renderTemplate(fullTemplateHtml, state.assembled)
  callbacks.onReportUpdate(state, changedSections)
}

function ensureEvidenceItems(state: ReportState) {
  if (!Array.isArray(state.evidenceItems)) {
    state.evidenceItems = []
  }
  return state.evidenceItems
}

function mapWorkflowSourceTypeToEvidenceSource(
  sourceType: WorkflowInput['sourceType'],
): 'scraped' | 'benchmarked' | 'assumed' {
  if (sourceType === 'research_derived') return 'scraped'
  if (sourceType === 'user_stated') return 'assumed'
  return 'benchmarked'
}

function addEvidence(
  state: ReportState,
  item: {
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
  },
) {
  const evidenceItems = ensureEvidenceItems(state)
  evidenceItems.push({
    ...item,
    createdAt: new Date().toISOString(),
  })
}

// ── Tool definitions ──────────────────────────────────────────────────────────

function buildTools(
  state: ReportState,
  execTemplateHtml: string,
  fullTemplateHtml: string,
  callbacks: AgentCallbacks,
  tracker?: UsageTracker,
) {
  return {
    // ── Research tools ──────────────────────────────────────────────────────
    web_search: tool({
      description:
        'Search the web for company intelligence, industry benchmarks, or financial data.',
      inputSchema: z.object({
        query: z.string().describe('The search query'),
        maxResults: z
          .number()
          .optional()
          .describe('Max results to return (default 5)'),
      }),
      execute: async ({
        query,
        maxResults,
      }: {
        query: string
        maxResults?: number
      }) => {
        const response = await webSearch(query, maxResults ?? 5)

        if (response.answer) {
          addEvidence(state, {
            kind: 'search_answer',
            query,
            snippet: response.answer,
            sourceType: 'benchmarked',
            usedInSections: ['research'],
          })
        }

        ;(response.results ?? []).forEach((result) => {
          addEvidence(state, {
            kind: 'search_result',
            query,
            url: result.url,
            title: result.title,
            snippet: result.content,
            sourceType: result.url ? 'scraped' : 'benchmarked',
            usedInSections: ['research'],
          })
        })

        return response
      },
    }),

    fetch_page: tool({
      description:
        'Fetch and read the content of a web page (company website, LinkedIn, Apollo, etc.).',
      inputSchema: z.object({
        url: z.string().describe('The URL to fetch'),
      }),
      execute: async ({ url }: { url: string }) => {
        const content = await fetchPage(url)
        addEvidence(state, {
          kind: 'page_content',
          url,
          title: url,
          content,
          snippet: content.slice(0, 1200),
          sourceType: 'scraped',
          usedInSections: ['research'],
        })
        return content
      },
    }),

    // ── Evidence lookup tool (chat mode) ────────────────────────────────────
    search_evidence: tool({
      description:
        'Search the evidence gathered during report generation. Use this when the user asks where a figure came from, why a value was chosen, or what sources back a claim. Check here before calling web_search.',
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            'Keywords to match, e.g. "labor rate", "revenue", "employee count"',
          ),
      }),
      execute: async ({ query }: { query: string }) => {
        const items = state.evidenceItems ?? []
        if (items.length === 0)
          return {
            results: [],
            note: 'No evidence recorded for this report.',
          }
        const q = query.toLowerCase()
        const matches = items
          .filter((e) =>
            [e.snippet, e.title, e.query, e.url].some((f) =>
              f?.toLowerCase().includes(q),
            ),
          )
          .slice(0, 8)
          .map((e) => ({
            source: e.url ?? (e.query ? `search: "${e.query}"` : 'internal'),
            snippet: (e.snippet ?? '').slice(0, 400),
            sourceType: e.sourceType,
            confidence: e.confidence,
          }))
        return {
          results: matches,
          total_evidence_items: items.length,
          note:
            matches.length === 0
              ? 'No matching evidence — try broader keywords or web_search for new data.'
              : undefined,
        }
      },
    }),

    // ── Generation tools (sequenced during initial generation) ──────────────
    set_research_output: tool({
      description:
        'Lock in the research findings: company profile, pain points, and workflows. Call this after completing all research.',
      inputSchema: z.object({
        company_profile: z.object({
          company: z.string(),
          industry: z.string(),
          country: z.string().nullable(),
          primaryFocus: z.string().nullable(),
          keyPriorities: z.array(z.string()),
          employees: z.number().nullable(),
          revenueEstimateM: z.number().nullable(),
        }),
        pain_points: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            confidence: z.enum(['high', 'medium', 'low']),
            source: z.enum(['user_stated', 'inferred', 'research_derived']),
          }),
        ),
        workflows: z
          .array(
            z.object({
              name: z.string(),
              function: z.string(),
              owner: z.string(),
              whyItMatters: z.string(),
              agentName: z.string(),
              expectedOutcome: z.string(),
              sourceType: z.enum([
                'user_stated',
                'inferred',
                'research_derived',
              ]),
              monthlyVolume: z
                .number()
                .optional()
                .describe('Monthly volume — must provide a positive number'),
              minutesPerItemBefore: z
                .number()
                .optional()
                .describe(
                  'Minutes per task before AI — must provide a positive number',
                ),
              minutesPerItemAfter: z
                .number()
                .optional()
                .describe(
                  'Minutes per task after AI — must provide a positive number',
                ),
              volumeRationale: z.string().optional(),
            }),
          )
          .min(4)
          .describe(
            'Exactly 4 workflows required. Infer from industry benchmarks if not found online.',
          ),
        researchSummary: z.string().optional(),
        confidenceLevel: z.enum(['high', 'low']),
        coreThesis: z.string(),
      }),
      execute: async (input) => {
        const cp = input.company_profile
        state.company = {
          company: cp.company,
          industry: cp.industry,
          country: cp.country ?? null,
          primaryFocus: cp.primaryFocus ?? null,
          keyPriorities: cp.keyPriorities,
          employees: cp.employees ?? null,
          revenueEstimateM: cp.revenueEstimateM ?? null,
        }
        state.workflows = input.workflows.map((w) => ({
          name: w.name,
          agentName: w.agentName,
          function: w.function,
          owner: w.owner,
          whyItMatters: w.whyItMatters,
          expectedOutcome: w.expectedOutcome,
          sourceType: w.sourceType,
          monthlyVolume:
            w.monthlyVolume && w.monthlyVolume > 0 ? w.monthlyVolume : 100,
          minutesPerItemBefore:
            w.minutesPerItemBefore && w.minutesPerItemBefore > 0
              ? w.minutesPerItemBefore
              : 60,
          minutesPerItemAfter:
            w.minutesPerItemAfter && w.minutesPerItemAfter > 0
              ? w.minutesPerItemAfter
              : 12,
          adoptionRate: 0.7,
          exceptionRate: 0.08,
          exceptionMinutes: 12,
          rateOverride: null,
          rationale: w.volumeRationale ?? '',
        }))
        state.painPoints = input.pain_points
        state.researchSummary = input.researchSummary ?? null
        state.confidenceLevel = input.confidenceLevel
        state.coreThesis = input.coreThesis

        if (input.researchSummary) {
          addEvidence(state, {
            kind: 'research_summary',
            snippet: input.researchSummary,
            sourceType:
              input.confidenceLevel === 'high' ? 'scraped' : 'benchmarked',
            confidence: input.confidenceLevel,
            usedInSections: ['research', 'thesis'],
          })
        }

        ;[
          cp.primaryFocus
            ? { title: 'Primary focus', value: cp.primaryFocus }
            : null,
          cp.employees != null
            ? { title: 'Employee count', value: cp.employees }
            : null,
          cp.revenueEstimateM != null
            ? { title: 'Revenue estimate (M)', value: cp.revenueEstimateM }
            : null,
          cp.country ? { title: 'Country', value: cp.country } : null,
        ]
          .filter(Boolean)
          .forEach((fact) => {
            addEvidence(state, {
              kind: 'company_fact',
              title: fact!.title,
              snippet: String(fact!.value),
              sourceType:
                input.confidenceLevel === 'high' ? 'scraped' : 'benchmarked',
              confidence: input.confidenceLevel,
              facts: { key: fact!.title, value: fact!.value },
              usedInSections: ['research'],
            })
          })

        input.workflows.forEach((workflow) => {
          addEvidence(state, {
            kind: 'workflow_signal',
            title: workflow.name,
            snippet: workflow.whyItMatters,
            sourceType: mapWorkflowSourceTypeToEvidenceSource(
              workflow.sourceType,
            ),
            confidence: input.confidenceLevel,
            facts: {
              monthlyVolume: workflow.monthlyVolume ?? null,
              minutesPerItemBefore: workflow.minutesPerItemBefore ?? null,
              minutesPerItemAfter: workflow.minutesPerItemAfter ?? null,
              rationale: workflow.volumeRationale ?? '',
            },
            usedInSections: ['workflows', 'financials'],
          })
        })

        return { ok: true, workflows: state.workflows.map((w) => w.name) }
      },
    }),

    run_financial_model: tool({
      description:
        'Run the financial model: calls the ROI modeler LLM, then the pure-TS calculator. Includes sanity checks (Rules 6B, 6D, 6E). Call after set_research_output.',
      inputSchema: z.object({}),
      execute: async () => {
        if (!state.workflows || !state.company || !state.normInput) {
          return {
            error: 'run_financial_model called before set_research_output',
          }
        }

        // Fix 1: surface scraped rate/salary signals to the modeler
        const rateSignals = (state.evidenceItems ?? [])
          .filter(
            (item) =>
              item.kind === 'search_result' ||
              item.kind === 'search_answer' ||
              item.kind === 'page_content',
          )
          .slice(0, 12)
          .map((item) => ({
            query: item.query ?? null,
            snippet: (item.snippet ?? '').slice(0, 400),
            url: item.url ?? null,
          }))

        // Pre-compute TFG target band so the modeler hits Rule 6B on the first try
        const revenueU = (state.company.revenueEstimateM ?? 0) * 1e6
        const tfgTargetRange =
          revenueU > 0 && state.confidenceLevel !== 'low'
            ? { min: Math.round(revenueU * 0.05), max: Math.round(revenueU * 0.2) }
            : null

        // Currencies whose official symbols are non-Latin script — built once outside the loop
        const SCRIPT_SYMBOL_CODES = new Set([
          'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR',
          'EGP', 'JOD', 'IQD', 'LBP', 'IRR', 'YER',
        ])

        const modelerUserContent = JSON.stringify({
          company_profile: state.company,
          // Fix 3: include owner so modeler can differentiate by seniority
          workflows: state.workflows.map((w) => ({
            name: w.name,
            function: w.function,
            owner: w.owner,
            monthlyVolume: w.monthlyVolume,
            minutesPerItemBefore: w.minutesPerItemBefore,
            minutesPerItemAfter: w.minutesPerItemAfter,
            volumeRationale: w.rationale,
          })),
          processes: state.normInput.processes,
          selectedCurrency: state.normInput.selectedCurrency,
          country: state.normInput.country,
          teamSize: state.normInput.teamSize,
          revenueRange: state.normInput.revenueRange,
          researchSummary: state.researchSummary ?? undefined,
          researchEvidence: rateSignals.length > 0 ? rateSignals : undefined,
          ...(tfgTargetRange && { tfg_target_range: tfgTargetRange }),
        })

        let globals: GlobalInputs | null = null
        let updatedWorkflows: WorkflowInput[] | null = null
        let lastError = ''

        for (let attempt = 0; attempt < 3; attempt++) {
          let retryHint = ''
          if (attempt > 0) {
            let prescription = ''
            if (lastError.includes('Rule 6B')) {
              prescription =
                ' Increase monthlyVolume for all workflows to raise Total Financial Gain into the required band.'
            } else if (lastError.includes('Rule 6E')) {
              prescription =
                ' Set profitMultiplier ≥ 1.8 to satisfy the Profit Uplift / Operational Dividend ratio requirement.'
            }
            retryHint = `\n\nPREVIOUS ATTEMPT FAILED: ${lastError}.${prescription}`
          }

          // System prompt is stable across all attempts to enable OpenAI prefix caching;
          // retry hint goes into the user prompt instead
          const result = await generateObject({
            model: fastModel,
            schema: jsonSchema(ROI_MODELER_SCHEMA as object),
            system: ROI_MODELER_SYSTEM_PROMPT,
            prompt: retryHint ? modelerUserContent + retryHint : modelerUserContent,
          })
          const callLabel = attempt > 0 ? `modeler_retry${attempt}` : 'modeler'
          tracker?.record({
            call: callLabel,
            model: 'gpt-4o',
            ...result.usage,
          })

          const modelerOut = result.object as ModelerResult

          const rawCurrencySym = modelerOut.currency.symbol
          // eslint-disable-next-line no-control-regex
          const hasNonAscii = /[^\x00-\x7F]/.test(rawCurrencySym)
          const cleanSym =
            SCRIPT_SYMBOL_CODES.has(modelerOut.currency.code) || hasNonAscii
              ? modelerOut.currency.code
              : rawCurrencySym
          globals = {
            laborRate: modelerOut.labor.fullyLoadedHourlyCost,
            implementationCost: modelerOut.costs.implementationCost,
            monthlyToolingCost: modelerOut.costs.monthlyToolingCost,
            profitMultiplier: Math.max(1.8, Math.min(4.0, modelerOut.profitMultiplier)),
            realizationFactor: modelerOut.realizationFactor,
            workWeeksPerYear: modelerOut.labor.workWeeksPerYear,
            currency: {
              ...modelerOut.currency,
              symbol:
                cleanSym.length > 1 && !cleanSym.endsWith(' ')
                  ? cleanSym + ' '
                  : cleanSym,
            },
          }

          // Merge per-workflow assumptions from modeler into state.workflows.
          // Fuzzy match: exact → contains → starts-with, so minor LLM name drift
          // (e.g. "Proposal Drafting" vs "Proposal Drafting and Tailoring") still
          // gets the right assumptions instead of silently falling back to defaults.
          updatedWorkflows = state.workflows!.map((wf) => {
            const wfLow = wf.name.toLowerCase()
            const assump =
              modelerOut.workflowAssumptions.find(
                (a) => a.workflowName.toLowerCase() === wfLow,
              ) ??
              modelerOut.workflowAssumptions.find((a) => {
                const aLow = a.workflowName.toLowerCase()
                return aLow.includes(wfLow) || wfLow.includes(aLow)
              })
            if (!assump) return wf
            return {
              ...wf,
              monthlyVolume:
                assump.monthlyVolume > 0
                  ? assump.monthlyVolume
                  : wf.monthlyVolume,
              minutesPerItemBefore:
                assump.minutesPerItemBefore > 0
                  ? assump.minutesPerItemBefore
                  : wf.minutesPerItemBefore,
              minutesPerItemAfter:
                assump.minutesPerItemAfter > 0
                  ? assump.minutesPerItemAfter
                  : wf.minutesPerItemAfter,
              adoptionRate: assump.adoption_base,
              exceptionRate: assump.exceptionRate,
              exceptionMinutes: assump.exceptionMinutes,
              rateOverride: assump.fullyLoadedHourlyCostOverride,
              rationale: assump.rationale,
              rateSource: assump.rateSource,
              seniorityLevel: assump.seniorityLevel,
            }
          })

          const calcOut = roiCalculator(
            updatedWorkflows,
            globals,
            state.company!,
          )
          const s = calcOut.summary
          const od = s.operationalDividend12mo
          const pu = s.profitUplift12mo
          const tf = s.totalFinancialGain12mo
          // Rule 6B: 5–20% revenue band.
          // Skip when confidence is low — revenueEstimateM is an LLM guess and
          // an uncertain estimate makes the band an impossible constraint to hit.
          if (revenueU > 0 && state.confidenceLevel !== 'low') {
            const ratio = tf / revenueU
            if (ratio < 0.05) {
              lastError = `Rule 6B: TFG (${tf}) is only ${(ratio * 100).toFixed(
                1,
              )}% of revenue (${revenueU}). Need ≥5%. Increase workflow volumes.`
              continue
            }
            if (ratio > 0.2) {
              lastError = `Rule 6B: TFG (${tf}) is ${(ratio * 100).toFixed(
                1,
              )}% of revenue. Need ≤20%. Reduce impact percentages.`
              continue
            }
          }

          // Rule 6E: OD/PU ratio 0.8–3×
          if (od > 0) {
            const puRatio = pu / od
            if (puRatio > 3.0) {
              lastError = `Rule 6E: Profit uplift (${pu}) is ${puRatio.toFixed(
                1,
              )}× the OD (${od}). Cap at 3×.`
              continue
            }
            if (puRatio < 0.8) {
              lastError = `Rule 6E: Profit uplift (${pu}) is only ${puRatio.toFixed(
                1,
              )}× the OD (${od}). Need ≥0.8×.`
              continue
            }
          }

          lastError = ''
          state.workflows = updatedWorkflows
          state.globals = globals
          state.calcOutput = calcOut
          break
        }

        if (!globals || !updatedWorkflows) {
          return { error: 'Financial model failed after retries: ' + lastError }
        }

        const s = state.calcOutput!.summary
        return {
          ok: true,
          currency: globals.currency,
          total_monthly_hours: state.calcOutput!.totalMonthlyHours,
          od12: s.operationalDividend12mo,
          pu12: s.profitUplift12mo,
          tf12: s.totalFinancialGain12mo,
          payback_months: s.paybackMonths,
          figures: state.calcOutput!.figures,
          sanity_note: lastError || 'All checks passed',
        }
      },
    }),

    set_report_copy: tool({
      description:
        'Write and lock in all report copy (9 fields). Call after run_financial_model. This triggers the first report_update event.',
      inputSchema: z.object({
        unified_pattern_thesis: z
          .string()
          .describe('KR-16: 2-3 sentences naming single operating pattern'),
        company_snapshot: z
          .array(
            z.object({
              text: z.string(),
              sourceType: z.enum(['scraped', 'benchmarked', 'assumed']),
            }),
          )
          .describe('3-5 bullets with source tags'),
        cta_paragraph: z
          .string()
          .describe('NS-1: criteria-based CTA paragraph'),
        profit_levers: z
          .array(
            z.object({
              lever_name: z.string(),
              derived_from: z.string(),
              baseline_data: z.string(),
              ai_agent_action: z
                .string()
                .describe(
                  'The specific named action the AI agent takes, e.g. "AI drafts and routes contract renewal notices". No vague efficiency language.',
                ),
              rationale: z.string(),
              rationale_with_arithmetic: z
                .string()
                .describe(
                  'Monthly arithmetic only, e.g. "120 hrs/mo freed × $45/hr × 0.35 redirected = $1,890/mo". Total Profit Uplift is computed by the calculator — do not invent a separate per-lever annual total.',
                ),
            }),
          )
          .min(3)
          .max(3)
          .describe(
            'Exactly 3 levers. Each must name the specific AI agent action and show monthly arithmetic.',
          ),
        cost_of_delay: z.object({
          narrative: z
            .string()
            .describe(
              'Company-specific reason for urgency. Do NOT embed a dollar figure — the monthly cost is computed by the calculator and shown separately. Must end with: "Delay is not neutral — it carries a monthly price."',
            ),
        }),
        resilience_rows: z
          .array(
            z.object({
              dimension: z.string(),
              act_now: z.string(),
              defer: z.string(),
            }),
          )
          .length(4),
        pilot_recommendation: z.string(),
        risks: z
          .array(
            z.object({
              risk: z.string(),
              detail: z
                .string()
                .describe('2-3 sentences specific to this company'),
              mitigation: z.string(),
            }),
          )
          .min(3),
      }),
      execute: async (copy: ReportCopy) => {
        state.copy = copy
        reAssemble(state, execTemplateHtml, fullTemplateHtml, callbacks, [
          'thesis',
          'workflows',
          'profit_levers',
          'cost_of_delay',
          'cta',
        ])
        return { ok: true }
      },
    }),

    // ── Copy editing tool ────────────────────────────────────────────────────
    update_copy: tool({
      description:
        'Update one or more report copy sections in a single call. All fields are optional — include only what you want to change.',
      inputSchema: z.object({
        thesis: z
          .string()
          .optional()
          .describe(
            'KR-16: 2-3 sentences identifying the single operating pattern',
          ),
        cta: z
          .string()
          .optional()
          .describe('NS-1: criteria-based CTA, not marketing language'),
        pilot: z
          .string()
          .optional()
          .describe(
            'WD-1: pilot recommendation referencing specific company characteristics',
          ),
        profit_levers: z
          .array(
            z.object({
              lever_name: z.string(),
              derived_from: z.string(),
              baseline_data: z.string(),
              ai_agent_action: z
                .string()
                .describe(
                  'The specific named action the AI agent takes. No vague efficiency language.',
                ),
              rationale: z.string(),
              rationale_with_arithmetic: z
                .string()
                .describe(
                  'Monthly arithmetic only. Total Profit Uplift is computed by the calculator — do not add a per-lever annual total.',
                ),
            }),
          )
          .min(3)
          .max(3)
          .optional()
          .describe('Exactly 3 levers with named AI agent action and monthly arithmetic.'),
        resilience_rows: z
          .array(
            z.object({
              dimension: z.string(),
              act_now: z.string(),
              defer: z.string(),
            }),
          )
          .length(4)
          .optional()
          .describe('KR-17: exactly 4 rows'),
        cost_of_delay: z
          .object({
            narrative: z
              .string()
              .describe(
                'KR-18: company-specific urgency prose. Do NOT embed a dollar figure. Must end with "Delay is not neutral — it carries a monthly price."',
              ),
          })
          .optional(),
        risks: z
          .array(
            z.object({
              risk: z.string(),
              detail: z
                .string()
                .describe('2-3 sentences specific to this company'),
              mitigation: z.string(),
            }),
          )
          .min(3)
          .optional(),
      }),
      execute: async (patches: {
        thesis?: string
        cta?: string
        pilot?: string
        profit_levers?: ProfitLever[]
        resilience_rows?: ResilienceRow[]
        cost_of_delay?: CostOfDelayData
        risks?: RiskRow[]
      }) => {
        if (!state.copy) return { error: 'No report copy to update' }
        state.copy = {
          ...state.copy,
          ...(patches.thesis !== undefined && {
            unified_pattern_thesis: patches.thesis,
          }),
          ...(patches.cta !== undefined && { cta_paragraph: patches.cta }),
          ...(patches.pilot !== undefined && {
            pilot_recommendation: patches.pilot,
          }),
          ...(patches.profit_levers !== undefined && {
            profit_levers: patches.profit_levers,
          }),
          ...(patches.resilience_rows !== undefined && {
            resilience_rows: patches.resilience_rows,
          }),
          ...(patches.cost_of_delay !== undefined && {
            cost_of_delay: patches.cost_of_delay,
          }),
          ...(patches.risks !== undefined && { risks: patches.risks }),
        }
        const COPY_TO_SECTION: Record<string, string> = {
          thesis: 'thesis',
          cta: 'cta',
          pilot: 'pilot',
          profit_levers: 'profit_levers',
          resilience_rows: 'resilience_rows',
          cost_of_delay: 'cost_of_delay',
          risks: 'risks',
        }
        const changedSections = Object.keys(patches)
          .filter((k) => patches[k as keyof typeof patches] !== undefined)
          .map((k) => COPY_TO_SECTION[k])
          .filter(Boolean)
        reAssemble(
          state,
          execTemplateHtml,
          fullTemplateHtml,
          callbacks,
          changedSections,
        )
        return { ok: true, updated_sections: changedSections }
      },
    }),

    // ── Workflow assumption tool (instant recalc) ────────────────────────────
    update_workflow: tool({
      description:
        'Update numeric parameters for a specific workflow. Instantly recalculates all financial figures.',
      inputSchema: z.object({
        workflowName: z.string().describe('Must match a workflow name exactly'),
        patches: z.object({
          monthlyVolume: z.number().optional(),
          minutesPerItemBefore: z.number().optional(),
          minutesPerItemAfter: z.number().optional(),
          rateOverride: z
            .number()
            .optional()
            .describe('Override fully loaded hourly cost for this workflow'),
          adoptionRate: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe('Base adoption rate 0–1'),
        }),
      }),
      execute: async ({
        workflowName,
        patches,
      }: {
        workflowName: string
        patches: {
          monthlyVolume?: number
          minutesPerItemBefore?: number
          minutesPerItemAfter?: number
          rateOverride?: number
          adoptionRate?: number
        }
      }) => {
        if (!state.workflows) return { error: 'No workflows to patch' }
        const idx = state.workflows.findIndex(
          (w) => w.name.toLowerCase() === workflowName.toLowerCase(),
        )
        if (idx === -1) {
          return {
            error: `Workflow "${workflowName}" not found. Available: ${state.workflows
              .map((w) => w.name)
              .join(', ')}`,
          }
        }
        state.workflows = state.workflows.map((w, i) =>
          i !== idx
            ? w
            : {
                ...w,
                ...(patches.monthlyVolume !== undefined && {
                  monthlyVolume: patches.monthlyVolume,
                }),
                ...(patches.minutesPerItemBefore !== undefined && {
                  minutesPerItemBefore: patches.minutesPerItemBefore,
                }),
                ...(patches.minutesPerItemAfter !== undefined && {
                  minutesPerItemAfter: patches.minutesPerItemAfter,
                }),
                ...(patches.rateOverride !== undefined && {
                  rateOverride: patches.rateOverride,
                }),
                ...(patches.adoptionRate !== undefined && {
                  adoptionRate: patches.adoptionRate,
                }),
              },
        )
        reAssemble(state, execTemplateHtml, fullTemplateHtml, callbacks, [
          'workflows',
          'financials',
        ])
        const s = state.calcOutput?.summary
        return {
          ok: true,
          new_od12: s?.operationalDividend12mo,
          new_tf12: s?.totalFinancialGain12mo,
        }
      },
    }),

    // ── Workflow structure tools ─────────────────────────────────────────────
    add_workflow: tool({
      description:
        'Add a new workflow to the report. Only call this for workflows NOT already in the current workflow list.',
      inputSchema: z.object({
        workflow: z.object({
          name: z.string(),
          function: z.string(),
          owner: z.string(),
          whyItMatters: z.string(),
          agentName: z.string(),
          expectedOutcome: z.string(),
          sourceType: z.enum(['user_stated', 'inferred', 'research_derived']),
          monthlyVolume: z.number().optional(),
          minutesPerItemBefore: z.number().optional(),
          minutesPerItemAfter: z.number().optional(),
        }),
      }),
      execute: async ({
        workflow,
      }: {
        workflow: Omit<
          WorkflowInput,
          | 'adoptionRate'
          | 'exceptionRate'
          | 'exceptionMinutes'
          | 'rateOverride'
          | 'rationale'
        > & {
          monthlyVolume?: number
          minutesPerItemBefore?: number
          minutesPerItemAfter?: number
        }
      }) => {
        if (!state.workflows) return { error: 'No workflows to add to' }

        const alreadyExists = state.workflows.some(
          (w) => w.name.toLowerCase() === workflow.name.toLowerCase(),
        )
        if (alreadyExists) {
          return {
            error: `Workflow "${workflow.name}" already exists. Use update_workflow to change its parameters.`,
          }
        }

        const avgRate =
          state.globals && state.workflows.length > 0
            ? state.workflows.reduce(
                (s, w) => s + (w.rateOverride ?? state.globals!.laborRate),
                0,
              ) / state.workflows.length
            : state.globals?.laborRate ?? 45

        const newWorkflow: WorkflowInput = {
          name: workflow.name,
          agentName: workflow.agentName ?? '',
          function: workflow.function ?? '',
          owner: workflow.owner ?? '',
          whyItMatters: workflow.whyItMatters ?? '',
          expectedOutcome: workflow.expectedOutcome ?? '',
          sourceType: workflow.sourceType ?? 'inferred',
          monthlyVolume: workflow.monthlyVolume ?? 100,
          minutesPerItemBefore: workflow.minutesPerItemBefore ?? 60,
          minutesPerItemAfter: workflow.minutesPerItemAfter ?? 12,
          adoptionRate: 0.7,
          exceptionRate: 0.08,
          exceptionMinutes: 12,
          rateOverride: Math.round(avgRate),
          rationale:
            'Added via chat — defaults applied. Use update_workflow to refine.',
        }
        state.workflows = [...state.workflows, newWorkflow]
        reAssemble(state, execTemplateHtml, fullTemplateHtml, callbacks, [
          'workflows',
          'financials',
        ])
        return { ok: true, workflow_count: state.workflows.length }
      },
    }),

    remove_workflow: tool({
      description:
        'Remove a workflow from the report. Recalculates figures without an LLM call.',
      inputSchema: z.object({ workflowName: z.string() }),
      execute: async ({ workflowName }: { workflowName: string }) => {
        if (!state.workflows) return { error: 'No workflows' }
        state.workflows = state.workflows.filter((w) => w.name !== workflowName)
        reAssemble(state, execTemplateHtml, fullTemplateHtml, callbacks, [
          'workflows',
          'financials',
        ])
        return { ok: true, workflow_count: state.workflows.length }
      },
    }),

    // ── Currency & global financial tools ───────────────────────────────────
    scale_rates: tool({
      description:
        'Multiply ALL monetary raw inputs (hourly rates and costs) by a given factor. Use for currency conversion (e.g. scale_rates(3.67) for USD→AED). Only touches monetary fields; hours and volumes are unchanged.',
      inputSchema: z.object({
        multiplier: z
          .number()
          .positive()
          .describe('Factor to apply, e.g. 3.67 to convert USD to AED'),
      }),
      execute: async ({ multiplier }: { multiplier: number }) => {
        if (!state.globals) return { error: 'No globals to scale' }
        state.globals = {
          ...state.globals,
          laborRate: Math.round(state.globals.laborRate * multiplier),
          implementationCost: Math.round(
            state.globals.implementationCost * multiplier,
          ),
          monthlyToolingCost: Math.round(
            state.globals.monthlyToolingCost * multiplier,
          ),
        }
        if (state.workflows) {
          state.workflows = state.workflows.map((w) => ({
            ...w,
            rateOverride:
              w.rateOverride != null
                ? Math.round(w.rateOverride * multiplier)
                : null,
          }))
        }
        // Scale revenue so the roiCalculator revenue guardrail stays proportional
        if (
          state.company?.revenueEstimateM != null &&
          state.company.revenueEstimateM > 0
        ) {
          state.company = {
            ...state.company,
            revenueEstimateM: state.company.revenueEstimateM * multiplier,
          }
        }
        reAssemble(state, execTemplateHtml, fullTemplateHtml, callbacks, [
          'financials',
        ])
        return { ok: true, multiplier }
      },
    }),

    set_currency: tool({
      description:
        'Change the currency symbol and code displayed on all figures. DISPLAY CHANGE ONLY — values are not converted. Pair with scale_rates(multiplier) when actual value conversion is needed.',
      inputSchema: z.object({
        currencyCode: z
          .string()
          .describe(
            'ISO 4217 code: USD, EUR, GBP, AED, SAR, QAR, KWD, BHD, OMR, EGP, NGN, ZAR, JPY, CAD, AUD, CHF, INR',
          ),
      }),
      execute: async ({ currencyCode }: { currencyCode: string }) => {
        const CURRENCIES: Record<
          string,
          { code: string; symbol: string; name: string }
        > = {
          USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
          EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
          GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
          SAR: { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal' },
          AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham' },
          QAR: { code: 'QAR', symbol: 'QAR ', name: 'Qatari Riyal' },
          KWD: { code: 'KWD', symbol: 'KWD ', name: 'Kuwaiti Dinar' },
          BHD: { code: 'BHD', symbol: 'BHD ', name: 'Bahraini Dinar' },
          OMR: { code: 'OMR', symbol: 'OMR ', name: 'Omani Rial' },
          EGP: { code: 'EGP', symbol: 'EGP ', name: 'Egyptian Pound' },
          NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
          ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
          JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
          CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
          AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
          CHF: { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc' },
          INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        }
        const code = currencyCode.toUpperCase().trim()
        const currency = CURRENCIES[code] ?? {
          code,
          symbol: code + ' ',
          name: code,
        }
        if (state.globals) state.globals = { ...state.globals, currency }
        if (state.normInput)
          state.normInput = { ...state.normInput, selectedCurrency: code }
        reAssemble(state, execTemplateHtml, fullTemplateHtml, callbacks, [
          'financials',
        ])
        return { ok: true, currency }
      },
    }),

    update_globals: tool({
      description:
        'Update global financial model parameters. laborRate is the fallback/default rate; set applyToWorkflowOverrides to also rewrite existing workflow rates.',
      inputSchema: z.object({
        laborRate: z
          .number()
          .optional()
          .describe('Global fallback fully loaded hourly cost'),
        applyToWorkflowOverrides: z
          .boolean()
          .optional()
          .describe(
            'When changing laborRate, also set every current workflow rateOverride to that value. Use this for whole-report rate changes.',
          ),
        implCost: z
          .number()
          .optional()
          .describe('One-time implementation cost'),
        toolingCostMonthly: z
          .number()
          .optional()
          .describe('Monthly tooling/licensing cost'),
        profitMultiplier: z
          .number()
          .optional()
          .describe('Multiplier applied to freed hours for profit uplift'),
        realizationFactor: z
          .number()
          .optional()
          .describe('Fraction of theoretical hours actually recovered (0–1)'),
      }),
      execute: async (patches: {
        laborRate?: number
        applyToWorkflowOverrides?: boolean
        implCost?: number
        toolingCostMonthly?: number
        profitMultiplier?: number
        realizationFactor?: number
      }) => {
        if (!state.globals) return { error: 'No globals to update' }
        const everyWorkflowHasOverride =
          Boolean(state.workflows?.length) &&
          state.workflows!.every((w) => w.rateOverride != null)
        const shouldSyncWorkflowRates =
          patches.laborRate !== undefined &&
          (patches.applyToWorkflowOverrides ?? everyWorkflowHasOverride)

        state.globals = {
          ...state.globals,
          ...(patches.laborRate !== undefined && {
            laborRate: patches.laborRate,
          }),
          ...(patches.implCost !== undefined && {
            implementationCost: patches.implCost,
          }),
          ...(patches.toolingCostMonthly !== undefined && {
            monthlyToolingCost: patches.toolingCostMonthly,
          }),
          ...(patches.profitMultiplier !== undefined && {
            profitMultiplier: patches.profitMultiplier,
          }),
          ...(patches.realizationFactor !== undefined && {
            realizationFactor: patches.realizationFactor,
          }),
        }
        if (shouldSyncWorkflowRates && state.workflows) {
          state.workflows = state.workflows.map((w) => ({
            ...w,
            rateOverride: patches.laborRate ?? w.rateOverride,
          }))
        }
        reAssemble(
          state,
          execTemplateHtml,
          fullTemplateHtml,
          callbacks,
          shouldSyncWorkflowRates ? ['workflows', 'financials'] : ['financials'],
        )
        const s = state.calcOutput?.summary
        return {
          ok: true,
          labor_rate_scope: shouldSyncWorkflowRates
            ? 'all_workflows_and_global'
            : 'global_fallback_only',
          updated_workflow_rates: shouldSyncWorkflowRates
            ? state.workflows?.length ?? 0
            : 0,
          new_od12: s?.operationalDividend12mo,
          new_tf12: s?.totalFinancialGain12mo,
        }
      },
    }),
  }
}

// ── System prompts ────────────────────────────────────────────────────────────

function buildGenerationSystemPrompt(
  companyName: string,
  estimatesOnly = false,
): string {
  if (estimatesOnly) {
    return `You are the LyRise ROI Report Agent. Generate an estimate-based report for ${companyName}.

WEB RESEARCH IS DISABLED for this request. Do NOT call web_search or fetch_page.
Use ONLY the questionnaire inputs and standard industry benchmarks.

YOUR FIRST ACTION: call set_research_output immediately with:
- All workflows inferred from company description + industry (sourceType: 'inferred')
- confidenceLevel: 'low'
- A clear coreThesis based on the company description

Then: run_financial_model() → set_report_copy(…)

Do not write any text before calling set_research_output. Act immediately.

MANDATORY for set_report_copy:
• unified_pattern_thesis (KR-16): 2-3 sentences naming SINGLE operating pattern
• profit_levers: exactly 3 levers. For each lever:
  - ai_agent_action: the specific named action the AI agent takes (e.g. "AI auto-drafts contract renewal notices and routes for partner sign-off"). No vague efficiency language.
  - rationale_with_arithmetic: monthly arithmetic only, e.g. "120 hrs/mo freed × $45/hr × 0.35 redirected = $1,890/mo". Use the hourly rate from run_financial_model figures, NOT FTE count. Do NOT include a per-lever annual total — the calculator owns that.
• derived_from: workflow name(s) each lever originates from
• cost_of_delay (KR-18): narrative only — company-specific urgency prose, no dollar figures, MUST end with "Delay is not neutral — it carries a monthly price."
• resilience_rows (KR-17): exactly 4 rows; dimensions: Cost per unit, Delivery speed, Error rate, Strategic capacity
• pilot_recommendation (WD-1): MUST reference specific company characteristics
• cta_paragraph (NS-1): criteria-based — "If [conditions] describe your situation, a 30-min call with elena@lyrise.ai would be worthwhile."

TERMINOLOGY: "Operational Dividend" · "Total Financial Gain" · "Hours Returned"`
  }

  return `You are the LyRise ROI Report Agent. Your job is to produce a high-quality, credible AI ROI report for ${companyName}.

COGNITIVE WORKFLOW (silent internal reasoning — never show phase names to user):

PHASE 1 — Intelligence Vectoring: define 3–5 Key Intelligence Questions across Executive, Corporate, and Industry vectors.

PHASE 2 — Multi-Vector Intelligence Gathering. Research in this sequence:
1. Fetch the company website directly using fetch_page
2. Search data aggregators: web_search("{company} site:apollo.io OR site:clodura.ai OR site:zoominfo.com") then fetch_page the best result
3. Search LinkedIn: web_search("{company} site:linkedin.com/company") then fetch_page for headcount + industry
4. If a recipient name is provided: web_search("{name} {company} site:linkedin.com/in") and fetch_page their profile
5. Search for financial/industry signals: web_search("{company} {industry} revenue employees {year}")
6. Search for salary/rate benchmarks for the roles that will own each workflow in this country and industry. MANDATORY — run at least 2 targeted searches:
   web_search("{industry} {country} operations manager hourly rate site:gulftalent.com OR site:bayt.com")
   web_search("{industry} {country} average salary {role} {year} glassdoor OR linkedin")
   web_search("Robert Half salary guide {year} {country} {industry} {role}")
   Extract every specific figure (hourly, monthly, or annual) — the financial model will use them to set per-workflow seniority-differentiated rates. Without this data the modeler falls back to generic ranges.
Narrate your findings to the user as you go. Flag confidence levels.
If you find any concrete company signal (practice area, product line, geography, client type, transaction volume, headcount, tool stack, or regulatory context), you MUST use it to shape workflow selection and workflow rationales.

PHASE 3 — Confidence Assessment: declare "high" (most data scraped) or "low" (mostly benchmarked/assumed). Derive revenue from headcount × industry avg if not found directly.

PHASE 4 — Critical Thinking Nexus: produce ONE Core Operational Thesis: "[Main bottleneck] + [Highest-value automation opportunity]"

PHASE 5 — Thesis-Driven Workflow Prioritization: select 4 workflows. Rule 6A: assign per-workflow rates from named benchmarks (Gulf Talent, Bayt.com, Robert Half, LinkedIn Salary Insights, Glassdoor).
At least 2 workflows MUST be research-derived whenever public company signals are available. Avoid generic back-office workflows unless they are clearly tied to observed company operations.

PHASE 6 — Quantitative Dossier: baseline + automation impact + source type for each workflow.

In set_research_output, every workflow's whyItMatters must mention a concrete company or industry signal, and every workflow's volumeRationale must explain where the volume came from.

After phases 1–6, call tools in order:
  set_research_output(…) → run_financial_model() → set_report_copy(…)

MANDATORY for set_report_copy:
• unified_pattern_thesis (KR-16): 2-3 sentences naming SINGLE operating pattern, no workflow lists
• profit_levers: exactly 3 levers. For each lever:
  - ai_agent_action: the specific named action the AI agent takes (e.g. "AI auto-drafts contract renewal notices and routes for partner sign-off"). No vague efficiency language.
  - rationale_with_arithmetic: monthly arithmetic only, e.g. "120 hrs/mo freed × $45/hr × 0.35 redirected = $1,890/mo". Use the hourly rate from run_financial_model figures, NOT FTE count. Do NOT include a per-lever annual total — the calculator owns that.
• derived_from: workflow name(s) each lever originates from
• cost_of_delay (KR-18): narrative only — company-specific urgency prose, no dollar figures, MUST end with "Delay is not neutral — it carries a monthly price."
• resilience_rows (KR-17): exactly 4 rows; dimensions: Cost per unit, Delivery speed, Error rate, Strategic capacity
• pilot_recommendation (WD-1): MUST reference specific company characteristics (employees, volume)
• cta_paragraph (NS-1): criteria-based — "If [conditions] describe your situation, a 30-min call with elena@lyrise.ai would be worthwhile."

TERMINOLOGY (mandatory):
• "Operational Dividend" — never "cost savings"
• "Total Financial Gain" — never "ROI"
• "Hours Returned" — never "time saved"

ABSOLUTE PIPELINE REQUIREMENT:
You MUST call set_research_output → run_financial_model → set_report_copy in sequence, without exception.
If all web searches fail or return no useful data: STOP researching and call set_research_output IMMEDIATELY using the questionnaire inputs and industry benchmarks, with confidenceLevel: 'low' and sourceType: 'inferred' for all workflows.
NEVER end generation with only text. NEVER explain why you couldn't research. If stuck: call set_research_output NOW.

WORKFLOWS REQUIREMENT (critical):
• set_research_output.workflows MUST contain 3–4 workflows
• Every workflow MUST have monthlyVolume > 0 (use industry benchmarks if unknown — e.g. 200/mo for a 50-person firm)
• Every workflow MUST have minutesPerItemBefore > 0 and minutesPerItemAfter > 0
• Infer realistic volumes from team size and industry — do NOT submit 0 or omit these fields`
}

function buildChatSystemPrompt(state: ReportState): string {
  const calc = state.calcOutput!
  const copy = state.copy!
  const company = state.company!
  const globals = state.globals!
  // Fall back to ISO code if symbol contains non-ASCII characters (e.g. Arabic script)
  // eslint-disable-next-line no-control-regex
  const sym = /[^\x00-\x7F]/.test(globals.currency.symbol)
    ? globals.currency.code + ' '
    : globals.currency.symbol
  const s = calc.summary

  // Merge WorkflowInput (raw) with WorkflowCalc (derived) by name
  const merged = calc.workflows.map((wc) => {
    const inp =
      state.workflows!.find((w) => w.name === wc.name) ?? state.workflows![0]
    return { ...inp, ...wc }
  })

  const workflowSection = merged
    .map((w) => {
      const hrsBefore = Math.round(
        (w.monthlyVolume * w.minutesPerItemBefore) / 60,
      )
      const hrsAfter = Math.round(hrsBefore - w.monthlyHours)
      const rateLabel =
        w.rateOverride != null
          ? `${sym}${w.rateOverride}/hr (workflow override)`
          : `${sym}${globals.laborRate}/hr (global)`
      const rateSource = (w as WorkflowInput & { rateSource?: string })
        .rateSource
      const seniorityLevel = (w as WorkflowInput & { seniorityLevel?: string })
        .seniorityLevel
      const rateDetail = [
        rateSource ? `source: ${rateSource}` : null,
        seniorityLevel ? `seniority: ${seniorityLevel}` : null,
      ]
        .filter(Boolean)
        .join(' | ')
      return `[${w.name}]
  Displayed: ${hrsBefore}→${hrsAfter} hrs/mo | ${w.monthlyHours} hrs saved | ${sym}${w.monthlyValue}/mo
  Raw inputs (update_workflow): volume=${w.monthlyVolume}/mo | before=${w.minutesPerItemBefore}min | after=${w.minutesPerItemAfter}min | rate=${rateLabel}${rateDetail ? ' | ' + rateDetail : ''} | adoption=${w.adoptionRate}
  Owner: ${w.owner} | Type: ${w.sourceType}
  Why it matters: ${w.whyItMatters}
  Volume rationale: ${w.rationale || '(none recorded)'}`
    })
    .join('\n\n')

  const leverLines = (copy.profit_levers ?? [])
    .map(
      (l, i) =>
        `  [${i + 1}] lever_name="${l.lever_name}" | derived_from="${l.derived_from}"
       baseline_data="${l.baseline_data}"
       ai_agent_action="${l.ai_agent_action}"
       rationale_with_arithmetic="${l.rationale_with_arithmetic ?? l.rationale}"`,
    )
    .join('\n')

  const resilienceLines = (copy.resilience_rows ?? [])
    .map(
      (r) => `  • ${r.dimension}: act_now="${r.act_now}" | defer="${r.defer}"`,
    )
    .join('\n')

  const riskLines = (copy.risks ?? [])
    .map(
      (r, i) =>
        `  [${i + 1}] "${r.risk}"\n       Detail: ${r.detail}\n       Mitigation: ${r.mitigation}`,
    )
    .join('\n')

  const snapshotLines = (copy.company_snapshot ?? [])
    .map((b) => `  • [${b.sourceType}] ${b.text}`)
    .join('\n')

  const painPointLines = (state.painPoints ?? [])
    .map(
      (p) =>
        `  • ${p.title} (${p.confidence}, ${p.source}): ${p.description}`,
    )
    .join('\n')

  return `You are the LyRise ROI Report Editor for ${company.company}.

HOW THIS WORKS: every displayed figure has a raw input behind it. You see both below.
Edit the raw input with a tool → the pipeline recalculates and re-renders everything automatically.
Never compute derived values yourself. Never do arithmetic on report numbers.

INTENT INFERENCE — resolve the user's goal before acting:
• "where did X come from" / "why is X this value" → call search_evidence("X") first, then explain using the results and workflow rationale below
• "X seems too high / too low / wrong" → call search_evidence("X") to surface the source, then offer to research alternatives or update
• "change [thing] to [value]" → map to the exact tool+field (see COMPOSITION EXAMPLES); ask only if truly ambiguous
• "the rate / salary / hourly cost" for one named workflow → update_workflow rateOverride
• "the rate / salary / hourly cost" for the whole report / no workflow named → update_globals({ laborRate: X, applyToWorkflowOverrides: true }) so the displayed workflow rates actually change
• "the volume / frequency / how many per month" → update_workflow monthlyVolume
• "time / duration / minutes" → update_workflow minutesPerItemBefore or minutesPerItemAfter
• "add [process/workflow]" → add_workflow (must not already exist in the WORKFLOWS list)
• "rewrite / update / fix [copy section]" → update_copy with the relevant field(s)
• Before re-searching for a rate or benchmark, check RESEARCH EVIDENCE — it may already be there

═══ COMPANY ════════════════════════════════════════════
${company.company} | ${company.industry} | ${company.country ?? 'unknown'} | ${company.employees ?? '?'} employees
Revenue: ${company.revenueEstimateM ? sym + company.revenueEstimateM + 'M' : 'unknown'} | Confidence: ${state.confidenceLevel ?? 'low'}
Thesis: ${state.coreThesis ?? ''}
Research summary: ${state.researchSummary ?? '(none)'}

COMPANY SNAPSHOT (displayed in report):
${snapshotLines || '  (none)'}

PAIN POINTS IDENTIFIED:
${painPointLines || '  (none)'}

═══ WORKFLOWS ══════════════════════════════════════════
${workflowSection}

TOTALS (displayed): ${calc.figures.totalAnnualHours} hrs/yr | OD ${sym}${s.operationalDividend12mo} | PU ${sym}${s.profitUplift12mo} | TFG ${sym}${s.totalFinancialGain12mo}

═══ GLOBAL INPUTS ═══════════════════════════════════════
Edit with update_globals. laborRate is the fallback/default rate.
If workflows above already show overrides, changing only laborRate will not move their displayed rates unless applyToWorkflowOverrides is true.
  laborRate=${sym}${globals.laborRate}/hr | implCost=${sym}${globals.implementationCost} | toolingCostMonthly=${sym}${globals.monthlyToolingCost}/mo
  profitMultiplier=${globals.profitMultiplier} | realizationFactor=${globals.realizationFactor} | workWeeksPerYear=${globals.workWeeksPerYear}

═══ COPY SECTIONS ═══════════════════════════════════════
Edit with update_copy(patches). Field names shown after →.

THE PATTERN UNDERNEATH → thesis
"${copy.unified_pattern_thesis ?? ''}"

WHAT HAPPENS NEXT (CTA) → cta
"${copy.cta_paragraph ?? ''}"

PILOT RECOMMENDATION → pilot
"${copy.pilot_recommendation ?? ''}"

WHERE PROFIT UPLIFT COMES FROM → profit_levers (exactly 3)
${leverLines}

COST OF DELAY → cost_of_delay
  monthly_cost is computed by the calculator (tf12/12 = ${sym}${Math.round(s.totalFinancialGain12mo / 12).toLocaleString()}) — do not set this
  narrative="${copy.cost_of_delay?.narrative ?? ''}"

RESILIENCE TABLE → resilience_rows (exactly 4)
${resilienceLines}

RISKS → risks (min 3)
${riskLines}

═══ YOUR TOOLS ══════════════════════════════════════════
NUMBERS   update_workflow(name, patches)   — set volume, timeBefore, timeAfter, rateOverride, adoptionRate
          update_globals(patches)          — set laborRate, implCost, toolingCostMonthly, profitMultiplier, realizationFactor; for whole-report rate changes set applyToWorkflowOverrides: true
          scale_rates(multiplier)          — multiply ALL monetary inputs by a factor; use for currency conversion, no arithmetic needed
CURRENCY  set_currency(code)              — change display symbol/code only; pair with scale_rates when converting values
COPY      update_copy(patches)            — update any combination of copy sections in one call
STRUCTURE add_workflow | remove_workflow
RESEARCH  search_evidence(query)        — look up sources for any figure already found during generation
          web_search | fetch_page       — search/scrape new data not in evidence
  When asked about sources: call search_evidence first. Only call web_search if evidence returns no match.
  Query patterns:
    • "{industry} {country} {role} hourly rate site:gulftalent.com OR site:bayt.com"
    • "{industry} {country} average salary {role} {year} glassdoor OR linkedin"
    • "Robert Half salary guide {year} {industry} {country}"
  Convert to fully-loaded hourly: annual ÷ (${globals.workWeeksPerYear} × 40) × 1.30
  Then call update_workflow(name, { rateOverride: <computed> }) or update_globals({ laborRate: <blended>, applyToWorkflowOverrides: true }) if the user means one rate across the whole report.

COMPOSITION EXAMPLES:
  "Convert to AED at 3.67"          → set_currency("AED")  then  scale_rates(3.67)
  "Change the hourly rate to ${sym}200/hr" → update_globals({ laborRate: 200, applyToWorkflowOverrides: true })
  "Proposal rate is ${sym}80/hr"    → update_workflow("Proposal drafting and tailoring", { rateOverride: 80 })
  "Inbound volume is 200/mo"        → update_workflow("Inbound lead qualification", { monthlyVolume: 200 })
  "Rewrite the thesis"              → update_copy({ thesis: "..." })
  "Fix profit lever arithmetic"     → update_copy({ profit_levers: [...] })
  "Rate change + update lever math" → update_workflow(...) then update_copy({ profit_levers: [...] })
  "Where did $45/hr come from?"     → search_evidence("labor rate") → explain results + workflow rationale

STRICT RULES:
- NEVER describe a change without calling the tool that makes it.
- NEVER do arithmetic on report values — use scale_rates for relative scaling.
- set_currency only changes the symbol; always also call scale_rates if values need converting.
- If every workflow above shows a rate override, changing only global laborRate will not change the displayed workflow rates. Use applyToWorkflowOverrides: true for whole-report rate edits.
- NEVER call add_workflow for a workflow already listed above — the tool will reject it.
- set_report_copy: only call if the user explicitly asks to regenerate the full report copy.
- For a single-section edit, use a targeted update_* tool — never set_report_copy.
- KR-18: cost_of_delay narrative MUST end with "Delay is not neutral — it carries a monthly price."
- KR-17: resilience_rows always exactly 4 rows.
- Narrate what you're doing before calling tools.
- If you cannot satisfy a request with the available tools, say so explicitly.`
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function runReportAgent(params: {
  mode: 'generate' | 'chat'
  state: ReportState
  message?: string
  chatHistory?: ModelMessage[]
  callbacks: AgentCallbacks
  templateHtml: string
  fullTemplateHtml: string
  estimatesOnly?: boolean
}): Promise<void> {
  const {
    mode,
    state,
    message,
    chatHistory,
    callbacks,
    templateHtml,
    fullTemplateHtml,
    estimatesOnly = false,
  } = params

  const company = state.normInput?.companyName ?? 'unknown'
  const tracker = new UsageTracker({ company, mode })
  const tools = buildTools(
    state,
    templateHtml,
    fullTemplateHtml,
    callbacks,
    tracker,
  )

  let system: string
  let messages: ModelMessage[]

  if (mode === 'generate') {
    const companyName = state.normInput.companyName
    const website = state.normInput.website
    const desc = state.normInput.businessDescription
    const recip = state.normInput.recipientName
      ? `${state.normInput.recipientName}${
          state.normInput.recipientTitle
            ? ', ' + state.normInput.recipientTitle
            : ''
        }`
      : ''

    system = buildGenerationSystemPrompt(companyName, estimatesOnly)
    messages = [
      {
        role: 'user',
        content: `Generate a complete ROI report for ${companyName}.
Website: ${website}
Description: ${desc}
${recip ? 'Recipient: ' + recip : ''}
Industry: ${state.normInput.industry}
Country: ${state.normInput.country}
Currency: ${state.normInput.selectedCurrency}
Team size: ${state.normInput.teamSize}
Revenue range: ${state.normInput.revenueRange}
Key priorities: ${state.normInput.keyPriorities.join(', ')}
${
  state.normInput.workContext ? 'Context: ' + state.normInput.workContext : ''
}`,
      },
    ]
  } else {
    // Chat mode — state must have calcOutput + copy
    if (!state.calcOutput || !state.copy) {
      callbacks.onError(
        new Error('Chat mode requires a fully generated report state'),
      )
      return
    }
    system = buildChatSystemPrompt(state)
    messages = [
      ...(chatHistory ?? []),
      { role: 'user', content: message ?? '' },
    ]
  }

  const result = streamText({
    model: researchModel,
    system,
    messages,
    tools,
    stopWhen: stepCountIs(mode === 'generate' ? 25 : 14),
  })

  for await (const part of result.fullStream) {
    if (part.type === 'text-delta') {
      callbacks.onTextDelta(part.text)
    } else if (part.type === 'tool-call') {
      callbacks.onToolStart(part.toolName)
    } else if (part.type === 'error') {
      callbacks.onError(
        part.error instanceof Error
          ? part.error
          : new Error(String(part.error)),
      )
      return
    }
  }

  const response = await result.response

  // Track main agent loop usage and flush summary
  try {
    const usage = await result.usage
    tracker.record({ call: 'main_agent', model: 'o4-mini', ...usage })
  } catch {
    /* usage not available — skip */
  }
  tracker.flush()

  if (mode === 'generate' && !state.assembled) {
    const done =
      [
        state.company ? 'research' : null,
        state.globals ? 'model' : null,
        state.calcOutput ? 'calc' : null,
        state.copy ? 'writer' : null,
      ]
        .filter(Boolean)
        .join(', ') || 'none'
    const assistantText = response.messages
      .filter((m) => m.role === 'assistant')
      .flatMap((m) => {
        if (typeof m.content === 'string') return [m.content]
        if (!Array.isArray(m.content)) return []
        return m.content.flatMap((part) =>
          part.type === 'text' ? [part.text] : [],
        )
      })
      .join('\n')
      .trim()
    callbacks.onError(
      new Error(
        `Generation completed but no assembled report. Stages done: ${done}${
          assistantText
            ? ` | Assistant said: ${assistantText.slice(0, 300)}`
            : ''
        }`,
      ),
    )
    return
  }

  callbacks.onDone(response.messages)
}
