import { createClient } from '../../src/lib/supabase-server'

export default function AuthCallback() {
  return null
}

export async function getServerSideProps({ req, res, query }) {
  const { code } = query

  if (code) {
    const supabase = createClient(req, res)
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      const isEmployee = user.email?.endsWith('@lyrise.ai')
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        role: isEmployee ? 'EMPLOYEE' : 'CLIENT',
      })
    }
  }

  return { redirect: { destination: '/roi-report', permanent: false } }
}
