import Head from 'next/head'
import { createClient as createServerClient } from '../../src/lib/supabase-server'
import MainHeader from '../../src/layout/MainHeader'
import BulkIntake from '../../src/components/ROIGenerator/BulkUpload/BulkIntake'

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

export default function BulkUploadPage() {
  return (
    <div className="rebranding-landing-page min-h-screen -mt-[12px]">
      <Head>
        <title>Bulk Upload | LyRise</title>
      </Head>
      <MainHeader />
      <BulkIntake />
    </div>
  )
}
