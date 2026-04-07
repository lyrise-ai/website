# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
npm run prettier   # Format with Prettier
```

No test suite is configured — linting is the only automated code quality check.

A **Husky pre-commit hook** runs `lint-staged` on every commit: ESLint auto-fix on `.js`/`.jsx` and Prettier on `.js`, `.jsx`, `.json`, `.css`, `.md`.

Node.js >= 24.0.0 is required.

## Architecture

This is a **Next.js 13 marketing + SaaS platform** for LyRise (AI-powered tech talent hiring). It uses the **Pages Router** exclusively.

### Key directories

- `pages/` — All routes. Marketing pages, role-specific hiring pages (`*Engineers.js`), and `pages/api/` for API routes.
- `src/components/` — Component library organized by feature area (ROIGenerator, MainLandingPage, NewLanding, Booking, Form, shared, etc.)
- `src/lib/roi/` — The core AI pipeline (described below)
- `src/hooks/` — Custom React hooks
- `src/services/` — API client functions
- `src/config/` — Firebase and EmailJS setup
- `src/context/` — React Context providers

### Import aliases (from next.config.js)

- `@components` → `src/components`
- `@hooks` → `src/hooks`
- `@assets` → `src/assets`
- `@services` → `src/services`
- `@` → project root

### ROI Pipeline (`src/lib/roi/`)

The most complex part of the codebase. When a user submits the ROI form, `pages/api/roi-report.js` runs a multi-stage AI pipeline that streams progress via **Server-Sent Events (SSE)**:

1. **research** — `agents/researchAgent.ts` does tool-calling (Tavily search + Puppeteer fetch); `pipeline/researchAgent.ts` is the orchestrator
2. **modeler** — `pipeline/roiModeler.ts` — structured JSON output via `fastModel` (gpt-4o-mini)
3. **calculator** — `pipeline/roiCalculator.ts` — pure TypeScript, no LLM
4. **writer** — `pipeline/reportWriter.ts` — prose generation via `researchModel` (gpt-4o)
5. **assemble** — `pipeline/assembleReport.ts` — pure TypeScript, builds all `{{$json.display.*}}` template vars
6. **render** — `services/pdf.ts` + `services/email.ts` — Puppeteer PDF (`@sparticuz/chromium`) + Resend email

The pipeline uses `@ai-sdk/openai` (Vercel AI SDK `ai@6.x`) with structured outputs (Zod schemas in `src/lib/roi/prompts/`). Model config lives in `src/lib/roi/llm.ts` — `researchModel` (gpt-4o) for research/writing, `fastModel` (gpt-4o-mini) for structured JSON. The file has instructions for switching to Claude. The client-side SSE consumer is in `src/components/ROIGenerator/ExecutionSimulation.jsx`.

**Data flow**: The API route's `mapFormToPayload()` maps camelCase form fields → title-case keys expected by `normalizeInput()`. The HTML report template uses n8n-style `{{$json.display.key}}` placeholders replaced by `renderTemplate()`.

**TypeScript boundary**: `src/lib/roi/` is TypeScript (`.ts`); everything else in the repo is JavaScript (`.js`/`.jsx`). The `@/` alias resolves to the project root in TS files.

### API Routes

- `POST /api/roi-report` — ROI pipeline, streams SSE, 5-min serverless timeout
- `POST /api/feedback` — Proxies feedback to N8N webhook
- `POST /api/auth/[...nextauth]` — NextAuth (Google + LinkedIn OAuth)

### Styling

Hybrid approach: **Tailwind CSS** + **MUI Material** + **Emotion CSS-in-JS**. Use Tailwind for layout/spacing, MUI for complex components, Emotion/`sx` prop when inside MUI component trees. Custom design tokens are in `tailwind.config.js` (primary blue: `#2957FF`).

### Environment variables

Server-only keys: `OPENAI_API_KEY`, `TAVILY_API_KEY`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`, `LINKEDIN_CLIENT_ID/SECRET`, `NEXTAUTH_SECRET`, `N8N_WEBHOOK_URL`.

Browser-exposed (`NEXT_PUBLIC_`): GTM, Amplitude, EmailJS credentials, backend API URL.

See `.env.example` for the full list.
