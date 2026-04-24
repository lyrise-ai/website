import Head from 'next/head'
import { createClient, createAdminClient } from '../../src/lib/supabase-server'
import ReportViewer from '../../src/components/ROIGenerator/ReportViewer'

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
      .select(
        'id, company_name, email, status, state_data, rendered_html, rendered_full_html, user_id',
      )
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

  const initialState = {
    ...(report.state_data ?? {}),
    renderedHtml: report.rendered_html,
    renderedFullHtml: report.rendered_full_html,
  }

  let initialMessagesUsed = 0
  if (!isEmployee) {
    const { data: usage } = await admin
      .from('chat_usage')
      .select('message_count')
      .eq('user_id', user.id)
      .eq('report_id', report.id)
      .single()
    initialMessagesUsed = usage?.message_count ?? 0
  }

  return {
    props: {
      initialState,
      email: report.email,
      reportId: report.id,
      isEmployee,
      initialMessagesUsed,
    },
  }
}

export default function ReportPage({
  initialState,
  email,
  reportId,
  isEmployee,
  initialMessagesUsed,
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
        backHref="/dashboard"
      />
    </>
  )
}
