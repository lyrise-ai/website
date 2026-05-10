# AGENTS.md

## Commands
- Use Node `>=24.0.0` and `npm` (`package-lock.json` is committed).
- Install deps with `npm install`.
- Dev server: `npm run dev`
- Production build: `npm run build`
- Start built app: `npm run start`
- Repo-defined verification: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Format everything: `npm run prettier`
- ROI eval harness: `npm run eval:roi`
- Scaffold eval cases from dropped PDFs: `npm run eval:roi:scaffold`
- Run one ROI eval case: `node evals/roi/run.mjs --case <case-id>`

## Verification
- There is no test suite and no typecheck script; `npm run lint` is the only repo-defined quality check.
- `next.config.js` sets `eslint.ignoreDuringBuilds = true`, so `npm run build` will not catch lint failures.
- Commits trigger Husky `pre-commit` -> `npx lint-staged`.
- `lint-staged` runs ESLint on `*.js`/`*.jsx` and Prettier on `*.js`, `*.jsx`, `*.json`, `*.css`, `*.md`.
- If you touch `evals/roi`, commit only redacted or synthetic client material.

## Architecture
- This is a single Next.js 13 app using the Pages Router, not the App Router.
- ROI pages and `/api/roi-*` routes assume an authenticated Supabase user; unauthenticated access redirects to `/login` or returns `401`.
- Live ROI pages are `pages/roi-report.jsx` (intake/generation) and `pages/report/[id].jsx` (persisted report viewer/editor).
- `src/lib/roi/` is the only TypeScript-heavy subsystem; most of the repo is plain `.js`/`.jsx`.
- `pages/api/roi-agent.js` is the real ROI backend for both `mode: 'generate'` and `mode: 'chat'`; it persists reports to Supabase and streams SSE updates.
- ROI report editing in `src/components/ROIGenerator/ReportViewer.jsx` uses `/api/roi-agent`, not the separate `/api/chat` endpoint.
- Chat, PDF, and resend-email flows load persisted report state by `reportId`; client-sent report state is not authoritative.
- Non-employees are limited to one generated report and 5 ROI chat messages. Employee access is `users.role === 'EMPLOYEE'` or an `@lyrise.ai` email.

## ROI Pipeline
- SSE events are consumed by `src/lib/drainSSE.js`; if you change stream payloads, update both generator and consumers.
- `src/lib/roi/pipeline/normalize.ts` supports two input shapes: structured `processes[]` and a legacy flat-field form payload.
- Local PDF generation in `src/lib/roi/services/pdf.ts` requires a system Chrome/Chromium install unless `VERCEL` or `AWS_EXECUTION_ENV` is set.
- Search fallback order in `src/lib/roi/tools/webSearch.ts`: Tavily -> Brave -> Jina (no-key fallback).
- In development, `/api/roi-agent` supports `devOptions.skipLLM` and `devOptions.estimatesOnly`; `/api/roi-agent` and `/api/roi-email` skip PDF/email side effects when `NODE_ENV === 'development'`.
- `CLAUDE.md` still mentions `/api/roi-report`; the live endpoint is `/api/roi-agent`.

## Imports And Style
- Webpack aliases from `next.config.js`: `@components`, `@hooks`, `@assets`, `@services`, and `@` for project root.
- TS path alias in `tsconfig.json` only defines `@/*` -> project root.
- Prettier is repo-enforced: 2 spaces, no semicolons, single quotes, trailing commas, `endOfLine: 'lf'`.

## Environment
- `.env.example` is incomplete for the ROI stack. ROI code also expects `OPENAI_API_KEY`, `RESEND_API_KEY`, optional `EMAIL_FROM`, and usually `TAVILY_API_KEY` or `BRAVE_API_KEY`.
