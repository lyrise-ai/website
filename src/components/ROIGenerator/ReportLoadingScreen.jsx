import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHASES = [
  {
    id: 'research',
    label: 'Research',
    subLabel: 'Collecting benchmark and market inputs',
    heading: 'Running company research',
    logs: [
      'Fetching company profile…',
      'Querying SIC classification…',
      'Resolving peer-company set…',
      'Loading industry benchmark data…',
      'Cross-referencing public filings…',
      'Validating source coverage…',
      'Aggregating sector metrics…',
      'Normalising headcount ranges…',
      'Confirming regional salary bands…',
      'Checking attrition benchmarks…',
    ],
  },
  {
    id: 'model',
    label: 'Financial Model',
    subLabel: 'Running ROI projections and scenario analysis',
    heading: 'Running financial analysis',
    logs: [
      'Initialising model inputs…',
      'Computing headcount cost basis…',
      'Applying regional salary adjustments…',
      'Calibrating CAC payback periods…',
      'Running 3-year projection set…',
      'Stress-testing attrition assumptions…',
      'Reconciling output values…',
      'Validating model constraints…',
      'Checking sensitivity thresholds…',
      'Locking projection assumptions…',
    ],
  },
  {
    id: 'report',
    label: 'Report',
    subLabel: 'Compiling executive summary and financial outputs',
    heading: 'Preparing ROI report',
    logs: [
      'Compiling executive summary…',
      'Rendering profit-lever analysis…',
      'Formatting financial tables…',
      'Applying document structure…',
      'Assembling section index…',
      'Inserting benchmark comparisons…',
      'Validating section completeness…',
      'Encoding report payload…',
      'Finalising deliverable…',
      'Report ready for review…',
    ],
  },
]

const PHASE_DURATION_MS = 9000
const LOG_INTERVAL_MS = 1400

