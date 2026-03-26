// ─────────────────────────────────────────────────────────────────────────────
// fetchPage — fetches a URL and returns clean markdown via Jina Reader
// Free, no API key, works on any public URL
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchPage(url: string): Promise<string> {
  // Normalise — add https:// if bare domain
  const target = url.startsWith('http') ? url : `https://${url}`
  const jinaUrl = `https://r.jina.ai/${target}`

  try {
    const res = await fetch(jinaUrl, {
      headers: { Accept: 'text/plain' },
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      return `[fetchPage: HTTP ${res.status} for ${target}]`
    }

    const text = await res.text()
    // Cap at ~8K chars to avoid blowing the context window
    return text.slice(0, 8000)
  } catch (err) {
    return `[fetchPage: failed to fetch ${target} — ${(err as Error).message}]`
  }
}
