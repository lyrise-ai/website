// ─────────────────────────────────────────────────────────────────────────────
// roiCalculator — pure TypeScript, no LLM calls
// Single source: WorkflowInput[] + GlobalInputs + CompanyProfile
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WorkflowInput,
  GlobalInputs,
  CompanyProfile,
  WorkflowCalc,
  RoiCalculatorOutput,
} from '@/src/lib/roi/types'

const MAX_MIN = 480

function addCommas(n: number): string {
  const str = String(Math.round(n || 0))
  let out = ''
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) out += ','
    out += str[i]
  }
  return out
}

function calcScenario(
  wf: WorkflowInput,
  globals: GlobalInputs,
): { monthlyHours: number; annualHours: number; annualValue: number } {
  const minutesBefore = Math.min(wf.minutesPerItemBefore, MAX_MIN)
  const minutesAfter = Math.min(wf.minutesPerItemAfter, minutesBefore)
  const netSaved = Math.max(
    0,
    minutesBefore - minutesAfter - wf.exceptionRate * wf.exceptionMinutes,
  )
  const rate =
    wf.rateOverride != null && wf.rateOverride > 0
      ? wf.rateOverride
      : globals.laborRate
  const workingMonthFactor = globals.workWeeksPerYear / 52
  const hrs =
    ((wf.monthlyVolume * wf.adoptionRate * netSaved) / 60) *
    globals.realizationFactor *
    workingMonthFactor
  return {
    monthlyHours: hrs,
    annualHours: hrs * 12,
    annualValue: hrs * 12 * rate,
  }
}

export function roiCalculator(
  workflows: WorkflowInput[],
  globals: GlobalInputs,
  company: CompanyProfile,
): RoiCalculatorOutput {
  const sym = globals.currency.symbol
  const workingMonthFactor = globals.workWeeksPerYear / 52

  const workflowCalcs: WorkflowCalc[] = workflows.map((wf) => {
    const minutesBefore = Math.min(wf.minutesPerItemBefore, MAX_MIN)
    const minutesAfter = Math.min(wf.minutesPerItemAfter, minutesBefore)
    const effectiveRate =
      wf.rateOverride != null && wf.rateOverride > 0
        ? wf.rateOverride
        : globals.laborRate
    const timeSaved = minutesBefore - minutesAfter
    const savingsPct =
      minutesBefore > 0 ? Math.round((timeSaved / minutesBefore) * 100) : 0
    const costPerRun = Math.round((minutesBefore / 60) * effectiveRate)
    const monthlyCost = Math.round(wf.monthlyVolume * costPerRun)
    const { monthlyHours, annualHours, annualValue } = calcScenario(wf, globals)
    return {
      name: wf.name,
      effectiveRate,
      timeSaved,
      savingsPct,
      costPerRun,
      monthlyCost,
      monthlyHours: Math.round(monthlyHours),
      monthlyValue: Math.round(monthlyHours * effectiveRate),
      annualHours: Math.round(annualHours),
      annualValue: Math.round(annualValue),
    }
  })

  // Revenue guardrail — keep TFG within 5–20% of estimated revenue
  const revenueM = company.revenueEstimateM
  if (revenueM != null && revenueM > 0) {
    const rawOD = workflowCalcs.reduce((s, w) => s + w.annualValue, 0)
    const rawTF = rawOD * globals.profitMultiplier
    const revenueU = revenueM * 1e6
    const ceiling = revenueU * 0.2
    const floor = revenueU * 0.05

    const applyScale = (scale: number) => {
      workflowCalcs.forEach((w) => {
        w.annualValue = Math.round(w.annualValue * scale)
        w.monthlyValue = Math.round(w.monthlyValue * scale)
        w.annualHours = Math.round(w.annualHours * scale)
        w.monthlyHours = Math.round(w.monthlyHours * scale)
      })
    }

    if (rawOD > 0) {
      if (rawTF > ceiling) {
        const targetOD = ceiling / globals.profitMultiplier
        const rounded = Math.round(targetOD / 1000) * 1000
        applyScale((rounded > 0 ? rounded : targetOD) / rawOD)
      } else if (rawTF < floor) {
        const targetOD = floor / globals.profitMultiplier
        const rounded = Math.round(targetOD / 1000) * 1000
        applyScale((rounded > 0 ? rounded : targetOD) / rawOD)
      }
    }
  }

  const totalMonthlyHours = workflowCalcs.reduce(
    (s, w) => s + w.monthlyHours,
    0,
  )
  const totalAnnualHours = workflowCalcs.reduce((s, w) => s + w.annualHours, 0)
  const totalAnnualValue = workflowCalcs.reduce((s, w) => s + w.annualValue, 0)

  const od12 = Math.round(totalAnnualValue)
  const pu12 = Math.round(totalAnnualValue * (globals.profitMultiplier - 1))
  const tf12 = od12 + pu12
  const od24 = Math.round(od12 * 2.15)
  const pu24 = Math.round(pu12 * 2.15)
  const tf24 = od24 + pu24
  const od36 = Math.round(od12 * 3.4)
  const pu36 = Math.round(pu12 * 3.4)
  const tf36 = od36 + pu36

  const monthlyValue = totalAnnualValue / 12
  const adjImplCost = Math.max(
    Math.round(monthlyValue * 6),
    Math.min(Math.round(monthlyValue * 10), globals.implementationCost),
  )
  const adjPayback =
    totalAnnualValue > 0 ? Math.ceil(adjImplCost / monthlyValue) : null

  const fmtCur = (n: number) => sym + addCommas(n)
  const fmtShort = (n: number) => {
    const v = Math.round(n)
    if (v >= 1_000_000) return sym + (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 1_000) return sym + Math.round(v / 1_000) + 'K'
    return fmtCur(v)
  }

  // Build calculation-friendly figures (sorted desc by value)
  const sortedCalcs = [...workflowCalcs].sort(
    (a, b) => b.annualValue - a.annualValue,
  )

  return {
    workflows: workflowCalcs,
    totalMonthlyHours: Math.round(totalMonthlyHours),
    totalAnnualHours: Math.round(totalAnnualHours),
    summary: {
      totalAnnualHours: Math.round(totalAnnualHours),
      operationalDividend12mo: od12,
      profitUplift12mo: pu12,
      totalFinancialGain12mo: tf12,
      operationalDividend24mo: od24,
      profitUplift24mo: pu24,
      totalFinancialGain24mo: tf24,
      operationalDividend36mo: od36,
      profitUplift36mo: pu36,
      totalFinancialGain36mo: tf36,
      implCost: adjImplCost,
      monthlyTooling: globals.monthlyToolingCost,
      paybackMonths: adjPayback,
    },
    figures: {
      totalMonthlyHours: addCommas(Math.round(totalMonthlyHours)),
      totalAnnualHours: addCommas(Math.round(totalAnnualHours)),
      statFTE: (totalAnnualHours / 2000).toFixed(1),
      operationalDividend12mo: fmtCur(od12),
      profitUplift12mo: fmtCur(pu12),
      totalFinancialGain12mo: fmtCur(tf12),
      totalFinancialGainShort: fmtShort(tf12),
      workflowLines: sortedCalcs.map(
        (w) =>
          `${w.name}: ${addCommas(w.monthlyHours)} hrs/mo freed, ${fmtCur(
            w.annualValue,
          )}/yr`,
      ),
    },
  }
}
