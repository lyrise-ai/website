import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient as createServerClient } from '../src/lib/supabase-server'
import { createClient as createBrowserClient } from '../src/lib/supabase-browser'
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
    .select('id, company_name, email, status, created_at, completed_at')
    .order('created_at', { ascending: false })

  if (!isEmployee) {
    query = query.eq('user_id', user.id)
  }

  const { data: reports } = await query

  return {
    props: {
      user: { email: user.email, name: user.user_metadata?.full_name ?? null },
      isEmployee,
      reports: reports ?? [],
    },
  }
}

export default function Dashboard({ user, reports, isEmployee }) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="rebranding-landing-page min-h-screen -mt-[12px]">
      <MainHeader />
      <Head>
        <title>{isEmployee ? 'All Reports' : 'My Reports'} | LyRise</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-2xl font-bold text-[#2C2C2C]">
              {isEmployee ? 'All Reports' : 'My Reports'}
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

        {/* Table */}
        {reports.length === 0 ? (
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
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`${
                      i < reports.length - 1 ? 'border-b border-gray-50' : ''
                    } hover:bg-gray-50 transition-colors`}
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
