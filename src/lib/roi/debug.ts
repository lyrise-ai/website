// ─────────────────────────────────────────────────────────────────────────────
// debug — terminal logging for the ROI pipeline.
// All logs are gated by ROI_DEBUG (default ON in dev, OFF in prod) so we never
// leak verbose internals to production logs. Each tag (`[ROI:research]`,
// `[ROI:modeler]`, etc.) is grep-able.
// ─────────────────────────────────────────────────────────────────────────────

const ENABLED =
  process.env.ROI_DEBUG === '1' ||
  process.env.ROI_DEBUG === 'true' ||
  (process.env.NODE_ENV !== 'production' && process.env.ROI_DEBUG !== '0')

type Tag =
  | 'agent'
  | 'research'
  | 'modeler'
  | 'tool:web_search'
  | 'tool:fetch_page'
  | 'tool:set_research'
  | 'calc:floor'
  | 'calc:revcap'
  | 'assemble'

function ts(): string {
  const d = new Date()
  return d.toISOString().slice(11, 23) // HH:MM:SS.mmm
}

function fmt(value: unknown): string {
  if (value == null) return String(value)
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function roiLog(tag: Tag, message: string, data?: unknown): void {
  if (!ENABLED) return
  const line = `[ROI:${tag}] ${ts()} ${message}`
  // eslint-disable-next-line no-console
  if (data === undefined) console.log(line)
  // eslint-disable-next-line no-console
  else console.log(line, fmt(data))
}

export function roiWarn(tag: Tag, message: string, data?: unknown): void {
  if (!ENABLED) return
  const line = `[ROI:${tag}] ${ts()} ⚠️  ${message}`
  // eslint-disable-next-line no-console
  if (data === undefined) console.warn(line)
  // eslint-disable-next-line no-console
  else console.warn(line, fmt(data))
}
