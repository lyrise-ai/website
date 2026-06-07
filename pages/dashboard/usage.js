import { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { createRouteClient } from '../../src/lib/supabaseRouteClient'
import { createAdminClient } from '../../src/lib/supabase-server'

// ── Server-side employee gate ─────────────────────────────────────────────────
// Non-employees never receive the page (redirected to login). Mirrors the auth
// pattern in pages/auth/login.js + the employee check in pages/api/reports/[id].
export async function getServerSideProps({ req, res }) {
  const supabase = createRouteClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const admin = createAdminClient()
  const { data: userData } = await admin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const isEmployee =
    userData?.role === 'EMPLOYEE' || user.email?.endsWith('@lyrise.ai')
  if (!isEmployee) {
    return { redirect: { destination: '/', permanent: false } }
  }

  return { props: {} }
}

// ── Formatting helpers ────────────────────────────────────────────────────────
const usd = (n) => `$${Number(n || 0).toFixed(n >= 1 ? 2 : 4)}`
const secs = (ms) => `${(Number(ms || 0) / 1000).toFixed(1)}s`
const num = (n) => Number(n || 0).toLocaleString()

// Human-friendly duration: "—" / "45s" / "3m 20s".
const dur = (ms) => {
  const total = Math.round(Number(ms || 0) / 1000)
  if (!total) return '—'
  if (total < 60) return `${total}s`
  const m = Math.floor(total / 60)
  const s = total % 60
  return s ? `${m}m ${s}s` : `${m}m`
}

export default function UsageDashboard() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [engagement, setEngagement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all([
      fetch(`/api/usage/summary?days=${days}`, {
        credentials: 'include',
      }).then((r) => r.json()),
      fetch(`/api/usage/engagement?days=${days}`, {
        credentials: 'include',
      })
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([summary, eng]) => {
        if (cancelled) return
        if (summary.error && !summary.totals) {
          setError(summary.error)
        } else {
          setData(summary)
        }
        setEngagement(eng)
      })
      .catch(() => !cancelled && setError('Failed to load usage data'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [days])

  return (
    <>
      <Head>
        <title>Usage Monitoring | LyRise</title>
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f6f7fb',
          p: { xs: 2, md: 4 },
          fontFamily: 'inherit',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a1a2e">
              Usage Monitoring
            </Typography>
            <Typography variant="body2" color="text.secondary">
              LLM cost &amp; time per report
            </Typography>
          </Box>
          <Select
            size="small"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            sx={{ bgcolor: '#fff', minWidth: 140 }}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
            <MenuItem value={365}>Last year</MenuItem>
          </Select>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Card sx={{ p: 3, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
            <Typography fontWeight={600} color="#9a3412">
              Could not load usage data
            </Typography>
            <Typography variant="body2" color="#9a3412" sx={{ mt: 1 }}>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              If the <code>roi_usage</code> table doesn&apos;t exist yet, apply
              the migration <code>20260603_000005_roi_usage.sql</code> and
              reload.
            </Typography>
          </Card>
        )}

        {!loading && !error && data && data.ready === false && (
          <Card sx={{ p: 3, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <Typography fontWeight={600} color="#1e40af">
              Waiting for the database
            </Typography>
            <Typography variant="body2" color="#1e40af" sx={{ mt: 1 }}>
              The <code>roi_usage</code> table isn&apos;t available yet. Once
              the migration is applied, generated reports will start appearing
              here.
            </Typography>
          </Card>
        )}

        {!loading && !error && data && data.ready !== false && (
          <Dashboard data={data} />
        )}

        {!loading && !error && engagement && engagement.ready !== false && (
          <EngagementPanel data={engagement} />
        )}
      </Box>
    </>
  )
}

function Dashboard({ data }) {
  const { totals, perDay, perModel, perMode, recent } = data

  if (!totals.reports) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No reports recorded in this window yet.
        </Typography>
      </Card>
    )
  }

  return (
    <>
      {/* Summary cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          label="Total cost"
          value={usd(totals.costUsd)}
          accent="#2957FF"
        />
        <StatCard
          label="Reports"
          value={num(totals.reports)}
          accent="#7c3aed"
        />
        <StatCard
          label="Avg cost / report"
          value={usd(totals.avgCostUsd)}
          accent="#0891b2"
        />
        <StatCard
          label="Avg duration"
          value={secs(totals.avgDurationMs)}
          accent="#ea580c"
        />
      </Box>

      {/* Charts row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Cost over time
            </Typography>
            <BarChart
              items={perDay.map((d) => ({
                label: d.day.slice(5), // MM-DD
                value: d.costUsd,
                caption: `${usd(d.costUsd)} · ${d.count} rpt`,
              }))}
              color="#2957FF"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Cost by model
            </Typography>
            <BarChart
              items={perModel.map((m) => ({
                label: m.model,
                value: m.costUsd,
                caption: `${usd(m.costUsd)} · ${num(m.totalTokens)} tok`,
              }))}
              color="#7c3aed"
            />
          </CardContent>
        </Card>
      </Box>

      {/* Mode breakdown chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {perMode.map((m) => (
          <Chip
            key={m.mode}
            label={`${m.mode}: ${usd(m.costUsd)} (${m.count})`}
            sx={{ bgcolor: '#fff', border: '1px solid #e5e7eb' }}
          />
        ))}
      </Box>

      {/* Recent reports table */}
      <Card>
        <CardContent>
          <Typography fontWeight={600} mb={2}>
            Recent reports
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>When</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Tokens</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((r) => (
                <ReportRow key={r.id} row={r} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

// Recipient engagement: who opened "Edit with chat", time in panel, downloads.
function EngagementPanel({ data }) {
  const { totals, perReport } = data
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={700} color="#1a1a2e" mb={0.5}>
        Recipient engagement
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Activity from prospects who opened &quot;Edit with chat&quot; from the
        emails
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          label="Reports opened"
          value={num(totals.reportsOpened)}
          accent="#16a34a"
        />
        <StatCard
          label="Total opens"
          value={num(totals.opens)}
          accent="#0891b2"
        />
        <StatCard
          label="Avg time in chat"
          value={dur(totals.avgDurationMs)}
          accent="#7c3aed"
        />
        <StatCard
          label="PDF downloads"
          value={num(totals.downloads)}
          accent="#ea580c"
        />
      </Box>

      <Card>
        <CardContent>
          <Typography fontWeight={600} mb={2}>
            By report
          </Typography>
          {perReport.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No recipient activity in this window yet.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell align="right">Opens</TableCell>
                  <TableCell align="right">Avg time</TableCell>
                  <TableCell align="right">Chat msgs</TableCell>
                  <TableCell align="right">Downloads</TableCell>
                  <TableCell align="right">Last activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {perReport.map((r) => (
                  <TableRow key={r.reportId} hover>
                    <TableCell>{r.company}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell align="right">{num(r.opens)}</TableCell>
                    <TableCell align="right">{dur(r.avgDurationMs)}</TableCell>
                    <TableCell align="right">{num(r.chatMessages)}</TableCell>
                    <TableCell align="right">{num(r.downloads)}</TableCell>
                    <TableCell align="right">
                      {r.lastActivity
                        ? new Date(r.lastActivity).toLocaleString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <Card sx={{ borderTop: `3px solid ${accent}` }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Lightweight horizontal bar chart — no chart dependency, just MUI Box.
function BarChart({ items, color }) {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data
      </Typography>
    )
  }
  const max = Math.max(...items.map((i) => i.value), 0.000001)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map((i, idx) => (
        <Box key={`${i.label}-${idx}`}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.25,
            }}
          >
            <Typography variant="caption" color="text.secondary" noWrap>
              {i.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {i.caption}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#eef0f5',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${Math.max((i.value / max) * 100, 2)}%`,
                bgcolor: color,
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function ReportRow({ row }) {
  const [open, setOpen] = useState(false)
  const calls = row.calls || []
  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 40 }}>
          {calls.length > 0 && (
            <IconButton size="small" onClick={() => setOpen((o) => !o)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
        <TableCell>{row.company || '—'}</TableCell>
        <TableCell>{row.mode}</TableCell>
        <TableCell align="right">{usd(row.cost_usd)}</TableCell>
        <TableCell align="right">{secs(row.duration_ms)}</TableCell>
        <TableCell align="right">{num(row.total_tokens)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0, border: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ my: 1, ml: 5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Step</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell align="right">Input</TableCell>
                    <TableCell align="right">Output</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calls.map((c, i) => (
                    <TableRow key={`${c.call}-${i}`}>
                      <TableCell>{c.call}</TableCell>
                      <TableCell>{c.model}</TableCell>
                      <TableCell align="right">{num(c.inputTokens)}</TableCell>
                      <TableCell align="right">{num(c.outputTokens)}</TableCell>
                      <TableCell align="right">{num(c.totalTokens)}</TableCell>
                      <TableCell align="right">{usd(c.costUsd)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
