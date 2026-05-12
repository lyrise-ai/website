import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import ReportViewer from '../ReportViewer'

const STORAGE_PREFIX = 'lyrise_bulk_'

function readSession(sessionId) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${sessionId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function ReportViewerWithBatch(props) {
  const router = useRouter()
  const sessionId =
    typeof router.query.batch === 'string' ? router.query.batch : null
  const cursorParam = Number(router.query.pos ?? NaN)
  const cursor = Number.isFinite(cursorParam) ? cursorParam : 0

  const [session, setSession] = useState(() =>
    sessionId ? readSession(sessionId) : null,
  )

  // Poll localStorage so we pick up status updates written by the bulk
  // session hook from other tabs / the review page tab.
  useEffect(() => {
    if (!sessionId) return undefined
    const tick = () => setSession(readSession(sessionId))
    tick()
    const id = window.setInterval(tick, 2000)
    const onStorage = (e) => {
      if (e.key === `${STORAGE_PREFIX}${sessionId}`) tick()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('storage', onStorage)
    }
  }, [sessionId])

  const onNext = useCallback(() => {
    if (!session) return
    router.push(`/roi-report/bulk/${session.id}?pos=${cursor + 1}`)
  }, [router, session, cursor])

  const onFinish = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  const batchContext = useMemo(() => {
    if (!sessionId || !session) return null
    const total = session.rows?.length ?? 0
    if (!total) return null
    const nextRow = session.rows[cursor + 1]
    const isNextReady = !!nextRow && nextRow.status === 'DONE'
    const isNextFailed = !!nextRow && nextRow.status === 'FAILED'
    return {
      currentIndex: cursor,
      total,
      isNextReady: isNextReady || isNextFailed,
      isNextFailed,
      onNext,
      onFinish,
    }
  }, [sessionId, session, cursor, onNext, onFinish])

  return <ReportViewer {...props} batchContext={batchContext} />
}
