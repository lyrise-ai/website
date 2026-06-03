import { notifyDevTeam } from '@/src/lib/notifyError'
import { createClient } from '../../src/lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { error, stack, context, url } = req.body ?? {}
  if (!error || typeof error !== 'string') {
    return res.status(400).json({ error: 'Missing error' })
  }

  let userEmail
  try {
    const supabase = createClient(req, res)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userEmail = user?.email
  } catch {
    // non-authenticated users (e.g. share-link visitors) — that's fine
  }

  await notifyDevTeam({ error, stack, context, userEmail, url })

  res.status(200).json({ ok: true })
}