function nowLabel() {
  const d = new Date()
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

function makeJobRef() {
  return 'ROI-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function ReportLoadingScreen({
  generationLog,
  viewState = 'generating',
}) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [logs, setLogs] = useState([])
  const [elapsed, setElapsed] = useState(0)
  const logId = useRef(0)
  const logCursor = useRef(0)
  const jobRef = useRef(makeJobRef())
  const startTime = useRef(new Date())

  // eslint-disable-next-line security/detect-object-injection
  const activePhase = PHASES[phaseIndex]
  const isFinalising = viewState === 'finalising'
  const isComplete = viewState === 'complete'
  const isDoneOrFinalising = isFinalising || isComplete

  // Phase auto-advance
  useEffect(() => {
    if (isDoneOrFinalising) return () => {}
    if (phaseIndex >= PHASES.length - 1) return () => {}
    const t = setTimeout(() => {
      setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1))
      logCursor.current = 0
    }, PHASE_DURATION_MS)
    return () => clearTimeout(t)
  }, [phaseIndex, isDoneOrFinalising])

  // Drive phase from real generation log events
  useEffect(() => {
    if (!generationLog || isDoneOrFinalising) return
    if (generationLog.includes('financial model') && phaseIndex < 1) {
      setPhaseIndex(1)
      logCursor.current = 0
    } else if (generationLog.includes('report copy') && phaseIndex < 2) {
      setPhaseIndex(2)
      logCursor.current = 0
    }
  }, [generationLog, phaseIndex, isDoneOrFinalising])

  // Elapsed timer
  useEffect(() => {
    const start = Date.now()
    const t = setInterval(
      () => setElapsed(Math.floor((Date.now() - start) / 1000)),
      1000,
    )
    return () => clearInterval(t)
  }, [])

  // Log streaming — stops when finalising/complete and appends completion line
  useEffect(() => {
    if (isDoneOrFinalising) {
      logId.current += 1
      setLogs((prev) => {
        // Only append the completion line if it's not already there
        if (prev.length > 0 && prev[prev.length - 1].phase === 'finalising') {
          return prev
        }
        return [
          ...prev,
          {
            id: logId.current,
            phase: 'finalising',
            text: '✓ Report assembled successfully',
            time: nowLabel(),
          },
        ].slice(-14)
      })
      return () => {}
    }

    const seed = activePhase.logs[0]
    if (seed) {
      logId.current += 1
      setLogs((prev) =>
        [
          ...prev,
          {
            id: logId.current,
            phase: activePhase.id,
            text: seed,
            time: nowLabel(),
          },
        ].slice(-14),
      )
      logCursor.current = 1
    }
    const t = setInterval(() => {
      const next = activePhase.logs[logCursor.current % activePhase.logs.length]
      logCursor.current += 1
      logId.current += 1
      setLogs((prev) =>
        [
          ...prev,
          {
            id: logId.current,
            phase: activePhase.id,
            text: next,
            time: nowLabel(),
          },
        ].slice(-14),
      )
    }, LOG_INTERVAL_MS)
    return () => clearInterval(t)
  }, [activePhase, isDoneOrFinalising])

  const timeLabel = useMemo(() => {
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0')
    const s = String(elapsed % 60).padStart(2, '0')
    return `${m}:${s}`
  }, [elapsed])

  const startedAt = useMemo(() => {
    return startTime.current.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  // When finalising or complete, all pipeline stages show as complete
  const pipelinePhaseIndex = isDoneOrFinalising ? PHASES.length : phaseIndex

  let displayHeading = activePhase.heading
  let displaySubLabel = activePhase.subLabel
  if (isComplete) {
    displayHeading = 'ROI report ready'
    displaySubLabel = 'Opening report…'
  } else if (isFinalising) {
    displayHeading = 'Finalising report'
    displaySubLabel = 'Preparing deliverable'
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      {/* Progress bar */}
      <div className="fixed inset-x-0 top-0 z-20 h-[2px] overflow-hidden bg-gray-100">
        <div className="indeterminate-line absolute inset-y-0 w-1/3 bg-primary" />
      </div>

      {/* App header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div
              className="grid h-6 w-6 place-items-center rounded-md bg-navy text-white"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              <span className="text-[11px] font-bold leading-none">L</span>
            </div>
            <span
              className="text-[13px] font-semibold tracking-tight text-navy"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              LyRise
            </span>
            <span className="ml-1 text-gray-300">/</span>
            <span
              className="text-[12.5px] font-normal text-gray-500"
              style={{ fontFamily: 'Poppins' }}
            >
              ROI Report
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {isDoneOrFinalising ? (
                // Settled indicator — no pulse when finalising/complete
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              ) : (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              )}
              <span
                className="text-[11.5px] font-medium text-gray-500"
                style={{ fontFamily: 'Poppins' }}
              >
                {isComplete
                  ? 'Complete'
                  : isFinalising
                  ? 'Finalising'
                  : 'Processing'}
              </span>
            </div>
            <span className="text-gray-200">|</span>
            <span className="font-mono text-[10.5px] tabular-nums text-gray-400">
              {jobRef.current}
            </span>
            <span className="text-gray-200">|</span>
            <span className="font-mono text-[11px] tabular-nums text-gray-400">
              {timeLabel}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl px-6 py-6"
      >
        {/* Pipeline — all stages complete when finalising */}
        <PhasePipeline phaseIndex={pipelinePhaseIndex} />

        {/* Content cluster — micro-inset from pipeline edge */}
        <div className="pl-1.5">
          {/* Heading row */}
          <div className="mt-3 flex items-baseline justify-between">
            <div className="relative h-[22px] flex-1">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={displayHeading}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 text-[17px] font-medium leading-tight tracking-tight text-navy"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  {displayHeading}
                </motion.h1>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 items-center gap-3 pl-6">
              <span className="font-mono text-[10.5px] tabular-nums text-gray-400">
                Started {startedAt}
              </span>
              <span className="text-gray-200">·</span>
              <span className="font-mono text-[10.5px] tabular-nums text-gray-400">
                {timeLabel} elapsed
              </span>
            </div>
          </div>

          {/* Sub-label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={displaySubLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-1 text-[12px] text-gray-400"
              style={{ fontFamily: 'Poppins' }}
            >
              {displaySubLabel}
            </motion.p>
          </AnimatePresence>

          {/* Activity panel */}
          <div className="mt-6">
            <ActivityLog
              logs={logs}
              phaseIndex={phaseIndex}
              elapsed={elapsed}
              isFinalising={isDoneOrFinalising}
            />
          </div>

          {/* Footer note */}
          <p
            className="mt-1.5 text-[10px] text-gray-400 opacity-50"
            style={{ fontFamily: 'Poppins' }}
          >
            Your data is encrypted in transit and at rest.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function PhasePipeline({ phaseIndex }) {
  return (
    <nav aria-label="Report pipeline">
      <ol className="flex w-full items-center">
        {PHASES.map((p, i) => {
          const state =
            i < phaseIndex ? 'done' : i === phaseIndex ? 'active' : 'todo'
          return (
            <li key={p.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <PhaseDot state={state} />
                <span
                  className={
                    'text-[11.5px] font-medium tracking-tight ' +
                    (state === 'done'
                      ? 'text-gray-400'
                      : state === 'active'
                      ? 'text-navy'
                      : 'text-gray-300')
                  }
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div className="relative mx-3 h-px flex-1 overflow-hidden bg-gray-200">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gray-400"
                    initial={false}
                    animate={{ width: i < phaseIndex ? '100%' : '0%' }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function PhaseDot({ state }) {
  if (state === 'done') {
    return (
      <div className="grid h-[14px] w-[14px] place-items-center rounded-full bg-navy">
        <svg
          className="h-[7px] w-[7px] text-white"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 6.2L5 8.5L9.5 3.8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }
  if (state === 'active') {
    return (
      <div className="grid h-[14px] w-[14px] place-items-center rounded-full border border-gray-200 bg-white">
        <span className="relative flex h-[6px] w-[6px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
          <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-primary" />
        </span>
      </div>
    )
  }
  return (
    <div className="h-[14px] w-[14px] rounded-full border border-gray-200 bg-white" />
  )
}

function ActivityLog({ logs, phaseIndex, elapsed, isFinalising }) {
  const phaseActivityLabels = [
    'Data Collection',
    'Financial Modelling',
    'Report Assembly',
  ]
  // eslint-disable-next-line security/detect-object-injection
  const activePhaseLabel = phaseActivityLabels[phaseIndex]
  const logContainerRef = useRef(null)

  useLayoutEffect(() => {
    const el = logContainerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [logs])

  return (
    <div className="overflow-hidden rounded-lg border border-terminal-border/80 bg-terminal-bg shadow">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-terminal-border/50 px-4 py-2">
        <div className="flex items-center gap-2.5">
          <span
            className={
              'h-[6px] w-[6px] rounded-full ' +
              (isFinalising ? 'bg-gray-500' : 'bg-primary opacity-75')
            }
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terminal-fg opacity-55">
            Pipeline Activity
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-terminal-muted">
            {isFinalising
              ? 'Finalised'
              : `Phase ${phaseIndex + 1}/${
                  PHASES.length
                } — ${activePhaseLabel}`}
          </span>
          <span className="rounded border border-terminal-border/70 px-1.5 py-[1px] font-mono text-[9.5px] tabular-nums text-terminal-muted">
            {String(Math.floor(elapsed / 60)).padStart(2, '0')}:
            {String(elapsed % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Log list */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-terminal-bg to-transparent" />
        <ul
          ref={logContainerRef}
          className="without-h-scrollbar h-[280px] overflow-y-auto px-4 py-3"
        >
          <AnimatePresence initial={false}>
            {logs.map((log, i) => {
              const age = logs.length - 1 - i
              const opacity =
                age === 0 ? 1 : age === 1 ? 0.82 : age <= 4 ? 0.48 : 0.2
              return (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="flex items-baseline gap-3 py-[2.5px] font-mono text-[11px] leading-[1.6] text-terminal-fg"
                >
                  <span className="shrink-0 tabular-nums text-terminal-muted">
                    {log.time}
                  </span>
                  <span className="truncate">{log.text}</span>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </div>

      {/* Panel footer */}
      <div className="flex items-center justify-between border-t border-terminal-border/40 px-4 py-1.5">
        <span className="font-mono text-[9.5px] text-terminal-muted opacity-60">
          ROI analysis pipeline · encrypted
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={
              'h-1 w-1 rounded-full ' +
              (isFinalising
                ? 'bg-gray-500 opacity-40'
                : 'bg-primary opacity-60')
            }
          />
          <span className="font-mono text-[9.5px] text-terminal-muted opacity-60">
            {isFinalising ? 'done' : 'live'}
          </span>
        </div>
      </div>
    </div>
  )
}
