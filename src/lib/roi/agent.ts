/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
// ─────────────────────────────────────────────────────────────────────────────
// Unified ROI Report Agent
// Single streamText agent handles both generation and chat-based editing.
// Tools mutate ReportState in-place; onReportUpdate fires on every change to assembled.
// ─────────────────────────────────────────────────────────────────────────────

import { streamText, generateObject, jsonSchema, tool, stepCountIs, type ModelMessage } from 'ai'
import { z } from 'zod'

import { researchModel, fastModel } from '@/src/lib/roi/llm'
import { webSearch } from '@/src/lib/roi/tools/webSearch'
import { fetchPage } from '@/src/lib/roi/tools/fetchPage'
import { roiCalculator } from '@/src/lib/roi/pipeline/roiCalculator'
import { assembleReport } from '@/src/lib/roi/pipeline/assembleReport'
import { renderTemplate } from '@/src/lib/roi/pipeline/renderTemplate'
import { ROI_MODELER_SYSTEM_PROMPT, ROI_MODELER_SCHEMA } from '@/src/lib/roi/prompts/roiModeler'
import { REPORT_WRITER_SYSTEM_PROMPT, REPORT_WRITER_SCHEMA } from '@/src/lib/roi/prompts/reportWriter'

import type {
  ReportState,
  AgentCallbacks,
  ResearchAgentOutput,
  RoiModelerOutput,
  ReportWriterOutput,
  ProfitLever,
  ResilienceRow,
  RiskRow,
  ChecklistItem,
  CompanySnapshotItem,
  CostOfDelayData,
  WorkflowAssumption,
} from '@/src/lib/roi/types'

// ── Internal helpers ──────────────────────────────────────────────────────────

function reAssemble(state: ReportState, templateHtml: string, callbacks: AgentCallbacks) {
  if (!state.calcOutput || !state.writerOutput || !state.normInput) return
  state.assembled = assembleReport(state.calcOutput, state.writerOutput, state.normInput, state)
  state.renderedHtml = renderTemplate(templateHtml, state.assembled)
  callbacks.onReportUpdate(state)
}

// ── Tool definitions ──────────────────────────────────────────────────────────

