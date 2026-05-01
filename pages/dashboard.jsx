import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { FaTrash } from 'react-icons/fa'
import { createRouteClient } from '../src/lib/supabaseRouteClient'
import { getRoleForUser } from '../src/lib/authHelpers'
import MainHeader from '../src/layout/MainHeader'

const STATUS_STYLES = {
  SUCCESS: { bg: 'bg-green-50', text: 'text-green-700', label: 'Done' },
  RUNNING: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Running' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-600', label: 'Failed' },
  PENDING: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Pending' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function getServerSideProps({ req, res }) {
  const supabase = createRouteClient(req, res)
  const { data, error } = await supabase.auth.getUser()
  if (!data.user) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    }
  }
  const { role, error: roleError } = await getRoleForUser(data.user.id)
  if (roleError || !role) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }
  if (role !== 'EMPLOYEE') {
    return {
      redirect: { destination: '/roi-report', permanent: false },
    }
  }
  return {
    props: { user: data.user, reports: [] },
  }
}

export default function Dashboard({ user, reports: initialReports }) {
  const router = useRouter()
  const [reports, setReports] = useState(initialReports)
  const [confirmingId, setConfirmingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/auth/login')
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id))
      }
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  return (
    <div className="rebranding-landing-page min-h-screen -mt-[12px]">
      <MainHeader user={user} />
      <Head>
        <title>All Reports | LyRise</title>
      </Head>

      <div className="max-w-4xl px-4 py-12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-2xl font-bold text-[#2C2C2C]">
              All Reports
            </h1>
            <p className="font-outfit text-sm text-gray-500 mt-0.5">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/roi-report"
              className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black transition-colors rounded-full px-5 py-2.5"
            >
              + New Report
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="font-outfit text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-full px-4 py-2.5"
            >
              Sign out
            </button>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
            <p className="mb-4 text-sm text-gray-400 font-outfit">
              No reports yet.
            </p>
            <Link
              href="/roi-report"
              className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black transition-colors rounded-full px-6 py-3"
            >
              Generate your first report
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Company
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Email
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Status
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Date
                  </th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/report/${r.id}`)}
                    className={`${
                      i < reports.length - 1 ? 'border-b border-gray-50' : ''
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="font-outfit font-medium text-[#2C2C2C] px-6 py-4">
                      {r.company_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-outfit">
                      {r.email || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-outfit">
                      {formatDate(r.created_at)}
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-outfit text-xs font-semibold text-[#2957FF]">
                          View →
                        </span>
                        {confirmingId === r.id ? (
                          <span className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDelete(r.id)}
                              disabled={deletingId === r.id}
                              className="text-xs font-semibold text-red-600 transition-colors font-outfit hover:text-red-800 disabled:opacity-50"
                            >
                              {deletingId === r.id ? 'Deleting…' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              className="text-xs text-gray-400 transition-colors font-outfit hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingId(r.id)}
                            className="text-gray-300 transition-colors hover:text-red-500"
                            title="Delete report"
                          >
                            <FaTrash size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
