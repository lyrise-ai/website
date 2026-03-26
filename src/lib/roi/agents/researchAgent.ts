// ─────────────────────────────────────────────────────────────────────────────
// researchAgent — Master Agent
// Uses GPT-4o with tool calling to research the company autonomously,
// then outputs a structured company profile + 4 workflow plans with
// research-derived volume estimates.
// ─────────────────────────────────────────────────────────────────────────────

import { generateText, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { researchModel } from '@/src/lib/roi/llm'
import { RESEARCH_AGENT_SYSTEM_PROMPT } from '@/src/lib/roi/prompts/researchAgent'
import { fetchPage } from '@/src/lib/roi/tools/fetchPage'
import { webSearch } from '@/src/lib/roi/tools/webSearch'
import type { NormalizedInput, ResearchAgentOutput } from '@/src/lib/roi/types'

export async function runResearchAgent(
  input: NormalizedInput
): Promise<ResearchAgentOutput> {
  const userMessage = JSON.stringify({
    companyName:         input.companyName,
    website:             input.website,
    businessDescription: input.businessDescription,
    industry:            input.industry,         // from questionnaire — use verbatim if set
    country:             input.country,          // from questionnaire — use verbatim if set
    keyPriorities:       input.keyPriorities,    // from questionnaire — use verbatim if set
    processes:           input.processes,        // user-stated processes (hints for workflow selection)
    teamSize:            input.teamSize,
    revenueRange:        input.revenueRange,
  })

  const result = await generateText({
    model: researchModel,
    system: RESEARCH_AGENT_SYSTEM_PROMPT,
    prompt: userMessage,
    stopWhen: stepCountIs(8),
    tools: {
      fetchPage: tool({
        description: 'Fetch the content of a webpage and return it as clean markdown text. Use this to read company websites, about pages, and product pages.',
        inputSchema: z.object({
          url: z.string().describe('The full URL to fetch, e.g. https://example.com/about'),
        }),
        execute: async ({ url }) => {
          const content = await fetchPage(url)
          return { content }
        },
      }),

      webSearch: tool({
        description: 'Search the web for information about a company. Returns a summary answer and relevant result snippets.',
        inputSchema: z.object({
          query: z.string().describe('The search query, e.g. "Armada Foods Turkey employees revenue 2024"'),
          maxResults: z.number().optional().describe('Number of results to return, default 5'),
        }),
        execute: ({ query, maxResults }) => webSearch(query, maxResults ?? 5),
      }),
    },
  })

  // Extract the final text response (after all tool calls complete)
  const raw = result.text?.trim()
  if (!raw) {
    throw new Error('Research Agent returned empty response')
  }

  // Strip markdown code fences if the model wrapped in ```json, then find the first { to
  // discard any prose preamble the model may have prepended before the JSON object.
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const jsonStart = stripped.indexOf('{')
  const cleaned = jsonStart > 0 ? stripped.slice(jsonStart) : stripped

  let parsed: ResearchAgentOutput
  try {
    parsed = JSON.parse(cleaned)
  } catch (e) {
    throw new Error(`Research Agent: failed to parse JSON output — ${(e as Error).message}\n\nRaw: ${cleaned.slice(0, 500)}`)
  }

  // Basic validation
  if (!parsed.company_profile?.company) {
    throw new Error('Research Agent: missing company_profile.company in output')
  }
  if (!Array.isArray(parsed.workflows) || parsed.workflows.length < 2) {
    throw new Error(`Research Agent: returned too few workflows (${parsed.workflows?.length ?? 0}) — need at least 2`)
  }
  // Accept 2–4 workflows; trim silently if the model returned more than 4
  parsed.workflows = parsed.workflows.slice(0, 4)

  return parsed
}
