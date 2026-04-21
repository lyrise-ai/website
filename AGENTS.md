# AGENTS.md

## Commands
- Use Node `>=24.0.0`.
- Install deps with `npm install`.
- Dev server: `npm run dev`
- Production build: `npm run build`
- Start built app: `npm run start`
- Repo-defined verification: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Format everything: `npm run prettier`

## Verification Gotchas
- There is no test suite and no typecheck script; `npm run lint` is the only repo-defined quality check.
- `next.config.js` sets `eslint.ignoreDuringBuilds = true`, so `npm run build` will not catch lint failures.
- Commits trigger Husky `pre-commit` -> `npx lint-staged`.
- `lint-staged` runs ESLint on `*.js`/`*.jsx` and Prettier on `*.js`, `*.jsx`, `*.json`, `*.css`, `*.md`.

## Architecture
- This is a single Next.js 13 app using the Pages Router, not the App Router.
- Root route wiring lives in `pages/`; global app setup is `pages/_app.js`.
- `src/lib/roi/` is the only TypeScript-heavy subsystem; most of the repo is plain `.js`/`.jsx`.
- Current ROI flow is `pages/roi-report.jsx` -> `POST /api/roi-agent` (SSE stream) -> `src/components/ROIGenerator/ReportViewer.jsx` for chat/editing -> `POST /api/roi-email` for resend.
- `CLAUDE.md` still mentions `/api/roi-report`; the live endpoint is `/api/roi-agent`.

## ROI Pipeline
- `pages/api/roi-agent.js` is the main ROI entrypoint. It normalizes form data, streams events, and in production kicks off PDF generation + email after assembly.
- SSE events are consumed by `src/lib/drainSSE.js`; if you change stream payloads, update both generator and consumers.
- `src/lib/roi/pipeline/normalize.ts` supports two input shapes: structured `processes[]` and a legacy flat-field form payload.
- Local PDF generation in `src/lib/roi/services/pdf.ts` requires a system Chrome/Chromium install unless `VERCEL` or `AWS_EXECUTION_ENV` is set.
- Search fallback order in `src/lib/roi/tools/webSearch.ts`: Tavily -> Brave -> Jina (no-key fallback).

## Imports And Style
- Webpack aliases from `next.config.js`: `@components`, `@hooks`, `@assets`, `@services`, and `@` for project root.
- TS path alias in `tsconfig.json` only defines `@/*` -> project root.
- Prettier is repo-enforced: 2 spaces, no semicolons, single quotes, trailing commas, `endOfLine: 'lf'`.

## Environment
- `.env.example` is incomplete for the ROI stack. ROI code also expects `OPENAI_API_KEY`, `TAVILY_API_KEY` or `BRAVE_API_KEY`, `RESEND_API_KEY`, and optional `EMAIL_FROM`.
- In development, `/api/roi-agent` supports `devOptions.skipLLM` and `devOptions.estimatesOnly`; `/api/roi-agent` and `/api/roi-email` skip PDF/email side effects when `NODE_ENV === 'development'`.
