import Head from 'next/head'
import { createClient, createAdminClient } from '../../src/lib/supabase-server'
import ReportViewer from '../../src/components/ROIGenerator/ReportViewer'
import { buildStateFromReportRow } from '@/src/lib/roi/reportState'

export async function getServerSideProps({ req, res, params }) {
  const supabase = createClient(req, res)
  const admin = createAdminClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const [{ data: userData }, { data: report }] = await Promise.all([
    admin.from('users').select('role').eq('id', user.id).single(),
    admin
      .from('reports')
      .select('id, company_name, email, status, state_data, user_id')
      .eq('id', params.id)
      .single(),
  ])

  const isEmployee =
    userData?.role === 'EMPLOYEE' || user.email?.endsWith('@lyrise.ai')

  if (!report) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }

  if (!isEmployee && report.user_id !== user.id) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }

  if (!isEmployee && report.status !== 'SUCCESS') {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }

  const initialState = buildStateFromReportRow(report)

  // Load chat history and usage count in parallel
  let msgQuery = admin
    .from('chat_messages')
    .select('role, content')
    .eq('report_id', report.id)
    .order('created_at', { ascending: true })
    .limit(20)
  if (!isEmployee) msgQuery = msgQuery.eq('user_id', user.id)

  const [{ data: messages }, usageResult] = await Promise.all([
    msgQuery,
    isEmployee
      ? Promise.resolve({ data: null })
      : admin
          .from('chat_usage')
          .select('message_count')
          .eq('user_id', user.id)
          .eq('report_id', report.id)
          .single(),
  ])

  const initialMessagesUsed = usageResult.data?.message_count ?? 0
  const initialChatHistory = (messages ?? [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .filter((m) => m.content && m.content.trim() !== '')

  return {
    props: {
      initialState,
      email: report.email,
      reportId: report.id,
      isEmployee,
      initialMessagesUsed,
      initialChatHistory,
    },
  }
}

export default function ReportPage({
  initialState,
  email,
  reportId,
  isEmployee,
  initialMessagesUsed,
  initialChatHistory,
}) {
  return (
    <>
      <Head>
        <title>ROI Report | LyRise</title>
      </Head>
      <ReportViewer
        initialState={initialState}
        email={email}
        reportId={reportId}
        isEmployee={isEmployee}
        initialMessagesUsed={initialMessagesUsed}
        initialChatHistory={initialChatHistory}
        backHref="/dashboard"
      />
    </>
  )
}
