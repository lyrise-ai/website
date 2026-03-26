// ─────────────────────────────────────────────────────────────────────────────
// webSearch — searches the web for company intelligence
//
// Primary:  Tavily API (TAVILY_API_KEY env var) — best quality
// Fallback: Jina AI Search (s.jina.ai) — free, no API key required
//           Same provider already used by fetchPage (r.jina.ai)
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchResult {
  title: string
  url: string
  content: string
}

export interface SearchResponse {
  answer: string | null
  results: SearchResult[]
}

async function tavilySearch(query: string, maxResults: number): Promise<SearchResponse> {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      return { answer: null, results: [] }
    }

    const data = await res.json()
    return {
      answer: data.answer ?? null,
      results: (data.results ?? []).slice(0, maxResults).map((r: SearchResult) => ({
        title: r.title,
        url: r.url,
        content: r.content?.slice(0, 500) ?? '',
      })),
    }
  } catch {
    return { answer: null, results: [] }
  }
}

async function jinaSearch(query: string, maxResults: number): Promise<SearchResponse> {
  try {
    const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      return { answer: null, results: [] }
    }

    const data = await res.json()
    const items: Array<{ title?: string; url?: string; description?: string; content?: string }> =
      data.data ?? []

    return {
      answer: null,
      results: items.slice(0, maxResults).map(r => ({
        title: r.title ?? '',
        url: r.url ?? '',
        content: (r.description ?? r.content ?? '').slice(0, 500),
      })),
    }
  } catch {
    // Return a graceful no-results so the agent can still run on questionnaire data alone
    return {
      answer: null,
      results: [{
        title: 'Search unavailable',
        url: '',
        content: 'Web search is currently unavailable. Use questionnaire data and industry benchmarks.',
      }],
    }
  }
}

export async function webSearch(
  query: string,
  maxResults = 5
): Promise<SearchResponse> {
  if (process.env.TAVILY_API_KEY) {
    return tavilySearch(query, maxResults)
  }
  return jinaSearch(query, maxResults)
}
