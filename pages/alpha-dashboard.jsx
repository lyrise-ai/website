/**
 * Alpha Tour — Internal Dashboard
 *
 * Displays analytics from the alpha_feedback Supabase table.
 * For internal LyRise team use only — not linked from any public page.
 *
 * Sections:
 *   1. Key metrics (dual PMF score, total responses, completion rate, avg virality)
 *   2. PMF segmentation (horizontal bars) + Vohra roadmap split
 *   2b. Persona word cloud (who loves this product most)
 *   3. Step completion funnel
 *   4. Open feedback (main benefit + filtered improvement)
 *   5. Most mentioned words (word frequency clouds)
 *   6. Recent submissions table
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import Head from 'next/head'
import { createClient } from '../src/lib/supabase-browser'
import { createClient as createServerClient } from '../src/lib/supabase-server'
import { getRoleForUser } from '../src/lib/authHelpers'
import MainHeader from '../src/layout/MainHeader/index'

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

/** Return true when a text value is non-null, ≥ 3 chars, and not a bare punctuation mark. */
const isValidText = (val) => val != null && val.length >= 3 && !/^[^\w\s]$/.test(val)

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

// ── Word frequency ────────────────────────────────────────────────────────────

/**
 * Combines all text in `field` across `responses`, strips stop words and
 * short tokens, and returns the top N words sorted by frequency.
 * Accepts optional extraStopWords and a limit (default 15).
 */
function getWordFrequency(responses, field, { extraStopWords = [], limit = 15 } = {}) {
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'is','it','this','that','was','are','be','as','by','from','have','has',
    'i','my','we','our','you','your','they','their','not','no','so','if',
    'its','will','can','do','all','more','about','would','there','what',
    'which','when','how','who','been','were','had','did','get','got','just',
    'also','very','really','good','great','nice','like','think','know',
    'use','need',
    'too','much','many','most','some','any','each','few','those','these',
    'than','then','them','into','out','up','down','over','under','again',
    'further','once','here','where','why','both','same','other','such','own',
    ...extraStopWords,
  ])
  const freq = {}
  responses
    .map((r) => String(r[field] ?? '').toLowerCase())
    .join(' ')
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w))
    .forEach((w) => { freq[w] = (freq[w] || 0) + 1 })
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }))
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

/**
 * Small inline ⓘ that reveals an explanatory tooltip on hover.
 * Uses CSS group-hover so no JS state is needed.
 */
function InfoIcon({ text }) {
  return (
    <span className="relative inline-flex items-center group/tip cursor-help ml-1.5">
      <span className="text-slate-400 text-xs select-none">ⓘ</span>
      {/* Tooltip panel — hidden until hover */}
      <span className="pointer-events-none absolute left-0 top-full mt-1 z-50 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-600 leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
        {text}
      </span>
    </span>
  )
}

// ── Metric card ───────────────────────────────────────────────────────────────

