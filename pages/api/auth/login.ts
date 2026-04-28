import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../../src/lib/supabaseServer'
import { supabaseAdmin } from '../../../src/lib/supabaseAdmin'

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const { email, password } = req.body

  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const { data: roleRow, error: roleError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (roleError) {
    return res.status(500).json({ error: 'failed to fetch role' })
  }

  return res.status(200).json({
    session: data.session,
    role: roleRow.role,
  })
}
