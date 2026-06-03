/* eslint-disable no-console */
// ─────────────────────────────────────────────────────────────────────────────
// usageStore — persists a UsageSummary to Supabase (roi_usage table).
//
// Kept separate from UsageTracker so the tracker stays pure (usable in evals /
// local scripts with no DB). On Vercel the local NDJSON file written by
// flush() is ephemeral, so this is the durable sink that feeds the dashboard.
//
// Fire-and-forget: never throws into the request path. A monitoring write must
// never break report generation.
// ─────────────────────────────────────────────────────────────────────────────

import { supabaseAdmin } from '@/src/lib/supabaseAdmin'

import type { UsageSummary } from './usageTracker'

export async function persistUsage(summary: UsageSummary): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('roi_usage').insert({
      ts: summary.ts,
      company: summary.company,
      mode: summary.mode,
      duration_ms: summary.durationMs,
      input_tokens: summary.totals.inputTokens,
      output_tokens: summary.totals.outputTokens,
      total_tokens: summary.totals.totalTokens,
      cost_usd: summary.totals.costUsd,
      calls: summary.calls,
    })
    if (error) {
      console.warn('[roi-usage] Supabase insert failed:', error.message)
    }
  } catch (err) {
    console.warn('[roi-usage] persistUsage threw:', err)
  }
}
