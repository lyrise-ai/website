import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[signup] SUPABASE_SERVICE_ROLE_KEY is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters' })
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const isEmployee = email.endsWith('@lyrise.ai')
  await supabaseAdmin.from('users').upsert({
    id: data.user.id,
    email: data.user.email,
    role: isEmployee ? 'EMPLOYEE' : 'CLIENT',
    prompt_count: 0,
  })

  return res
    .status(200)
    .json({ user: { id: data.user.id, email: data.user.email } })
}
