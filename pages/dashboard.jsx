import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaTrash } from 'react-icons/fa'
import {
  createClient as createServerClient,
  createAdminClient,
} from '../src/lib/supabase-server'
import { createClient as createBrowserClient } from '../src/lib/supabase-browser'
import MainHeader from '../src/layout/MainHeader'

const STATUS_STYLES = {
  SUCCESS: { bg: 'bg-green-50', text: 'text-green-700', label: 'Done' },
  RUNNING: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Running' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-600', label: 'Failed' },
  PENDING: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Pending' },
}

const EVENT_LABELS = {
  report_created: 'generated a report',
  report_viewed: 'viewed a report',
  chat_message_sent: 'sent a chat message',
  chat_limit_reached: 'reached the chat limit',
}

const EVENT_COLORS = {
  report_created: 'bg-green-400',
  report_viewed: 'bg-blue-400',
  chat_message_sent: 'bg-purple-400',
  chat_limit_reached: 'bg-orange-400',
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

function timeAgo(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
      <p className="font-outfit text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
        {label}
      </p>
      <p className="font-outfit text-3xl font-bold text-[#2C2C2C]">{value}</p>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  const supabase = createServerClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const isEmployee = user.email?.endsWith('@lyrise.ai')

  let query = supabase
    .from('reports')
    .select(
      'id, user_id, company_name, email, status, created_at, completed_at',
    )
    .order('created_at', { ascending: false })

  if (!isEmployee) {
    query = query.eq('user_id', user.id)
  }

  const { data: reports } = await query

  const oneWeekAgoIso = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString()
  const reportsThisWeek = (reports ?? []).filter(
    (r) => r.created_at >= oneWeekAgoIso,
  ).length

  if (!isEmployee) {
    return {
      props: {
        user: {
          email: user.email,
          name: user.user_metadata?.full_name ?? null,
        },
        isEmployee,
        reports: reports ?? [],
        reportsThisWeek,
        users: [],
        recentEvents: [],
      },
    }
  }

  const admin = createAdminClient()
  const [{ data: allUsers }, { data: allReports }, { data: rawEvents }] =
    await Promise.all([
      admin
        .from('users')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false }),
      admin.from('reports').select('id, user_id, created_at'),
      admin
        .from('events')
        .select('user_id, type, report_id, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

  const reportCountByUser = (allReports ?? []).reduce((acc, r) => {
    acc[r.user_id] = (acc[r.user_id] ?? 0) + 1
    return acc
  }, {})

  const lastActiveByUser = (rawEvents ?? []).reduce((acc, e) => {
    if (!acc[e.user_id]) acc[e.user_id] = e.created_at
    return acc
  }, {})

  const usersWithStats = (allUsers ?? []).map((u) => ({
    ...u,
    report_count: reportCountByUser[u.id] ?? 0,
    last_active: lastActiveByUser[u.id] ?? null,
  }))

  const userEmailById = (allUsers ?? []).reduce((acc, u) => {
    acc[u.id] = u.email
    return acc
  }, {})
  const recentEvents = (rawEvents ?? []).map((e) => ({
    ...e,
    user_email: userEmailById[e.user_id] ?? 'Unknown',
  }))

  return {
    props: {
      user: { email: user.email, name: user.user_metadata?.full_name ?? null },
      isEmployee,
      userId: user.id,
      reports: reports ?? [],
      reportsThisWeek,
      users: usersWithStats,
      recentEvents,
    },
  }
}

export default function Dashboard({
  user,
  reports: initialReports,
  isEmployee,
  userId,
  reportsThisWeek,
  users,
  recentEvents,
}) {
  const router = useRouter()
  const [reports, setReports] = useState(initialReports)
  const [confirmingId, setConfirmingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [navigatingId, setNavigatingId] = useState(null)
  const [activeTab, setActiveTab] = useState('Reports')

  useEffect(() => {
    if (isEmployee && router.query.tab === 'my-reports')
      setActiveTab('My Reports')
  }, [isEmployee, router.query.tab])

  const myReports = reports.filter((r) => r.user_id === userId)

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <MainHeader />
      <Head>
        <title>{isEmployee ? 'Admin Dashboard' : 'My Reports'} | LyRise</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-2xl font-bold text-[#2C2C2C]">
              {isEmployee ? 'Admin Dashboard' : 'My Reports'}
            </h1>
            <p className="font-outfit text-sm text-gray-500 mt-0.5">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isEmployee && (
              <Link
                href="/roi-report/bulk"
                className="font-outfit text-[#2C2C2C] hover:bg-gray-50 transition-colors border border-gray-300 rounded-full px-5 py-1.5 flex flex-col items-center leading-tight"
              >
                <span className="text-sm font-semibold">
                  Create multiple reports
                </span>
                <span className="text-[10px] font-medium text-gray-500">
                  Upload CSV file
                </span>
              </Link>
            )}
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

        {/* Employee: stats + tabs */}
        {isEmployee && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="Total Users" value={users.length} />
              <StatCard label="Total Reports" value={reports.length} />
              <StatCard label="Reports This Week" value={reportsThisWeek} />
            </div>

            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
              {['Reports', 'My Reports', 'Users', 'Activity'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`font-outfit text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-[#2C2C2C] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Reports tab */}
        {(!isEmployee ||
          activeTab === 'Reports' ||
          activeTab === 'My Reports') &&
          ((activeTab === 'My Reports' ? myReports : reports).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="font-outfit text-gray-400 text-sm mb-4">
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                  {(activeTab === 'My Reports' ? myReports : reports).map(
                    (r, i) => {
                      const clickable = isEmployee || r.status === 'SUCCESS'
                      return (
                        <tr
                          key={r.id}
                          onClick={() => {
                            if (!clickable || navigatingId) return
                            setNavigatingId(r.id)
                            router.push(`/report/${r.id}`)
                          }}
                          className={`${
                            i <
                            (activeTab === 'My Reports' ? myReports : reports)
                              .length -
                              1
                              ? 'border-b border-gray-50'
                              : ''
                          } hover:bg-gray-50 transition-colors ${
                            clickable && !navigatingId
                              ? 'cursor-pointer'
                              : 'cursor-default'
                          }`}
                        >
                          <td className="font-outfit font-medium text-[#2C2C2C] px-6 py-4">
                            {r.company_name || '—'}
                          </td>
                          <td className="font-outfit text-gray-500 px-6 py-4">
                            {r.email || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="font-outfit text-gray-400 px-6 py-4">
                            {formatDate(r.created_at)}
                          </td>
                          <td
                            className="px-6 py-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-3">
                              {clickable &&
                                (navigatingId === r.id ? (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: 14,
                                      height: 14,
                                      border: '2px solid #e2e8f0',
                                      borderTopColor: '#2957FF',
                                      borderRadius: '50%',
                                      animation: 'spin 0.75s linear infinite',
                                      flexShrink: 0,
                                    }}
                                  />
                                ) : (
                                  <span className="font-outfit text-xs font-semibold text-[#2957FF]">
                                    View →
                                  </span>
                                ))}
                              {isEmployee &&
                                (confirmingId === r.id ? (
                                  <span className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(r.id)}
                                      disabled={deletingId === r.id}
                                      className="font-outfit text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                    >
                                      {deletingId === r.id
                                        ? 'Deleting…'
                                        : 'Confirm'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmingId(null)}
                                      className="font-outfit text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmingId(r.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                    title="Delete report"
                                  >
                                    <FaTrash size={13} />
                                  </button>
                                ))}
                            </div>
                          </td>
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </table>
            </div>
          ))}

        {/* Users tab */}
        {isEmployee && activeTab === 'Users' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Email
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Role
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Reports
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Joined
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-6 py-3.5">
                    Recent Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="font-outfit text-gray-400 text-sm text-center px-6 py-12"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr
                      key={u.id}
                      className={
                        i < users.length - 1 ? 'border-b border-gray-50' : ''
                      }
                    >
                      <td className="font-outfit font-medium text-[#2C2C2C] px-6 py-4">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'EMPLOYEE'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {u.role ?? 'CLIENT'}
                        </span>
                      </td>
                      <td className="font-outfit text-gray-500 px-6 py-4">
                        {u.report_count}
                      </td>
                      <td className="font-outfit text-gray-400 px-6 py-4">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="font-outfit text-gray-400 px-6 py-4">
                        {timeAgo(u.last_active)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Activity tab */}
        {isEmployee && activeTab === 'Activity' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recentEvents.length === 0 ? (
              <p className="font-outfit text-gray-400 text-sm text-center px-6 py-12">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recentEvents.map((e) => (
                  <li
                    key={`${e.user_id}-${e.created_at}-${e.type}`}
                    className="flex items-center gap-4 px-6 py-3.5"
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        EVENT_COLORS[e.type] ?? 'bg-gray-300'
                      }`}
                    />
                    <span className="font-outfit text-sm text-[#2C2C2C] flex-1 min-w-0">
                      <span className="font-medium">{e.user_email}</span>{' '}
                      <span className="text-gray-500">
                        {EVENT_LABELS[e.type] ?? e.type}
                      </span>
                    </span>
                    <span className="font-outfit text-xs text-gray-400 flex-shrink-0">
                      {timeAgo(e.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
