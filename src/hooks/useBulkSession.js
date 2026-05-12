import { useCallback, useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { drainSSE } from '../lib/drainSSE'

export const STAGGER_MS = 60_000

const STORAGE_PREFIX = 'lyrise_bulk_'

function storageKey(sessionId) {
  return `${STORAGE_PREFIX}${sessionId}`
}

function readSession(sessionId) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey(sessionId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey(session.id), JSON.stringify(session))
  } catch {
    /* localStorage full or disabled */
  }
}

function buildInitialSession(payloads) {
  const now = Date.now()
  return {
    id: nanoid(),
    createdAt: now,
    cursor: 0,
    rows: payloads.map((payload, i) => ({
      payload,
      status: 'PENDING',
      scheduledAt: now + i * STAGGER_MS,
      reportId: null,
      error: null,
    })),
  }
}

/**
 * Hook that owns the bulk-generation lifecycle for a single bulk session.
 *
 * - `start(payloads)` seeds a fresh session in localStorage and schedules
 *   one staggered kickoff per row (row i begins at `now + i * STAGGER_MS`).
 * - Once mounted with a `sessionId`, the hook rehydrates from localStorage,
 *   fires immediately any rows whose `scheduledAt` is already in the past,
 *   and re-arms timers for the rest.
 * - Per-row generation calls `POST /api/roi-agent` and consumes the SSE
 *   stream via the existing `drainSSE` helper.
 */
export default function useBulkSession(sessionId) {
  const [session, setSession] = useState(() =>
    sessionId ? readSession(sessionId) : null,
  )
  const [activeLogs, setActiveLogs] = useState({})
  const timersRef = useRef(new Map())
  const inFlightRef = useRef(new Set())
  const sessionRef = useRef(session)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const persist = useCallback((updater) => {
    setSession((prev) => {
      const next = updater(prev)
      if (next) writeSession(next)
      sessionRef.current = next
      return next
    })
  }, [])

  const updateRow = useCallback(
    (index, patch) => {
      persist((prev) => {
        if (!prev) return prev
        const rows = prev.rows.map((r, i) =>
          i === index ? { ...r, ...patch } : r,
        )
        return { ...prev, rows }
      })
    },
    [persist],
  )

  const appendLog = useCallback((index, chunk) => {
    setActiveLogs((prev) => {
      const existing = prev[index] ?? ''
      return { ...prev, [index]: (existing + chunk).slice(-2000) }
    })
  }, [])

  const generateRow = useCallback(
    async (index) => {
      if (inFlightRef.current.has(index)) return
      const current = sessionRef.current
      if (!current) return
      const row = current.rows[index]
      if (!row || row.status === 'DONE' || row.status === 'GENERATING') return

      inFlightRef.current.add(index)
      updateRow(index, { status: 'GENERATING', error: null })

      try {
        const response = await fetch('/api/roi-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'generate',
            formData: row.payload,
          }),
        })

        if (response.status === 401) {
          window.location.href = '/login'
          return
        }

        if (!response.ok || !response.body) {
          let message = `HTTP ${response.status}`
          try {
            const data = await response.json()
            message = data?.error ?? message
            if (response.status === 409 && data?.report_id) {
              updateRow(index, {
                status: 'DONE',
                reportId: data.report_id,
                error: null,
              })
              return
            }
          } catch {
            /* non-JSON body */
          }
          updateRow(index, { status: 'FAILED', error: message })
          return
        }

        let savedReportId = null
        let sawDone = false
        await drainSSE(
          response.body.getReader(),
          new TextDecoder(),
          (event) => {
            if (event.type === 'text_delta') {
              appendLog(index, event.delta ?? '')
            } else if (event.type === 'tool_start') {
              appendLog(index, `\n[${event.tool}]`)
            } else if (event.type === 'report_saved') {
              savedReportId = event.report_id
              updateRow(index, { reportId: event.report_id })
            } else if (event.type === 'done') {
              sawDone = true
            } else if (event.type === 'error') {
              throw new Error(event.message ?? 'Generation failed')
            }
          },
        )

        if (sawDone && savedReportId) {
          updateRow(index, { status: 'DONE', error: null })
        } else {
          updateRow(index, {
            status: 'FAILED',
            error: 'Generation finished without saving a report.',
          })
        }
      } catch (err) {
        updateRow(index, {
          status: 'FAILED',
          error: err?.message ?? 'Unknown error',
        })
      } finally {
        inFlightRef.current.delete(index)
      }
    },
    [updateRow, appendLog],
  )

  // Rehydrate: schedule any pending rows.
  useEffect(() => {
    if (!session) return undefined
    const timers = timersRef.current

    session.rows.forEach((row, index) => {
      if (row.status !== 'PENDING') return
      if (timers.has(index)) return

      const delay = Math.max(0, (row.scheduledAt ?? Date.now()) - Date.now())
      const handle = setTimeout(() => {
        timers.delete(index)
        generateRow(index)
      }, delay)
      timers.set(index, handle)
    })

    return () => {
      timers.forEach((handle) => clearTimeout(handle))
      timers.clear()
    }
    // generateRow is stable across re-renders thanks to its own deps.
    // We intentionally only re-run when sessionId changes (i.e. on mount
    // and on session swap), not on every row-status update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id])

  const start = useCallback((payloads) => {
    const fresh = buildInitialSession(payloads)
    writeSession(fresh)
    setSession(fresh)
    sessionRef.current = fresh
    return fresh.id
  }, [])

  const setCursor = useCallback(
    (index) => {
      persist((prev) => (prev ? { ...prev, cursor: index } : prev))
    },
    [persist],
  )

  const retryRow = useCallback(
    (index) => {
      updateRow(index, { status: 'PENDING', error: null })
      generateRow(index)
    },
    [updateRow, generateRow],
  )

  return {
    session,
    start,
    setCursor,
    retryRow,
    activeLogs,
  }
}
