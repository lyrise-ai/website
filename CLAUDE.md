# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run prettier         # Format with Prettier
npm run eval:roi         # Run all ROI eval cases
npm run eval:roi:scaffold  # Scaffold eval cases from dropped PDFs
node evals/roi/run.mjs --case <case-id>  # Run a single ROI eval case
```

No test suite is configured — linting is the only automated code quality check. `next.config.js` sets `eslint.ignoreDuringBuilds = true`, so `npm run build` will NOT catch lint failures.

A **Husky pre-commit hook** runs `lint-staged` on every commit: ESLint auto-fix on `.js`/`.jsx` and Prettier on `.js`, `.jsx`, `.json`, `.css`, `.md`.

**Prettier config**: 2 spaces, no semicolons, single quotes, trailing commas, `endOfLine: 'lf'`.

Node.js >= 24.0.0 is required.

## Architecture

This is a **Next.js 13 marketing + SaaS platform** for LyRise (AI-powered tech talent hiring). It uses the **Pages Router** exclusively — no App Router.

### Key directories

- `pages/` — All routes. Marketing pages (`index.js`, `about.js`, etc.), role-specific hiring pages (`*Engineers.js`), and `pages/api/` for API routes.
- `pages/report/[id].jsx` — Persisted ROI report viewer/editor.
- `pages/roi-report.jsx` — ROI intake form and generation UI.
- `src/components/` — Component library organized by feature area (ROIGenerator, MainLandingPage, NewLanding, Booking, Form, shared, etc.)
- `src/lib/roi/` — The core ROI AI subsystem (TypeScript, described below)
- `src/lib/` — Supabase clients (`supabase-server.js`, `supabase-browser.js`), SSE drain (`drainSSE.js`)
- `src/hooks/` — Custom React hooks
- `src/services/` — API client functions
- `src/config/` — Firebase and EmailJS setup
- `src/context/` — React Context providers

### Import aliases (from `next.config.js`)

- `@components` → `src/components`
- `@hooks` → `src/hooks`
- `@assets` → `src/assets`
- `@services` → `src/services`
- `@` → project root

Note: `tsconfig.json` only defines `@/*` → project root. Webpack aliases (`@components`, etc.) are not available inside `src/lib/roi/` TypeScript files — use `@/src/...` there.

### ROI Pipeline (`src/lib/roi/`)

The most complex part of the codebase. ROI pages assume an **authenticated Supabase user**; unauthenticated requests redirect to `/login` or return `401`.

**The live endpoint is `POST /api/roi-agent`** (not the old `/api/roi-report`). It handles both `mode: 'generate'` (initial report) and `mode: 'chat'` (editing an existing report), persists to Supabase, and streams SSE updates.

The agent is a **unified `streamText` loop** in `src/lib/roi/agent.ts`. Tools mutate `ReportState` in-place:

- `webSearch` — Tavily → Brave → Jina fallback chain (`src/lib/roi/tools/webSearch.ts`)
- `fetchPage` — Puppeteer page fetch (`src/lib/roi/tools/fetchPage.ts`)
- `roiCalculator` — pure TS calculation (`src/lib/roi/pipeline/roiCalculator.ts`)
- `assembleReport` — builds all `{{$json.display.*}}` template vars (`src/lib/roi/pipeline/assembleReport.ts`)

Model config in `src/lib/roi/llm.ts`: `researchModel` (gpt-4o) and `fastModel` (gpt-4o-mini). The file contains commented instructions for switching to Claude.

**Data flow**: `mapFormToPayload()` in the API route maps camelCase form fields → title-case keys expected by `normalizeInput()` in `pipeline/normalize.ts` (supports both structured `processes[]` and legacy flat-field form payloads). The HTML report template uses n8n-style `{{$json.display.key}}` placeholders replaced by `renderTemplate()`.

SSE events consumed by `src/lib/drainSSE.js`; if you change stream payloads, update both generator and consumers.

**Dev options**: In development, `/api/roi-agent` supports `devOptions.skipLLM` and `devOptions.estimatesOnly`, and skips PDF/email side effects.

**Local PDF generation** (`src/lib/roi/services/pdf.ts`) requires a system Chrome/Chromium install unless `VERCEL` or `AWS_EXECUTION_ENV` is set.

**TypeScript boundary**: `src/lib/roi/` is TypeScript (`.ts`); everything else is JavaScript (`.js`/`.jsx`).

### Access control

Non-employees are limited to **1 generated report** and **5 ROI chat messages**. Employee access is `users.role === 'EMPLOYEE'` or an `@lyrise.ai` email (checked server-side via Supabase).

### API Routes

- `POST /api/roi-agent` — Unified ROI agent (generation + chat editing), streams SSE, 5-min serverless timeout
- `POST /api/roi-pdf` — Generate PDF for a persisted report
- `POST /api/roi-email` — Resend email for a persisted report
- `POST /api/feedback` — Proxies feedback to N8N webhook
- `POST /api/auth/[...nextauth]` — NextAuth (Google + LinkedIn OAuth)

### Styling

Hybrid approach: **Tailwind CSS** + **MUI Material** + **Emotion CSS-in-JS**. Use Tailwind for layout/spacing, MUI for complex components, Emotion/`sx` prop when inside MUI component trees. Custom design tokens are in `tailwind.config.js` (primary blue: `#2957FF`).

### Environment variables

The `.env.example` is incomplete for the ROI stack. Required keys not listed there:

- `OPENAI_API_KEY` — required for all LLM calls
- `RESEND_API_KEY` — required for email delivery
- `TAVILY_API_KEY` or `BRAVE_API_KEY` — at least one required for web search
- `SUPABASE_SERVICE_ROLE_KEY` — required for admin Supabase operations
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for auth/data

Other server-only keys: `GOOGLE_CLIENT_ID/SECRET`, `LINKEDIN_CLIENT_ID/SECRET`, `NEXTAUTH_SECRET`, `N8N_WEBHOOK_URL`, optional `EMAIL_FROM`.

Browser-exposed (`NEXT_PUBLIC_`): GTM, Amplitude, EmailJS credentials, backend API URL.

### Evals

`evals/roi/` contains a scoring harness for ROI report quality. Eval cases live in `evals/roi/cases/`. Commit only redacted or synthetic client material if adding new cases.
