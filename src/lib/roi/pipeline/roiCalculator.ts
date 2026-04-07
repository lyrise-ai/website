// ─────────────────────────────────────────────────────────────────────────────
// roiCalculator — port of the ROI Calculator n8n Code node
// Pure TypeScript, fully deterministic — no LLM calls
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ResearchAgentOutput,
  RoiModelerOutput,
  RoiCalculatorOutput,
  WorkflowResult,
  WorkflowAssumption,
} from '@/src/lib/roi/types'

const MAX_MIN = 480

function findAssump(
  wfName: string,
  workflows: ResearchAgentOutput['workflows'],
  wfAssumps: WorkflowAssumption[]
): WorkflowAssumption | null {
  const lower = (wfName ?? '').toLowerCase()
  return (
    // 1. Exact name match
    wfAssumps.find(a => (a.workflowName ?? '').toLowerCase() === lower) ??
    // 2. Substring match on first 8 chars
    wfAssumps.find(a => lower.includes((a.workflowName ?? '').toLowerCase().slice(0, 8))) ??
    // 3. Same positional index as the workflow in the research output
    wfAssumps[workflows.findIndex(w => w.name === wfName)] ??
    // 4. Ultimate fallback: first available assumption (prevents crash on name mismatches)
    wfAssumps[0] ??
    null
  )
}

function calcScenario(
  wa: WorkflowAssumption,
  adoptionRate: number,
  realizationFactor: number,
  workingMonthFactor: number,
  hourlyCost: number
) {
  const netSaved = Math.max(
    0,
    wa.minutesPerItemBefore - wa.minutesPerItemAfter - wa.exceptionRate * wa.exceptionMinutes
  )
  const hrs = (wa.monthlyVolume * adoptionRate * netSaved / 60) * realizationFactor * workingMonthFactor
  return { monthlyHours: hrs, annualHours: hrs * 12, annualValue: hrs * 12 * hourlyCost }
}

function addCommas(n: number): string {
  const str = String(Math.round(n || 0))
  let out = ''
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) out += ','
    out += str[i]
  }
  return out
}

