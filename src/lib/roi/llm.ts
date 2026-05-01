// ─────────────────────────────────────────────────────────────────────────────
// LLM provider configuration
//
// TO SWITCH TO CLAUDE:
//   1. npm install @ai-sdk/anthropic
//   2. Replace the two lines below with:
//        import { anthropic } from '@ai-sdk/anthropic'
//        export const researchModel  = anthropic('claude-sonnet-4-6')
//        export const fastModel      = anthropic('claude-haiku-4-5-20251001')
//   3. Remove @ai-sdk/openai from package.json
//   That's it. Nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Used for: Research Agent (tool use + synthesis) and Report Writer (prose)
// o4-mini: reasoning model — better multi-step research planning and copy synthesis than gpt-4o
export const researchModel = openai('o4-mini')

// Used for: ROI Modeler (structured JSON output)
// gpt-4o: more reliable structured output than gpt-4o-mini; fewer Rule 6B/6E retries
export const fastModel = openai('gpt-4o')
