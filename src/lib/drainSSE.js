// ─────────────────────────────────────────────────────────────────────────────
// drainSSE — recursive ReadableStream consumer for Server-Sent Events
// Shared by roi-report.jsx and ReportViewer.jsx
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Drains an SSE ReadableStream, parsing each `data: {...}` line as JSON
 * and calling onEvent for each valid event object.
 *
 * @param {ReadableStreamDefaultReader} reader
 * @param {TextDecoder} decoder
 * @param {(event: object) => void} onEvent
 * @param {string} [buffer]
 */
export async function drainSSE(reader, decoder, onEvent, buffer = '') {
  const { done, value } = await reader.read()
  if (done) return
  const chunk = buffer + decoder.decode(value, { stream: true })
  const lines = chunk.split('\n')
  const remaining = lines.pop()
  lines
    .filter((l) => l.startsWith('data: '))
    .reduce((acc, line) => {
      try {
        acc.push(JSON.parse(line.slice(6)))
      } catch {
        /* skip malformed */
      }
      return acc
    }, [])
    .forEach((event) => onEvent(event))
  await drainSSE(reader, decoder, onEvent, remaining)
}