export function roiCalculator(
  analystOut: ResearchAgentOutput,
  modelerOut: RoiModelerOutput
): RoiCalculatorOutput {
  const profile   = analystOut.company_profile
  const workflows = analystOut.workflows
  const wfAssumps = modelerOut.workflowAssumptions

  const currency          = modelerOut.currency
  const hourlyCost        = modelerOut.labor.fullyLoadedHourlyCost
  const workWeeksPerYear  = modelerOut.labor.workWeeksPerYear || 48
  const realizationFactor = modelerOut.realizationFactor
  const profitMultiplier  = modelerOut.profitMultiplier
  const implCost          = modelerOut.costs.implementationCost
  const monthlyTooling    = modelerOut.costs.monthlyToolingCost
  const workingMonthFactor = workWeeksPerYear / 52

  const workflowResults: WorkflowResult[] = workflows.map(wf => {
    const wa = { ...findAssump(wf.name, workflows, wfAssumps) } as WorkflowAssumption
    if (!wa.workflowName) {
      // No modeler assumptions at all — should not happen but guard anyway
      throw new Error(`ROI Calculator: modeler returned no assumptions (workflow: "${wf.name}")`)
    }
    // Stamp the correct workflow name so downstream rendering uses the right label
    wa.workflowName = wf.name

    wa.minutesPerItemBefore = Math.min(wa.minutesPerItemBefore, MAX_MIN)
    wa.minutesPerItemAfter  = Math.min(wa.minutesPerItemAfter, wa.minutesPerItemBefore)

    // Rule 6A — use per-workflow rate override if the modeler provided one
    const effectiveRate = (wa.fullyLoadedHourlyCostOverride != null && wa.fullyLoadedHourlyCostOverride > 0)
      ? wa.fullyLoadedHourlyCostOverride
      : hourlyCost

    const timeSaved  = wa.minutesPerItemBefore - wa.minutesPerItemAfter
    const savingsPct = wa.minutesPerItemBefore > 0
      ? Math.round(timeSaved / wa.minutesPerItemBefore * 100)
      : 0
    const costPerRun  = (wa.minutesPerItemBefore / 60) * effectiveRate
    const monthlyCost = Math.round(wa.monthlyVolume * costPerRun)
    const base        = calcScenario(wa, wa.adoption_base, realizationFactor, workingMonthFactor, effectiveRate)

    return {
      name:            wf.name,
      function:        wf.function        || 'Operations',
      owner:           wf.owner           || '—',
      agentName:       wf.agentName       || '',
      whyItMatters:    wf.whyItMatters    || '',
      expectedOutcome: wf.expectedOutcome || '',
      source:          wf.sourceType      || 'inferred',
      volume:          Math.round(wa.monthlyVolume),
      timeBefore:      wa.minutesPerItemBefore,
      timeAfter:       wa.minutesPerItemAfter,
      timeSaved:       Math.round(timeSaved),
      savingsPct,
      costPerRun:      Math.round(costPerRun),
      monthlyCost,
      monthlyHours:    Math.round(base.monthlyHours),
      monthlyValue:    Math.round(base.monthlyHours * effectiveRate),
      annualHours:     Math.round(base.annualHours),
      annualValue:     Math.round(base.annualValue),
      rate:            effectiveRate,
      rationale:       wa.rationale || '',
    }
  })

  // Revenue guardrail — enforce 5–20% of annual revenue band
  const revenueM = profile.revenueEstimateM
  if (revenueM != null && revenueM > 0) {
    const rawOD    = workflowResults.reduce((s, w) => s + w.annualValue, 0)
    // profitMultiplier is not yet applied here — use it to estimate TFG
    const rawTF    = rawOD * profitMultiplier
    const revenueU = revenueM * 1e6
    const ceiling  = revenueU * 0.20
    const floor    = revenueU * 0.05

    const applyScale = (scale: number) => {
      workflowResults.forEach(w => {
        w.annualValue  = Math.round(w.annualValue  * scale)
        w.monthlyValue = Math.round(w.monthlyValue * scale)
        w.annualHours  = Math.round(w.annualHours  * scale)
        w.monthlyHours = Math.round(w.monthlyHours * scale)
      })
    }

    if (rawOD > 0) {
      // Ceiling: TFG > 20% → scale down OD so TFG lands at ceiling
      if (rawTF > ceiling) {
        const targetOD = ceiling / profitMultiplier
        const rounded  = Math.round(targetOD / 1000) * 1000
        applyScale((rounded > 0 ? rounded : targetOD) / rawOD)
      }
      // Floor: TFG < 5% → scale up OD so TFG lands at floor
      else if (rawTF < floor) {
        const targetOD = floor / profitMultiplier
        const rounded  = Math.round(targetOD / 1000) * 1000
        applyScale((rounded > 0 ? rounded : targetOD) / rawOD)
      }
    }
  }

  const totalMonthlyHours = workflowResults.reduce((s, w) => s + w.monthlyHours, 0)
  const totalAnnualHours  = workflowResults.reduce((s, w) => s + w.annualHours,  0)
  const totalAnnualValue  = workflowResults.reduce((s, w) => s + w.annualValue,  0)

  const od12 = Math.round(totalAnnualValue)
  const pu12 = Math.round(totalAnnualValue * (profitMultiplier - 1))
  const tf12 = od12 + pu12
  const od24 = Math.round(od12 * 2.15)
  const pu24 = Math.round(pu12 * 2.15)
  const tf24 = od24 + pu24
  const od36 = Math.round(od12 * 3.40)
  const pu36 = Math.round(pu12 * 3.40)
  const tf36 = od36 + pu36

  // Enforce 6–10 month payback
  const monthlyValue = totalAnnualValue / 12
  const adjImplCost  = Math.max(Math.round(monthlyValue * 6), Math.min(Math.round(monthlyValue * 10), implCost))
  const adjPayback   = totalAnnualValue > 0 ? Math.ceil(adjImplCost / monthlyValue) : null

  const sym      = currency.symbol
  const fmtCur   = (n: number) => sym + addCommas(n)
  const fmtShort = (n: number) => {
    const v = Math.round(n)
    if (v >= 1_000_000) return sym + (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 1_000)     return sym + Math.round(v / 1_000) + 'K'
    return fmtCur(v)
  }

  return {
    roi_data: {
      company:       profile.company,
      industry:      profile.industry,
      country:       profile.country,
      primaryFocus:  profile.primaryFocus,
      keyPriorities: profile.keyPriorities ?? [],
      employees:     profile.employees,
      revenue:       profile.revenueEstimateM,
      currency,
      workflows:     workflowResults,
      totalMonthlyHours: Math.round(totalMonthlyHours),
      totalAnnualHours:  Math.round(totalAnnualHours),
      profitMultiplier,
      realizationFactor,
      workWeeksPerYear,
      summary: {
        totalAnnualHours,
        operationalDividend12mo: od12, profitUplift12mo: pu12, totalFinancialGain12mo: tf12,
        operationalDividend24mo: od24, profitUplift24mo: pu24, totalFinancialGain24mo: tf24,
        operationalDividend36mo: od36, profitUplift36mo: pu36, totalFinancialGain36mo: tf36,
        implCost: adjImplCost, monthlyTooling, paybackMonths: adjPayback,
      },
    },
    figures: {
      totalMonthlyHours:       addCommas(Math.round(totalMonthlyHours)),
      totalAnnualHours:        addCommas(Math.round(totalAnnualHours)),
      statFTE:                 (totalAnnualHours / 2000).toFixed(1),
      operationalDividend12mo: fmtCur(od12),
      profitUplift12mo:        fmtCur(pu12),
      totalFinancialGain12mo:  fmtCur(tf12),
      totalFinancialGainShort: fmtShort(tf12),
      workflowLines: workflowResults.map(w =>
        `${w.name}: ${addCommas(w.monthlyHours)} hrs/mo freed, ${fmtCur(w.annualValue)}/yr`
      ),
    },
    analystData:  analystOut,
    modelerNotes: modelerOut.notes?.assumptions ?? [],
  }
}
