/**
 * Alpha Tour — Internal Dashboard
 *
 * Displays analytics from the alpha_feedback Supabase table.
 * For internal LyRise team use only — not linked from any public page.
 *
 * Sections:
 *   1. Key metrics (PMF score, total responses, completion rate, avg virality)
 *   2. PMF segmentation (horizontal bars)
 *   3. Step completion funnel
 *   4. Open feedback (main benefit + improvement)
 *   5. Recent submissions table
 */

import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { createClient } from '../src/lib/supabase-browser'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Round a number to one decimal place. */
const round1 = (n) => Math.round(n * 10) / 10

/** Format an ISO date string as "Jun 5, 2026". */
const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Return a Tailwind text-color class based on the pmf_disappointed value. */
const disappointmentColor = (val) => {
  if (val === 'Very disappointed') return 'text-emerald-600 bg-emerald-50'
  if (val === 'Somewhat disappointed') return 'text-blue-600 bg-blue-50'
  if (val === 'Not disappointed') return 'text-slate-500 bg-slate-100'
  return 'text-slate-400 bg-slate-50'
}

/** Render 1-5 filled stars for a virality score. */
function Stars({ value }) {
  if (!value) return <span className="text-slate-300 text-xs">—</span>
  return (
    <span className="text-amber-400 text-sm">
      {'★'.repeat(value)}
      <span className="text-slate-200">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({ title, value, subtitle, valueColor = 'text-slate-900' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {title}
      </p>
      <p className={`text-3xl font-bold mb-1 ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  )
}

// ── Horizontal bar row ────────────────────────────────────────────────────────

function BarRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 font-medium">{label}</span>
        <span className="text-slate-500 tabular-nums">
          {count} &nbsp;<span className="text-slate-400">({pct}%)</span>
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Funnel row ────────────────────────────────────────────────────────────────

function FunnelRow({ label, count, baseline }) {
  const pct = baseline > 0 ? Math.round((count / baseline) * 100) : 0
  return (
    <div className="flex items-center gap-4">
      <div className="w-52 shrink-0">
        <p className="text-sm text-slate-700">{label}</p>
      </div>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-24 text-right shrink-0">
        <span className="text-sm font-semibold text-slate-700 tabular-nums">
          {count}
        </span>
        <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AlphaDashboard() {
  const [rows, setRows] = useState(null)   // null = loading, [] = loaded empty
  const [error, setError] = useState(false)
  const [lastFetched, setLastFetched] = useState(null)

  // Fetch all rows from alpha_feedback, ordered newest first
  const fetchData = useCallback(async () => {
    setRows(null)
    setError(false)
    try {
      const supabase = createClient()
      const { data, error: sbError } = await supabase
        .from('alpha_feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (sbError) throw sbError
      setRows(data ?? [])
      setLastFetched(new Date())
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (rows === null && !error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-slate-400 text-sm animate-pulse">Loading dashboard…</p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-slate-500 text-sm">Could not load dashboard data.</p>
        <button
          type="button"
          onClick={fetchData}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  // ── Derived metrics ───────────────────────────────────────────────────────────

  const total = rows.length

  // Section 1 — Key metrics
  const veryDisappointed = rows.filter(
    (r) => r.pmf_disappointed === 'Very disappointed',
  ).length
  const pmfScore = total > 0 ? Math.round((veryDisappointed / total) * 100) : 0
  const pmfColor =
    pmfScore >= 40 ? 'text-emerald-600' : pmfScore >= 20 ? 'text-amber-500' : 'text-red-500'

  const completedCount = rows.filter((r) => r.tour_completed).length
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0

  const viralityRows = rows.filter((r) => r.pmf_virality != null)
  const avgVirality =
    viralityRows.length > 0
      ? round1(viralityRows.reduce((sum, r) => sum + r.pmf_virality, 0) / viralityRows.length)
      : null

  // Section 2 — PMF segmentation counts
  const pmfCounts = {
    very: rows.filter((r) => r.pmf_disappointed === 'Very disappointed').length,
    somewhat: rows.filter((r) => r.pmf_disappointed === 'Somewhat disappointed').length,
    not: rows.filter((r) => r.pmf_disappointed === 'Not disappointed').length,
  }

  // Section 3 — Funnel steps
  // Baseline for the funnel is total rows (each row = one tester session)
  const funnelBaseline = total
  const funnelSteps = [
    { label: 'Intake form completed', count: rows.filter((r) => r.step_intake_completed).length },
    { label: 'Report generated', count: rows.filter((r) => r.step_generation_completed).length },
    { label: 'Report explored', count: rows.filter((r) => r.step_report_completed).length },
    { label: 'Survey submitted', count: rows.filter((r) => r.step_survey_completed).length },
  ]

  // Section 4 — Open feedback
  const benefitFeedback = rows.filter((r) => r.pmf_main_benefit)
  const improvementFeedback = rows.filter((r) => r.pmf_improvement)

  // Section 5 — Recent 10 rows (already sorted desc by created_at)
  const recentRows = rows.slice(0, 10)

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <title>Alpha Dashboard | LyRise Internal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">
            Alpha Tour — Internal Dashboard
          </h1>
          <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
            🔒 Internal only
          </span>
        </div>
        <div className="flex items-center gap-4">
          {lastFetched && (
            <span className="text-xs text-slate-400">
              Updated {lastFetched.toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            onClick={fetchData}
            className="text-sm font-medium text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
          >
            Refresh ↻
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-10">

        {/* ── Section 1: Key metrics ── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Key Metrics
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              title="PMF Score"
              value={total > 0 ? `${pmfScore}%` : '—'}
              subtitle="target: 40%+"
              valueColor={pmfColor}
            />
            <MetricCard
              title="Total Responses"
              value={total}
              subtitle="alpha testers"
            />
            <MetricCard
              title="Completion Rate"
              value={total > 0 ? `${completionRate}%` : '—'}
              subtitle="finished the full tour"
            />
            <MetricCard
              title="Avg Virality Score"
              value={avgVirality != null ? `${avgVirality} / 5` : '—'}
              subtitle="would share with exec"
            />
          </div>
        </section>

        {/* ── Section 2: PMF segmentation ── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            How would users feel without this product?
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            {total} total response{total !== 1 ? 's' : ''}
          </p>
          <div className="space-y-4">
            <BarRow
              label="Very disappointed"
              count={pmfCounts.very}
              total={total}
              color="bg-emerald-500"
            />
            <BarRow
              label="Somewhat disappointed"
              count={pmfCounts.somewhat}
              total={total}
              color="bg-blue-500"
            />
            <BarRow
              label="Not disappointed"
              count={pmfCounts.not}
              total={total}
              color="bg-slate-400"
            />
          </div>
        </section>

        {/* ── Section 3: Funnel ── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Where do users drop off?
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Baseline: {funnelBaseline} session{funnelBaseline !== 1 ? 's' : ''}
          </p>
          <div className="space-y-4">
            {funnelSteps.map(({ label, count }) => (
              <FunnelRow
                key={label}
                label={label}
                count={count}
                baseline={funnelBaseline}
              />
            ))}
          </div>
        </section>

        {/* ── Section 4: Open feedback ── */}
        <section className="grid grid-cols-2 gap-6">
          {/* Left: what users value most */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              What users value most
            </h2>
            {benefitFeedback.length === 0 ? (
              <p className="text-xs text-slate-400">No responses yet.</p>
            ) : (
              <div className="space-y-3">
                {benefitFeedback.map((r, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      {r.pmf_main_benefit}
                    </p>
                    {r.pmf_disappointed && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${disappointmentColor(r.pmf_disappointed)}`}
                      >
                        {r.pmf_disappointed}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: what would improve this */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              What would improve this
            </h2>
            {improvementFeedback.length === 0 ? (
              <p className="text-xs text-slate-400">No responses yet.</p>
            ) : (
              <div className="space-y-3">
                {improvementFeedback.map((r, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      {r.pmf_improvement}
                    </p>
                    {r.pmf_disappointed && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${disappointmentColor(r.pmf_disappointed)}`}
                      >
                        {r.pmf_disappointed}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Section 5: Recent submissions table ── */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent responses</h2>
            <p className="text-xs text-slate-400">Last {recentRows.length} submissions</p>
          </div>

          {recentRows.length === 0 ? (
            <p className="text-xs text-slate-400 px-6 py-8 text-center">
              No submissions yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Date', 'Feeling', 'Virality', 'Completed'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-slate-600 tabular-nums whitespace-nowrap">
                      {fmtDate(r.created_at)}
                    </td>
                    <td className="px-6 py-3">
                      {r.pmf_disappointed ? (
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${disappointmentColor(r.pmf_disappointed)}`}
                        >
                          {r.pmf_disappointed}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <Stars value={r.pmf_virality} />
                    </td>
                    <td className="px-6 py-3 text-base">
                      {r.tour_completed ? '✅' : '⏳'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

      </div>
    </div>
  )
}