function buildTools(state: ReportState, templateHtml: string, callbacks: AgentCallbacks, mode: 'generate' | 'chat') {
  const allTools = {
    // ── Research tools (available in both modes) ────────────────────────────
    web_search: tool({
      description: 'Search the web for company intelligence, industry benchmarks, or financial data.',
      inputSchema: z.object({
        query: z.string().describe('The search query'),
        maxResults: z.number().optional().describe('Max results to return (default 5)'),
      }),
      execute: async ({ query, maxResults }: { query: string; maxResults?: number }) => {
        return webSearch(query, maxResults ?? 3)
      },
    }),

    fetch_page: tool({
      description: 'Fetch and read the content of a web page (company website, LinkedIn, Apollo, etc.).',
      inputSchema: z.object({
        url: z.string().describe('The URL to fetch'),
      }),
      execute: async ({ url }: { url: string }) => {
        return fetchPage(url)
      },
    }),

    // ── Generation tools (sequenced during initial generation) ──────────────
    set_research_output: tool({
      description: 'Lock in the research findings: company profile, pain points, workflows, and intelligence metadata. Call this after completing all research.',
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
        pain_points: z.array(z.object({
          title: z.string(),
          description: z.string(),
          confidence: z.enum(['high', 'medium', 'low']),
          source: z.enum(['user_stated', 'inferred', 'research_derived']),
        })),
        workflows: z.array(z.object({
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
          volumeRationale: z.string().optional(),
        })),
        researchSummary: z.string().optional(),
        confidenceLevel: z.enum(['high', 'low']),
        revenueAnchor: z.number().nullable(),
        revenueAnchorSource: z.string().nullable(),
        coreThesis: z.string(),
      }),
      execute: async (input: ResearchAgentOutput & {
        confidenceLevel: 'high' | 'low'
        revenueAnchor: number | null
        revenueAnchorSource: string | null
        coreThesis: string
      }) => {
        const { confidenceLevel, revenueAnchor, revenueAnchorSource, coreThesis, ...researchOut } = input
        state.researchOutput = researchOut
        state.confidenceLevel = confidenceLevel
        state.revenueAnchor = revenueAnchor
        state.revenueAnchorSource = revenueAnchorSource
        state.coreThesis = coreThesis
        return { ok: true, workflows: researchOut.workflows.map(w => w.name) }
      },
    }),

    run_financial_model: tool({
      description: 'Run the financial model: calls the ROI modeler LLM, then the pure-TS calculator. Includes sanity checks (Rules 6B, 6D, 6E). Call after set_research_output.',
      inputSchema: z.object({}),
      execute: async () => {
        if (!state.researchOutput || !state.normInput) {
          return { error: 'run_financial_model called before set_research_output' }
        }

        const input = state.normInput
        const research = state.researchOutput

        // Build the modeler prompt context
        const modelerUserContent = JSON.stringify({
          company_profile: research.company_profile,
          workflows: research.workflows.map(w => ({
            name: w.name,
            function: w.function,
            monthlyVolume: w.monthlyVolume,
            minutesPerItemBefore: w.minutesPerItemBefore,
            minutesPerItemAfter: w.minutesPerItemAfter,
            volumeRationale: w.volumeRationale,
          })),
          processes: input.processes,
          selectedCurrency: input.selectedCurrency,
          country: input.country,
          teamSize: input.teamSize,
          revenueRange: input.revenueRange,
        })

        let modelerOut: RoiModelerOutput | null = null
        let calcOut = null
        let lastError = ''

        // Retry loop for sanity checks (Rules 6B, 6D, 6E) — max 2 retries
        for (let attempt = 0; attempt < 3; attempt++) {
          const retryHint = attempt > 0 ? `\n\nPREVIOUS ATTEMPT FAILED: ${lastError}. Adjust assumptions accordingly.` : ''

          const result = await generateObject({
            model: fastModel,
            schema: jsonSchema(ROI_MODELER_SCHEMA as object),
            system: ROI_MODELER_SYSTEM_PROMPT + retryHint,
            prompt: modelerUserContent,
          })

          modelerOut = result.object as RoiModelerOutput
          calcOut = roiCalculator(research, modelerOut)

          const s = calcOut.roi_data.summary
          const od = s.operationalDividend12mo
          const pu = s.profitUplift12mo
          const tf = s.totalFinancialGain12mo
          const revenueAnchor = state.revenueAnchor

          // Check Rule 6B: 5–20% revenue band
          if (revenueAnchor && revenueAnchor > 0) {
            const ratio = tf / revenueAnchor
            if (ratio < 0.05) {
              lastError = `Rule 6B: TFG (${tf}) is only ${(ratio * 100).toFixed(1)}% of revenue (${revenueAnchor}). Need ≥5%. Increase workflow volumes.`
              continue
            }
            if (ratio > 0.20) {
              lastError = `Rule 6B: TFG (${tf}) is ${(ratio * 100).toFixed(1)}% of revenue. Need ≤20%. Reduce impact percentages.`
              continue
            }
          }

          // Check Rule 6E: OD/PU ratio 0.8–3×
          if (od > 0) {
            const puRatio = pu / od
            if (puRatio > 3.0) {
              lastError = `Rule 6E: Profit uplift (${pu}) is ${puRatio.toFixed(1)}× the OD (${od}). Cap at 3×. Reduce profit lever assumptions.`
              continue
            }
            if (puRatio < 0.8) {
              lastError = `Rule 6E: Profit uplift (${pu}) is only ${puRatio.toFixed(1)}× the OD (${od}). Need ≥0.8×. Add revenue/throughput levers.`
              continue
            }
          }

          // All checks passed
          lastError = ''
          break
        }

        if (!modelerOut || !calcOut) {
          return { error: 'Financial model failed after retries: ' + lastError }
        }

        state.modelerOutput = modelerOut
        state.calcOutput = calcOut

        const s = calcOut.roi_data.summary
        return {
          ok: true,
          currency: modelerOut.currency,
          total_monthly_hours: calcOut.roi_data.totalMonthlyHours,
          od12: s.operationalDividend12mo,
          pu12: s.profitUplift12mo,
          tf12: s.totalFinancialGain12mo,
          payback_months: s.paybackMonths,
          figures: calcOut.figures,
          sanity_note: lastError || 'All checks passed',
        }
      },
    }),

    set_report_copy: tool({
      description: 'Write and lock in all report copy (9 v3.0 fields). Call after run_financial_model. This triggers the first report_update event.',
      inputSchema: z.object({
        unified_pattern_thesis: z.string().describe('KR-16: 2-3 sentences naming single operating pattern'),
        company_snapshot: z.array(z.object({
          text: z.string(),
          sourceType: z.enum(['scraped', 'benchmarked', 'assumed']),
        })).describe('3-5 bullets with source tags'),
        cta_paragraph: z.string().describe('NS-1: criteria-based CTA paragraph'),
        profit_levers: z.array(z.object({
          lever_name: z.string(),
          derived_from: z.string(),
          baseline_data: z.string(),
          assumption: z.string(),
          rationale: z.string(),
          rationale_with_arithmetic: z.string(),
          profit: z.string(),
        })).min(3).max(3),
        cost_of_delay: z.object({
          monthly_cost: z.number(),
          narrative: z.string(),
        }),
        resilience_rows: z.array(z.object({
          dimension: z.string(),
          act_now: z.string(),
          defer: z.string(),
        })).length(4),
        pilot_recommendation: z.string(),
        risks: z.array(z.object({
          risk: z.string(),
          detail: z.string().describe('2-3 sentences specific to this company explaining why this risk is relevant'),
          mitigation: z.string(),
        })).min(3),
        next_steps_checklist: z.array(z.object({
          action: z.string(),
          owner: z.string(),
          due: z.string(),
        })).length(6),
      }),
      execute: async (copy: ReportWriterOutput) => {
        state.writerOutput = copy
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    // ── Copy editing tools (fast, pure TS, ~100ms) ──────────────────────────
    update_cta: tool({
      description: 'Update the CTA paragraph (NS-1: criteria-based, not marketing language).',
      inputSchema: z.object({ cta_paragraph: z.string() }),
      execute: async ({ cta_paragraph }: { cta_paragraph: string }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, cta_paragraph }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_unified_thesis: tool({
      description: 'Update the unified pattern thesis (KR-16: 2-3 sentences naming single operating pattern).',
      inputSchema: z.object({ unified_pattern_thesis: z.string() }),
      execute: async ({ unified_pattern_thesis }: { unified_pattern_thesis: string }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, unified_pattern_thesis }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_profit_levers: tool({
      description: 'Update all profit levers. Each must include derived_from and rationale_with_arithmetic (Rule 6C).',
      inputSchema: z.object({
        profit_levers: z.array(z.object({
          lever_name: z.string(),
          derived_from: z.string(),
          baseline_data: z.string(),
          assumption: z.string(),
          rationale: z.string(),
          rationale_with_arithmetic: z.string(),
          profit: z.string(),
        })).min(3).max(3),
      }),
      execute: async ({ profit_levers }: { profit_levers: ProfitLever[] }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, profit_levers }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_resilience_rows: tool({
      description: 'Update the resilience positioning table (KR-17: exactly 4 rows).',
      inputSchema: z.object({
        resilience_rows: z.array(z.object({
          dimension: z.string(),
          act_now: z.string(),
          defer: z.string(),
        })).length(4),
      }),
      execute: async ({ resilience_rows }: { resilience_rows: ResilienceRow[] }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, resilience_rows }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_cost_of_delay: tool({
      description: 'Update the cost of delay section (KR-18: narrative MUST end with "Delay is not neutral — it carries a monthly price.").',
      inputSchema: z.object({
        cost_of_delay: z.object({
          monthly_cost: z.number(),
          narrative: z.string(),
        }),
      }),
      execute: async ({ cost_of_delay }: { cost_of_delay: CostOfDelayData }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, cost_of_delay }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_risks: tool({
      description: 'Update the risks and mitigations table (minimum 3 rows).',
      inputSchema: z.object({
        risks: z.array(z.object({
          risk: z.string(),
          detail: z.string().describe('2-3 sentences specific to this company explaining why this risk is relevant'),
          mitigation: z.string(),
        })).min(3),
      }),
      execute: async ({ risks }: { risks: RiskRow[] }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, risks }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_next_steps: tool({
      description: 'Update the next steps checklist (NS-2: exactly 6 items, each with a named owner).',
      inputSchema: z.object({
        next_steps_checklist: z.array(z.object({
          action: z.string(),
          owner: z.string(),
          due: z.string(),
        })).length(6),
      }),
      execute: async ({ next_steps_checklist }: { next_steps_checklist: ChecklistItem[] }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, next_steps_checklist }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    update_pilot_recommendation: tool({
      description: 'Update the pilot recommendation (WD-1: must reference specific company characteristics, not generic).',
      inputSchema: z.object({ pilot_recommendation: z.string() }),
      execute: async ({ pilot_recommendation }: { pilot_recommendation: string }) => {
        if (!state.writerOutput) return { error: 'No report copy to update' }
        state.writerOutput = { ...state.writerOutput, pilot_recommendation }
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    // ── Assumption editing tool (no LLM, instant recalc) ────────────────────
    update_workflow_assumption: tool({
      description: 'Change a workflow assumption (volume, time, rate). Instantly recalculates all financial figures — no LLM required.',
      inputSchema: z.object({
        workflowName: z.string().describe('Must match a workflow name exactly'),
        patches: z.object({
          monthlyVolume: z.number().optional(),
          minutesPerItemBefore: z.number().optional(),
          minutesPerItemAfter: z.number().optional(),
          fullyLoadedHourlyCostOverride: z.number().optional(),
          adoption_base: z.number().min(0).max(1).optional(),
          rationale: z.string().optional(),
        }),
      }),
      execute: async ({ workflowName, patches }: { workflowName: string; patches: Record<string, unknown> }) => {
        if (!state.modelerOutput || !state.researchOutput) {
          return { error: 'No modeler output to patch' }
        }
        const idx = state.modelerOutput.workflowAssumptions.findIndex(
          a => a.workflowName.toLowerCase() === workflowName.toLowerCase()
        )
        if (idx === -1) {
          return { error: `Workflow "${workflowName}" not found. Available: ${state.modelerOutput.workflowAssumptions.map(a => a.workflowName).join(', ')}` }
        }
        state.modelerOutput = {
          ...state.modelerOutput,
          workflowAssumptions: state.modelerOutput.workflowAssumptions.map((a, i) =>
            i === idx ? { ...a, ...patches } : a
          ),
        }
        state.calcOutput = roiCalculator(state.researchOutput, state.modelerOutput)
        reAssemble(state, templateHtml, callbacks)
        const s = state.calcOutput.roi_data.summary
        return {
          ok: true,
          new_od12: s.operationalDividend12mo,
          new_tf12: s.totalFinancialGain12mo,
          new_monthly_hours: state.calcOutput.roi_data.totalMonthlyHours,
        }
      },
    }),

    // ── LLM-driven full rewrite ──────────────────────────────────────────────
    rewrite_report_copy: tool({
      description: 'Regenerate all 9 copy fields via LLM (5-10s). Use when the user wants a comprehensive rewrite or new research context.',
      inputSchema: z.object({
        instruction: z.string().describe('What to change or improve'),
      }),
      execute: async ({ instruction }: { instruction: string }) => {
        if (!state.calcOutput) return { error: 'No calc output available' }
        const ctx = buildWriterContext(state, instruction)
        const result = await generateObject({
          model: researchModel,
          schema: jsonSchema(REPORT_WRITER_SCHEMA as object),
          system: REPORT_WRITER_SYSTEM_PROMPT,
          prompt: ctx,
        })
        state.writerOutput = result.object as ReportWriterOutput
        reAssemble(state, templateHtml, callbacks)
        return { ok: true }
      },
    }),

    // ── Workflow structure tools ─────────────────────────────────────────────
    add_workflow: tool({
      description: 'Add a new workflow to the report. Only call this for workflows NOT already in the current workflow list. Triggers financial recalculation.',
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
      execute: async ({ workflow }: { workflow: ResearchAgentOutput['workflows'][0] }) => {
        if (!state.researchOutput) return { error: 'No research output' }

        // Guard: prevent adding a workflow that already exists
        const alreadyExists = state.researchOutput.workflows.some(
          w => w.name.toLowerCase() === workflow.name.toLowerCase()
        )
        if (alreadyExists) {
          return { error: `Workflow "${workflow.name}" already exists. Use update_workflow_assumption to change its parameters.` }
        }

        state.researchOutput = {
          ...state.researchOutput,
          workflows: [...state.researchOutput.workflows, workflow],
        }

        // Add a matching modeler assumption so the calc stays consistent
        if (state.modelerOutput) {
          const existing = state.modelerOutput.workflowAssumptions
          const avgRate = existing.length > 0
            ? existing.reduce((s, a) => s + (a.fullyLoadedHourlyCostOverride ?? state.modelerOutput!.labor.fullyLoadedHourlyCost), 0) / existing.length
            : state.modelerOutput.labor.fullyLoadedHourlyCost
          const newAssump: WorkflowAssumption = {
            workflowName: workflow.name,
            monthlyVolume: workflow.monthlyVolume ?? 100,
            minutesPerItemBefore: workflow.minutesPerItemBefore ?? 60,
            minutesPerItemAfter: workflow.minutesPerItemAfter ?? 12,
            exceptionRate: 0.05,
            exceptionMinutes: 15,
            adoption_low: 0.5,
            adoption_base: 0.7,
            adoption_high: 0.9,
            rationale: 'Added via chat — defaults applied. Use update_workflow_assumption to refine.',
            fullyLoadedHourlyCostOverride: Math.round(avgRate),
          }
          state.modelerOutput = {
            ...state.modelerOutput,
            workflowAssumptions: [...state.modelerOutput.workflowAssumptions, newAssump],
          }
          state.calcOutput = roiCalculator(state.researchOutput, state.modelerOutput)
          reAssemble(state, templateHtml, callbacks)
        }
        return { ok: true, workflow_count: state.researchOutput.workflows.length }
      },
    }),

    remove_workflow: tool({
      description: 'Remove a workflow from the report. Recalculates figures without an LLM call.',
      inputSchema: z.object({ workflowName: z.string() }),
      execute: async ({ workflowName }: { workflowName: string }) => {
        if (!state.researchOutput || !state.modelerOutput) return { error: 'No research/modeler output' }
        state.researchOutput = {
          ...state.researchOutput,
          workflows: state.researchOutput.workflows.filter(w => w.name !== workflowName),
        }
        state.modelerOutput = {
          ...state.modelerOutput,
          workflowAssumptions: state.modelerOutput.workflowAssumptions.filter(
            a => a.workflowName !== workflowName
          ),
        }
        state.calcOutput = roiCalculator(state.researchOutput, state.modelerOutput)
        reAssemble(state, templateHtml, callbacks)
        return { ok: true, workflow_count: state.researchOutput.workflows.length }
      },
    }),
  }

  // Generation-only tools are excluded in chat mode to prevent the agent from
  // calling set_report_copy (full rewrite) instead of targeted update_* tools.
  if (mode === 'chat') {
    const { set_research_output, run_financial_model, set_report_copy, ...chatTools } = allTools
    // eslint-disable-next-line no-void
    void set_research_output; void run_financial_model; void set_report_copy
    return chatTools
  }

  return allTools
}

// ── Writer context builder (for rewrite_report_copy) ─────────────────────────

function buildWriterContext(state: ReportState, instruction: string): string {
  const calc = state.calcOutput!
  const s = calc.roi_data.summary
  const sym = calc.roi_data.currency.symbol

  return `INSTRUCTION: ${instruction}

FIGURES (use verbatim):
  totalMonthlyHours: ${calc.figures.totalMonthlyHours}
  totalAnnualHours: ${calc.figures.totalAnnualHours}
  operationalDividend12mo: ${calc.figures.operationalDividend12mo}
  profitUplift12mo: ${calc.figures.profitUplift12mo} (raw: ${s.profitUplift12mo})
  totalFinancialGain12mo: ${calc.figures.totalFinancialGain12mo}
  workflowLines: ${calc.figures.workflowLines.join(' | ')}

COMPANY: ${calc.roi_data.company} | ${calc.roi_data.industry} | ${calc.roi_data.country ?? ''} | ${calc.roi_data.employees ?? 'unknown'} employees
RECIPIENT: ${state.normInput?.recipientName ?? ''} ${state.normInput?.recipientTitle ? ', ' + state.normInput.recipientTitle : ''}
CORE THESIS: ${state.coreThesis ?? ''}
CONFIDENCE: ${state.confidenceLevel ?? 'low'}

WORKFLOWS:
${calc.roi_data.workflows.map(w =>
  `  [${w.name}] ${w.volume}/mo × ${w.timeBefore}→${w.timeAfter} min @ ${sym}${w.rate}/hr → ${sym}${w.annualValue}/yr`
).join('\n')}

CURRENT COPY (for reference):
  unified_pattern_thesis: ${state.writerOutput?.unified_pattern_thesis ?? ''}
  cta_paragraph: ${state.writerOutput?.cta_paragraph ?? ''}
`
}

// ── System prompts ────────────────────────────────────────────────────────────

function buildGenerationSystemPrompt(companyName: string): string {
  return `You are the LyRise ROI Report Agent. Your job is to produce a high-quality, credible AI ROI report for ${companyName}.

COGNITIVE WORKFLOW (silent internal reasoning — never show phase names to user):

PHASE 1 — Intelligence Vectoring: define 3–5 Key Intelligence Questions across Executive, Corporate, and Industry vectors.

PHASE 2 — Multi-Vector Intelligence Gathering. Research in this sequence:
1. Fetch the company website directly using fetch_page
2. Search data aggregators: web_search("{company} site:apollo.io OR site:clodura.ai OR site:zoominfo.com") then fetch_page the best result
3. Search LinkedIn: web_search("{company} site:linkedin.com/company") then fetch_page for headcount + industry
4. If a recipient name is provided: web_search("{name} {company} site:linkedin.com/in") and fetch_page their profile
5. Search for financial/industry signals: web_search("{company} {industry} revenue employees {year}")
Narrate your findings to the user as you go. Flag confidence levels.

PHASE 3 — Confidence Assessment: declare "high" (most data scraped) or "low" (mostly benchmarked/assumed). Derive revenue from headcount × industry avg if not found directly.

PHASE 4 — Critical Thinking Nexus: produce ONE Core Operational Thesis: "[Main bottleneck] + [Highest-value automation opportunity]"

PHASE 5 — Thesis-Driven Workflow Prioritization: select 4 workflows. Rule 6A: assign per-workflow rates from named benchmarks (Gulf Talent, Bayt.com, Robert Half, LinkedIn Salary Insights, Glassdoor).

PHASE 6 — Quantitative Dossier: baseline + automation impact + source type for each workflow.

After phases 1–6, call tools in order:
  set_research_output(…) → run_financial_model() → set_report_copy(…)

MANDATORY for set_report_copy:
• unified_pattern_thesis (KR-16): 2-3 sentences naming SINGLE operating pattern, no workflow lists
• rationale_with_arithmetic (Rule 6C): full arithmetic chain in every profit lever
• derived_from: workflow name(s) each lever originates from
• cost_of_delay (KR-18): monthly_cost = TFG12/12; narrative MUST end with "Delay is not neutral — it carries a monthly price."
• resilience_rows (KR-17): exactly 4 rows; dimensions: Cost per unit, Delivery speed, Error rate, Strategic capacity
• pilot_recommendation (WD-1): MUST reference specific company characteristics (employees, volume)
• cta_paragraph (NS-1): criteria-based — "If [conditions] describe your situation, a 30-min call with elena@lyrise.ai would be worthwhile."
• next_steps_checklist (NS-2): exactly 6 items, each with named owner + due date

TERMINOLOGY (mandatory):
• "Operational Dividend" — never "cost savings"
• "Total Financial Gain" — never "ROI"
• "Hours Returned" — never "time saved"`
}

function buildChatSystemPrompt(state: ReportState): string {
  const calc = state.calcOutput!
  const writer = state.writerOutput!
  const roi = calc.roi_data
  const s = roi.summary
  const sym = roi.currency.symbol

  const wfLines = roi.workflows.map(w =>
    `  [${w.name}] dept: ${w.function} | owner: ${w.owner}
    Volume: ${w.volume}/mo | Time: ${w.timeBefore}→${w.timeAfter} min (${w.savingsPct}% saved)
    Rate: ${sym}${w.rate}/hr | Monthly: ${w.monthlyHours} hrs | Annual: ${sym}${w.annualValue}
    Source: ${w.source}`
  ).join('\n')

  const waLines = state.modelerOutput?.workflowAssumptions.map(wa =>
    `  [${wa.workflowName}] vol=${wa.monthlyVolume}/mo before=${wa.minutesPerItemBefore}min after=${wa.minutesPerItemAfter}min rate=${sym}${wa.fullyLoadedHourlyCostOverride ?? state.modelerOutput?.labor.fullyLoadedHourlyCost}/hr (${wa.seniorityLevel ?? 'blended'}, ${wa.rateSource ?? ''}) adoption=${wa.adoption_base}`
  ).join('\n') ?? ''

  const leverLines = writer.profit_levers?.map(l =>
    `  [${l.lever_name}] from:${l.derived_from} | ${sym}${l.profit} | ${l.rationale_with_arithmetic ?? l.rationale}`
  ).join('\n') ?? ''

  return `You are the LyRise ROI Report Editor for ${roi.company}.

═══ COMPANY ════════════════════════════════════════════
Name: ${roi.company} | Industry: ${roi.industry} | Country: ${roi.country ?? 'unknown'}
Employees: ${roi.employees ?? 'unknown'} | Revenue: ${roi.revenue ? sym + roi.revenue + 'M' : 'unknown'}
Confidence: ${state.confidenceLevel ?? 'low'} | Core thesis: ${state.coreThesis ?? ''}

═══ WORKFLOWS (${roi.workflows.length}) ══════════════════════════════════
${wfLines}

═══ FINANCIAL SUMMARY ══════════════════════════════════
Annual hours returned: ${calc.figures.totalAnnualHours} hrs (${calc.figures.statFTE} FTE equiv.)
12-mo: OD ${sym}${s.operationalDividend12mo} | PU ${sym}${s.profitUplift12mo} | TFG ${sym}${s.totalFinancialGain12mo}
24-mo: OD ${sym}${s.operationalDividend24mo} | TFG ${sym}${s.totalFinancialGain24mo}
36-mo: OD ${sym}${s.operationalDividend36mo} | TFG ${sym}${s.totalFinancialGain36mo}
Impl: ${sym}${s.implCost} | Tooling: ${sym}${s.monthlyTooling}/mo | Payback: ${s.paybackMonths ?? '?'} mo

═══ MODELING ASSUMPTIONS ════════════════════════════════
${waLines}
Realization: ${state.modelerOutput?.realizationFactor} | Profit multiplier: ${state.modelerOutput?.profitMultiplier}

═══ CURRENT COPY ════════════════════════════════════════
Thesis: ${writer.unified_pattern_thesis ?? ''}
CTA: ${writer.cta_paragraph ?? ''}
Pilot rec: ${writer.pilot_recommendation ?? ''}
Levers:
${leverLines}

═══ YOUR CAPABILITIES ═══════════════════════════════════
Copy tools (~100ms): update_cta, update_unified_thesis, update_profit_levers,
  update_resilience_rows, update_cost_of_delay, update_risks, update_next_steps, update_pilot_recommendation
Assumption tool (no LLM, instant): update_workflow_assumption
LLM rewrite (5-10s): rewrite_report_copy
Research: web_search, fetch_page
Structure: add_workflow (NEW workflows only), remove_workflow

STRICT RULES:
- set_report_copy and run_financial_model are NOT available in chat mode. Never attempt to call them.
- NEVER call add_workflow for a workflow already in the WORKFLOWS list above — the tool will reject it.
- For any change to a single section, use the targeted update_* tool — not rewrite_report_copy.
- rewrite_report_copy is only for when the user explicitly requests a full rewrite.
- For numerical/volume changes, use update_workflow_assumption — it recalculates everything instantly.
- KR-18: never remove "Delay is not neutral — it carries a monthly price."
- KR-17: resilience_rows always exactly 4 rows.
- NS-2: next_steps_checklist always exactly 6 items.
- Narrate what you're changing before calling the tool.`
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function runReportAgent(params: {
  mode: 'generate' | 'chat'
  state: ReportState
  message?: string
  chatHistory?: ModelMessage[]
  callbacks: AgentCallbacks
  templateHtml: string
}): Promise<void> {
  const { mode, state, message, chatHistory, callbacks, templateHtml } = params

  const tools = buildTools(state, templateHtml, callbacks, mode)

  let system: string
  let messages: ModelMessage[]

  if (mode === 'generate') {
    const companyName = state.normInput.companyName
    const website = state.normInput.website
    const desc = state.normInput.businessDescription
    const recip = state.normInput.recipientName
      ? `${state.normInput.recipientName}${state.normInput.recipientTitle ? ', ' + state.normInput.recipientTitle : ''}`
      : ''

    system = buildGenerationSystemPrompt(companyName)
    messages = [{
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
${state.normInput.workContext ? 'Context: ' + state.normInput.workContext : ''}`,
    }]
  } else {
    // Chat mode — state must have calcOutput + writerOutput
    if (!state.calcOutput || !state.writerOutput) {
      callbacks.onError(new Error('Chat mode requires a fully generated report state'))
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
    stopWhen: stepCountIs(mode === 'generate' ? 16 : 6),
  })

  for await (const part of result.fullStream) {
    if (part.type === 'text-delta') {
      callbacks.onTextDelta(part.text)
    } else if (part.type === 'tool-call') {
      callbacks.onToolStart(part.toolName)
    } else if (part.type === 'error') {
      callbacks.onError(part.error instanceof Error ? part.error : new Error(String(part.error)))
      return
    }
  }

  if (mode === 'generate' && !state.assembled) {
    callbacks.onError(new Error('Generation completed but no assembled report was produced.'))
    return
  }

  callbacks.onDone()
}