/** Standard single-value metric card. Accepts an optional tooltip. */
function MetricCard({ title, value, subtitle, valueColor = 'text-slate-900', tooltip }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
        {title}
        {tooltip && <InfoIcon text={tooltip} />}
      </p>
      <p className={`text-3xl font-bold mb-1 ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  )
}

// ── Dual PMF card ─────────────────────────────────────────────────────────────

/**
 * PMF Score card that shows two numbers:
 *   Top (larger)  — Segmented PMF: score calculated on the core persona only
 *   Bottom (gray) — Raw PMF: score across all responses
 * Following Vohra's methodology where segmenting to your true market
 * often reveals a much stronger signal than the raw average.
 */
function DualPmfCard({ rawScore, segScore, segColor, total, tooltip }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
        PMF Score
        {tooltip && <InfoIcon text={tooltip} />}
      </p>
      {/* Segmented PMF — the focused, persona-filtered score */}
      <p className={`text-3xl font-bold leading-none ${segColor}`}>
        {total === 0 || segScore === null ? '—' : `${segScore}%`}
      </p>
      <p className="text-[10px] text-slate-400 mt-0.5 mb-3">Segmented PMF</p>
      {/* Raw PMF — all-responses baseline, shown smaller in gray */}
      <p className="text-base font-semibold text-slate-400 leading-none">
        {total === 0 ? '—' : `${rawScore}%`}
      </p>
      <p className="text-[10px] text-slate-400 mt-0.5">Raw PMF · target: 40%+</p>
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

// ── Playbook modal ────────────────────────────────────────────────────────────

/** Full-screen modal explaining the Vohra PMF methodology behind this dashboard. */
function PlaybookModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 mb-1">📖 The Playbook</h2>
        <p className="text-sm text-slate-500 mb-8">
          How to read this dashboard and the logic behind it
        </p>

        <div className="space-y-8 text-slate-700">

          {/* Section 1 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              The One Number That Matters
            </h3>
            <p className="text-sm leading-relaxed">
              The PMF Score measures what % of your users would be 'very disappointed' if they
              could no longer use the product. This metric was pioneered by Rahul Vohra at
              Superhuman. The magic number is 40% — companies above this threshold have strong
              product-market fit. Below 40% means you have work to do.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Why We Show Two PMF Scores
            </h3>
            <p className="text-sm leading-relaxed">
              The Raw PMF score includes everyone. The Segmented PMF score focuses only on your
              core persona — the people who most resemble your 'very disappointed' users. Vohra
              found that segmenting to your true target market often raises the score
              significantly, revealing where the product genuinely resonates.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              The Four Steps of Vohra's Engine
            </h3>
            <ol className="space-y-3 text-sm leading-relaxed list-none">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">1</span>
                <span><strong>Segment:</strong> Identify your 'very disappointed' users. These are your biggest fans and they define your target market.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">2</span>
                <span><strong>Build the persona:</strong> Ask very disappointed users who they think benefits most. They almost always describe themselves. Their words become your customer persona.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">3</span>
                <span><strong>Find what they love:</strong> Look at what very disappointed users say is the main benefit. This is what to DOUBLE DOWN on.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">4</span>
                <span><strong>Find what holds others back:</strong> From somewhat disappointed users who share the same main benefit as your fans, look at what they want improved. This is what to FIX NEXT.</span>
              </li>
            </ol>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              The 50/50 Roadmap Rule
            </h3>
            <p className="text-sm leading-relaxed">
              Vohra's key insight: spend exactly half your product roadmap doubling down on what
              your biggest fans love, and the other half fixing what holds almost-fans back. If
              you only do one or the other, the score won't move.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              The Somewhat Disappointed Filter
            </h3>
            <p className="text-sm leading-relaxed">
              Not all feedback from somewhat disappointed users is useful. We only show
              improvement feedback from somewhat disappointed users whose main benefit matches
              what very disappointed users love. If a somewhat disappointed user likes something
              completely different about the product, their improvement requests would take you
              in the wrong direction.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              The Virality Score — Our Addition
            </h3>
            <p className="text-sm leading-relaxed">
              Vohra's original framework has 4 questions. We added a 5th: how likely are you to
              share this report with a decision-maker? For LyRise, the ROI Report is a B2B sales
              tool — a user who would share it with their CFO is a stronger signal than one who
              just found it useful.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Never Survey the Same Person Twice
            </h3>
            <p className="text-sm leading-relaxed">
              This is critical. If you survey the same person multiple times, the 40% benchmark
              becomes meaningless. Each alpha tester gets a unique token. Once they submit, their
              token is marked used and they cannot submit again.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              The Drop-off Funnel
            </h3>
            <p className="text-sm leading-relaxed">
              The funnel shows where users abandon the alpha tour. The step with the biggest drop
              between two rows is your biggest UX problem. Fix that step first before worrying
              about anything else.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Further Reading
            </h3>
            <a
              href="https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              Read the original Vohra article →
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}

// ── Access control ────────────────────────────────────────────────────────────

export async function getServerSideProps({ req, res }) {
  const supabase = createServerClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const { role, error: roleError } = await getRoleForUser(user.id)
  if (roleError || role !== 'EMPLOYEE') {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  return { props: {} }
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AlphaDashboard() {
  const [rows, setRows] = useState(null)   // null = loading, [] = loaded empty
  const [error, setError] = useState(false)
  const [lastFetched, setLastFetched] = useState(null)
  // Controls visibility of the Playbook modal
  const [showPlaybook, setShowPlaybook] = useState(false)

  // Fetch all rows from alpha_feedback, ordered newest first
  // chat_keywords are stored directly on each row (saved at tour-exit time)
  // so no separate chat_messages query is needed.
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

  // Chat word cloud — must be declared before any conditional returns to satisfy
  // the Rules of Hooks. Uses rows ?? [] so it's safe during the loading state.
  const chatWords = useMemo(() => {
    const allKeywords = (rows ?? [])
      .filter((r) => r.chat_keywords && r.chat_keywords.length > 0)
      .flatMap((r) => r.chat_keywords)

    const freq = {}
    allKeywords.forEach((word) => { freq[word] = (freq[word] || 0) + 1 })

    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }))
  }, [rows])

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

  // Section 4 — Open feedback (filtered: non-null, ≥ 3 chars, not bare punctuation)
  const benefitFeedback = rows.filter((r) => isValidText(r.pmf_main_benefit))
  const improvementFeedback = rows.filter((r) => isValidText(r.pmf_improvement))

  // Word frequency inputs — scoped by disappointment segment
  const veryDisRows = rows.filter(
    (r) => r.pmf_disappointed === 'Very disappointed' && isValidText(r.pmf_main_benefit),
  )
  const somewhatDisRows = rows.filter(
    (r) => r.pmf_disappointed === 'Somewhat disappointed' && isValidText(r.pmf_improvement),
  )
  const veryBenefitWords = getWordFrequency(veryDisRows, 'pmf_main_benefit')
  const somewhatImprovementWords = getWordFrequency(somewhatDisRows, 'pmf_improvement')

  // Vohra roadmap split — surface the single most-common response per segment
  const getMostCommon = (arr, field) => {
    const freq = {}
    arr.forEach((r) => { if (r[field]) freq[r[field]] = (freq[r[field]] || 0) + 1 })
    const sorted = Object.entries(freq).sort(([, a], [, b]) => b - a)
    return sorted.length > 0 ? sorted[0][0] : null
  }
  const vohraDoubleDown = getMostCommon(veryDisRows, 'pmf_main_benefit')
  const vohraFixNext = getMostCommon(somewhatDisRows, 'pmf_improvement')

  // ── Persona word cloud (Part 1 addition) ─────────────────────────────────────
  // Very disappointed users answering "who benefits most?" almost always describe
  // themselves — their words become the core customer persona.
  const veryDisPersonaRows = rows.filter(
    (r) => r.pmf_disappointed === 'Very disappointed' && isValidText(r.pmf_who_benefits),
  )
  const personaWords = getWordFrequency(veryDisPersonaRows, 'pmf_who_benefits')

  // ── Segmented PMF score (Part 2 addition) ────────────────────────────────────
  // Top 3 persona words define the core segment; segmented PMF is calculated only
  // among rows whose pmf_who_benefits contains at least one of those words.
  const top3PersonaWords = personaWords.slice(0, 3).map(({ word }) => word)
  const segmentedRows =
    top3PersonaWords.length > 0
      ? rows.filter(
          (r) =>
            isValidText(r.pmf_who_benefits) &&
            top3PersonaWords.some((w) =>
              String(r.pmf_who_benefits ?? '').toLowerCase().includes(w),
            ),
        )
      : []
  const segmentedVery = segmentedRows.filter(
    (r) => r.pmf_disappointed === 'Very disappointed',
  ).length
  const segmentedPmfScore =
    segmentedRows.length > 0
      ? Math.round((segmentedVery / segmentedRows.length) * 100)
      : null
  const segmentedPmfColor =
    segmentedPmfScore == null
      ? 'text-slate-400'
      : segmentedPmfScore >= 40
      ? 'text-emerald-600'
      : segmentedPmfScore >= 20
      ? 'text-amber-500'
      : 'text-red-500'

  // ── Filtered improvement feedback (Part 3 addition) ──────────────────────────
  // Only show improvement requests from somewhat disappointed users whose main
  // benefit overlaps with what very disappointed users love (top 3 benefit words).
  // This keeps the feedback focused — unrelated improvement requests would pull
  // the roadmap in the wrong direction.
  const veryBenefitTop3 = veryBenefitWords.slice(0, 3).map(({ word }) => word)
  const filteredImprovementFeedback = rows.filter(
    (r) =>
      r.pmf_disappointed === 'Somewhat disappointed' &&
      isValidText(r.pmf_improvement) &&
      isValidText(r.pmf_main_benefit) &&
      veryBenefitTop3.length > 0 &&
      veryBenefitTop3.some((w) =>
        String(r.pmf_main_benefit ?? '').toLowerCase().includes(w),
      ),
  )

  // Subsection B — improvement suggestions from very disappointed users (our biggest fans)
  const veryDisImprovementFeedback = rows.filter(
    (r) => r.pmf_disappointed === 'Very disappointed' && isValidText(r.pmf_improvement),
  )

  // Section 6 — Recent 10 rows (already sorted desc by created_at)
  const recentRows = rows.slice(0, 10)

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <title>Alpha Dashboard | LyRise Internal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <MainHeader />

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
          {/* Playbook button — opens the Vohra methodology explainer modal */}
          <button
            type="button"
            onClick={() => setShowPlaybook(true)}
            className="text-sm font-medium text-slate-700 border border-slate-200 bg-white rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            📖 The Playbook
          </button>
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
            {/* Dual PMF card: segmented PMF (top) and raw PMF (bottom) */}
            <DualPmfCard
              rawScore={pmfScore}
              segScore={segmentedPmfScore}
              segColor={segmentedPmfColor}
              total={total}
              tooltip="% of users who would be 'very disappointed' without this product. Vohra's magic number is 40%+."
            />
            <MetricCard
              title="Total Responses"
              value={total}
              subtitle="alpha testers"
              tooltip="Total alpha testers who started the survey. Never survey the same person twice."
            />
            <MetricCard
              title="Completion Rate"
              value={total > 0 ? `${completionRate}%` : '—'}
              subtitle="finished the full tour"
              tooltip="% who finished the entire tour including the PMF survey."
            />
            <MetricCard
              title="Avg Virality Score"
              value={avgVirality != null ? `${avgVirality} / 5` : '—'}
              subtitle="would share with exec"
              tooltip="How likely users are to share this with a decision-maker. Our custom 5th question beyond Vohra's 4."
            />
          </div>
        </section>

        {/* ── Section 2: PMF segmentation ── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
            How would users feel without this product?
            <InfoIcon text="Vohra Step 1 — segment all responses by disappointment level. The 'very disappointed' group defines your core market." />
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

          {/* Vohra roadmap split — Superhuman PMF methodology made visible */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-800 mb-3 flex items-center">
              Vohra's roadmap split
              <InfoIcon text="Vohra Step 3 — spend 50% of your roadmap doubling down on what very disappointed users love, and 50% fixing what holds somewhat disappointed users back." />
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* What "very disappointed" users love most — double down here */}
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600 mb-1">
                  Double down on →
                </p>
                <p className="text-sm text-slate-700 leading-snug">
                  {vohraDoubleDown ?? 'Collect more responses'}
                </p>
              </div>
              {/* What "somewhat disappointed" users want fixed — prioritise this */}
              <div className="bg-white rounded-lg p-3 border border-amber-200">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
                  Fix next →
                </p>
                <p className="text-sm text-slate-700 leading-snug">
                  {vohraFixNext ?? 'Collect more responses'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2b: Persona word cloud ── */}
        {/* Vohra Step 1b — very disappointed users almost always describe
            themselves when asked who benefits most. Their words = the persona. */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
            Who loves this product most — persona profile
            <InfoIcon text="Vohra Step 1b — very disappointed users almost always describe themselves when asked who benefits most. Their words = your customer persona." />
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Based on Q2 responses from 'Very disappointed' users only
          </p>
          {veryDisPersonaRows.length < 3 ? (
            <p className="text-xs text-slate-400">
              Not enough responses yet to build a persona profile.
            </p>
          ) : (
            <>
              {/* Word pills — font size proportional to frequency */}
              <div className="flex flex-wrap gap-2">
                {personaWords.map(({ word, count }) => (
                  <span
                    key={word}
                    className={`inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full ${
                      count >= 3
                        ? 'text-2xl font-semibold'
                        : count >= 2
                        ? 'text-lg font-medium'
                        : 'text-base font-normal'
                    }`}
                  >
                    {word}
                    <span className="text-blue-500 text-xs">({count})</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                These users are describing themselves — this is your core customer persona
              </p>
            </>
          )}
        </section>

        {/* ── Section 3: Funnel ── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
            Where do users drop off?
            <InfoIcon text="Where users abandon the alpha tour. The step with the biggest drop is your biggest UX problem." />
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
          {/* Left: what users value most — all valid benefit responses */}
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

          {/* Right: improvement requests split into two subsections */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-slate-900">What would improve this</h2>

            {/* Subsection A — somewhat disappointed users who share the main benefit */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-0.5">
                From somewhat disappointed users
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Who share our main benefit — highest priority fixes
              </p>
              {filteredImprovementFeedback.length === 0 ? (
                <p className="text-xs text-slate-400">No matching responses yet.</p>
              ) : (
                <div className="space-y-3">
                  {filteredImprovementFeedback.map((r, i) => (
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

            {/* Subsection B — very disappointed users (biggest fans) with improvement ideas */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-0.5">
                From very disappointed users
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Our biggest fans still have suggestions
              </p>
              {veryDisImprovementFeedback.length === 0 ? (
                <p className="text-xs text-slate-400">No responses yet.</p>
              ) : (
                <div className="space-y-3">
                  {veryDisImprovementFeedback.map((r, i) => (
                    <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-3">
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
          </div>
        </section>

        {/* ── Section 5: Most mentioned words ── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
            Most mentioned words
            <InfoIcon text="Vohra Step 2 — word frequency analysis of open text responses. Left cloud = what to double down on. Right cloud = what to fix next." />
          </h2>
          <p className="text-xs text-slate-400 mb-6">Extracted from open-ended responses</p>
          <div className="grid grid-cols-2 gap-6">
            {/* Left: top words from "very disappointed" users' main benefit */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-3">
                What very disappointed users value
              </p>
              {veryDisRows.length < 3 ? (
                <p className="text-xs text-slate-400">
                  Not enough responses yet to show word patterns. Check back after more testers complete the tour.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {veryBenefitWords.map(({ word, count }) => (
                    <span
                      key={word}
                      className={`inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full ${
                        count >= 3
                          ? 'text-lg font-semibold'
                          : count >= 2
                          ? 'text-base font-medium'
                          : 'text-sm font-normal'
                      }`}
                    >
                      {word}
                      <span className="text-blue-500 text-xs">({count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Right: top words from "somewhat disappointed" users' improvement requests */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-3">
                What somewhat disappointed users want improved
              </p>
              {somewhatDisRows.length < 3 ? (
                <p className="text-xs text-slate-400">
                  Not enough responses yet to show word patterns. Check back after more testers complete the tour.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {somewhatImprovementWords.map(({ word, count }) => (
                    <span
                      key={word}
                      className={`inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full ${
                        count >= 3
                          ? 'text-lg font-semibold'
                          : count >= 2
                          ? 'text-base font-medium'
                          : 'text-sm font-normal'
                      }`}
                    >
                      {word}
                      <span className="text-amber-500 text-xs">({count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Section 6: AI assistant chat word cloud ── */}
        {/* Shows what users type when chatting with the AI editor —
            high-frequency words reveal what they want to modify or understand */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
            What users ask the AI assistant about
            <InfoIcon text="Words most commonly used when testers chat with the AI assistant. High frequency words reveal what users want to modify or clarify in their reports." />
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Common themes from chat editing sessions — shows what users want to change or understand
          </p>
          {chatWords.length === 0 ? (
            <p className="text-xs text-slate-400">
              No chat sessions recorded yet. Keywords will appear here after alpha testers use
              the AI assistant and finish the tour.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {chatWords.map(({ word, count }) => (
                <span
                  key={word}
                  className={`inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full ${
                    count >= 3
                      ? 'text-lg font-semibold'
                      : count >= 2
                      ? 'text-base font-medium'
                      : 'text-sm font-normal'
                  }`}
                >
                  {word}
                  <span className="text-amber-500 text-xs">({count})</span>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── Section 7: Recent submissions table ── */}
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

      {/* ── Playbook modal — rendered at root level so it overlays everything ── */}
      {showPlaybook && <PlaybookModal onClose={() => setShowPlaybook(false)} />}

    </div>
  )
}
