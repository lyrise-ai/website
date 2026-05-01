import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouteClient } from '../../../src/lib/supabaseRouteClient'

export default async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const supabase = createRouteClient(req, res)
  const { error } = await supabase.auth.signOut()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ ok: true })
}
