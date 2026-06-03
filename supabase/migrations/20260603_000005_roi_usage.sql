-- Per-report LLM cost / time / token monitoring for the internal dashboard.
-- One row per generated report (or chat turn). Written via the service-role
-- key (supabaseAdmin, bypasses RLS); read only by employees.

create table if not exists public.roi_usage (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  company text,
  mode text,                       -- 'generate' | 'chat'
  duration_ms integer,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  cost_usd numeric(12, 6),
  calls jsonb,                     -- per-call breakdown: [{call, model, inputTokens, outputTokens, totalTokens, costUsd}]
  created_at timestamptz not null default now()
);

create index if not exists roi_usage_ts_idx
  on public.roi_usage (ts desc);

create index if not exists roi_usage_mode_ts_idx
  on public.roi_usage (mode, ts desc);

alter table public.roi_usage enable row level security;

drop policy if exists "roi_usage_select_employee" on public.roi_usage;
create policy "roi_usage_select_employee"
  on public.roi_usage
  for select
  using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid() and u.role = 'EMPLOYEE'
    )
  );
