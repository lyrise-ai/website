import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient as createServerClient } from '../../../src/lib/supabase-server'
import MainHeader from '../../../src/layout/MainHeader'
import GeneratingView from '../../../src/components/ROIGenerator/GeneratingView'
import useBulkSession from '../../../src/hooks/useBulkSession'

export async function getServerSideProps({ req, res }) {
  const supabase = createServerClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const isEmployee = user.email?.endsWith('@lyrise.ai') === true
  if (!isEmployee) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }

  return { props: {} }
}

function StatusStrip({ rows, cursor }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-outfit">
      {rows.map((row, i) => {
        const isCurrent = i === cursor
        const colour =
          row.status === 'DONE'
            ? 'bg-green-100 text-green-700'
            : row.status === 'GENERATING'
            ? 'bg-blue-100 text-blue-700'
            : row.status === 'FAILED'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-500'
        return (
          <span
            key={i}
            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${colour} ${
              isCurrent ? 'ring-2 ring-offset-1 ring-[#2C2C2C]' : ''
            }`}
            title={
              row.payload?.companyName
                ? `${row.payload.companyName} — ${row.status}`
                : row.status
            }
          >
            {i + 1}
          </span>
        )
      })}
    </div>
  )
}

export default function BulkReviewPage() {
  const router = useRouter()
  const { sessionId, pos } = router.query
  const cursor = Math.max(0, Number(pos ?? 0) || 0)

  const { session, setCursor, retryRow, activeLogs } = useBulkSession(
    typeof sessionId === 'string' ? sessionId : null,
  )

  const row = session?.rows?.[cursor]

  // Keep the persisted cursor in sync with the URL.
  useEffect(() => {
    if (!session) return
    if (session.cursor !== cursor) setCursor(cursor)
  }, [cursor, session, setCursor])

  // Once the active row is DONE, redirect into the standard report viewer.
  useEffect(() => {
    if (!router.isReady) return
    if (!row || !row.reportId) return
    if (row.status !== 'DONE') return
    router.replace(`/report/${row.reportId}?batch=${session.id}&pos=${cursor}`)
  }, [router, row, session, cursor])

  if (!router.isReady) {
    return (
      <div className="rebranding-landing-page min-h-screen -mt-[12px]">
        <MainHeader />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rebranding-landing-page min-h-screen -mt-[12px]">
        <MainHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-outfit text-xl font-bold text-[#2C2C2C] mb-2">
            Bulk session not found
          </h1>
          <p className="font-outfit text-sm text-gray-500 mb-6">
            This bulk session has been cleared or wasn&apos;t started from this
            browser.
          </p>
          <Link
            href="/roi-report/bulk"
            className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black transition-colors rounded-full px-5 py-2.5"
          >
            Start a new bulk upload
          </Link>
        </div>
      </div>
    )
  }

  if (!row) {
    return (
      <div className="rebranding-landing-page min-h-screen -mt-[12px]">
        <MainHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-outfit text-xl font-bold text-[#2C2C2C] mb-2">
            All reports reviewed
          </h1>
          <Link
            href="/dashboard"
            className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black transition-colors rounded-full px-5 py-2.5"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const total = session.rows.length
  const isGenerating = row.status === 'PENDING' || row.status === 'GENERATING'
  const isFailed = row.status === 'FAILED'

  return (
    <div className="rebranding-landing-page min-h-screen -mt-[12px]">
      <Head>
        <title>Bulk Review · {row.payload?.companyName ?? '…'} | LyRise</title>
      </Head>
      <MainHeader />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/dashboard"
              className="font-outfit text-xs text-gray-500 hover:text-gray-800"
            >
              ← Back to dashboard
            </Link>
            <h1 className="font-outfit text-lg font-bold text-[#2C2C2C] mt-2">
              Bulk Review · Report {cursor + 1} of {total}
            </h1>
            <p className="font-outfit text-sm text-gray-500 mt-0.5">
              {row.payload?.companyName ?? 'Unknown company'}
              {row.payload?.recipientName
                ? ` · ${row.payload.recipientName}`
                : ''}
            </p>
          </div>
          <StatusStrip rows={session.rows} cursor={cursor} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {isGenerating && (
            <GeneratingView generationLog={activeLogs[cursor]} />
          )}

          {isFailed && (
            <div className="p-10 text-center">
              <h2 className="font-outfit text-lg font-bold text-red-600 mb-2">
                Generation failed
              </h2>
              <p className="font-outfit text-sm text-gray-600 mb-6 max-w-md mx-auto">
                {row.error || 'Unknown error during generation.'}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => retryRow(cursor)}
                  className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black transition-colors rounded-full px-5 py-2.5"
                >
                  Retry
                </button>
                {cursor + 1 < total && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/roi-report/bulk/${session.id}?pos=${cursor + 1}`,
                      )
                    }
                    className="font-outfit text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full px-5 py-2.5"
                  >
                    Skip to next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
