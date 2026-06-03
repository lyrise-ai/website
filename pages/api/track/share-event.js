import { createAdminClient } from '../../../src/lib/supabase-server'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/track/share-event
//   body: { reportId, shareToken, type, durationMs? }
//
// Records behaviour events for SHARE-LINK RECIPIENTS (the email prospects who
// open "Edit with chat"). These visitors have no Supabase session, so auth is
// the share token itself: we only accept an event if (reportId, shareToken)
// matches a live, non-revoked share link. That prevents spoofing events onto
// arbitrary reports.
//
// Writes to the existing `events` table (same shape as report_viewed etc.),
// with user_id = NULL since the recipient is anonymous. durationMs (for chat
// session length) is stored in events.meta if that column exists; otherwise it
// is silently dropped so this never fails on a missing column.
// ─────────────────────────────────────────────────────────────────────────────

// Only these types may be written through this anonymous endpoint.
const ALLOWED_TYPES = new Set([
  'chat_link_opened', // recipient clicked "Edit with chat" and landed on the page
  'chat_session_end', // recipient left — carries durationMs (time in the panel)
  'pdf_downloaded_share', // recipient downloaded the PDF from the share view
])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { reportId, shareToken, type, durationMs } = req.body ?? {}

  if (!reportId || !shareToken || !type) {
    return res
      .status(400)
      .json({ error: 'reportId, shareToken and type are required' })
  }
  if (!ALLOWED_TYPES.has(type)) {
    return res.status(400).json({ error: 'unknown event type' })
  }

  const admin = createAdminClient()

  // Validate the share token against the report (the only "auth" here).
  const { data: report } = await admin
    .from('reports')
    .select('id, share_token, share_revoked_at')
    .eq('id', reportId)
    .single()

  const tokenValid =
    report &&
    report.share_token &&
    report.share_token === shareToken &&
    !report.share_revoked_at

  if (!tokenValid) {
    return res.status(403).json({ error: 'Invalid share link' })
  }

  // Build the row. Try to attach duration in a `meta` JSONB column; if the
  // column doesn't exist, retry without it so tracking never blocks on schema.
  const baseRow = { user_id: null, report_id: reportId, type }
  const meta =
    typeof durationMs === 'number' && durationMs >= 0 ? { durationMs } : null

  let insertError = null
  if (meta) {
    const { error } = await admin.from('events').insert({ ...baseRow, meta })
    insertError = error
  }
  if (!meta || insertError) {
    const { error } = await admin.from('events').insert(baseRow)
    insertError = error
  }

  if (insertError) {
    // Non-fatal: tracking must never surface as a user-facing error.
    console.error('[track/share-event] insert failed', insertError.message)
    return res.status(200).json({ ok: false })
  }

  return res.status(200).json({ ok: true })
}
