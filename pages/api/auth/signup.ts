import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../src/lib/supabaseAdmin'

export default async function signupHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    if (email.endsWith('@lyrise.ai')) {
      const { data: whitelistRow, error: whitelistError } = await supabaseAdmin
        .from('employee_whitelist')
        .select('email')
        .eq('email', email)
        .maybeSingle()

      if (whitelistError) {
        return res.status(500).json({ error: 'whitelist check failed' })
      }
      if (!whitelistRow) {
        return res.status(403).json({ error: 'email not authorized' })
      }

      const { data: signupResult, error: signupError } = await authSignup(
        email,
        password,
      )
      if (signupError) {
        return res.status(400).json({ error: signupError.message })
      }

      const insertError = await usersSignup(
        signupResult.user.id,
        signupResult.user.email,
        'EMPLOYEE',
      )
      if (insertError) {
        return res.status(400).json({ error: insertError.message })
      }
      return res.status(200).json({ userId: signupResult.user.id })
    }
    const { data, error } = await authSignup(email, password)
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    const insertError = await usersSignup(
      data.user.id,
      data.user.email,
      'CLIENT',
    )
    if (insertError) {
      return res.status(400).json({ error: insertError.message })
    }
    return res.status(200).json({ userId: data.user.id })
  }
  return res.status(405).json({ error: 'method not allowed' })
}
async function authSignup(email: string, password: string) {
  return supabaseAdmin.auth.signUp({
    email,
    password,
  })
}
async function usersSignup(
  id: string,
  email: string,
  role: 'EMPLOYEE' | 'CLIENT',
) {
  const { error } = await supabaseAdmin.from('users').insert({
    id,
    email,
    role,
  })
  return error
}
