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

export const RESEARCH_MODEL_NAME = 'gpt-5.1'
export const FAST_MODEL_NAME = 'gpt-5-mini'
export const RESEARCH_REASONING_EFFORT = 'high'
export const FAST_REASONING_EFFORT = 'high'

// Used for: Research Agent (tool use + synthesis) and Report Writer (prose)
export const researchModel = openai(RESEARCH_MODEL_NAME)

// Used for: ROI Modeler (structured JSON, no complex reasoning needed)
export const fastModel = openai(FAST_MODEL_NAME)
