# ROI Refactor Backlog

## Goal
Refactor the ROI system to produce company-specific, evidence-grounded reports that match the quality and behavior of the Claude + `MasterPrompt.md` workflow, while supporting persisted reports, consultant-style chat, PDF export, and freemium access.

## Locked Decisions
- Backend foundation: Supabase
- Export format: PDF only
- Auth model target: guest magic links + optional account creation
- Existing strong Claude reports: evaluation gold set first, not full-report RAG
- Keep current intake/UI working during early backend refactor
- Keep legacy NextAuth untouched for non-ROI site flows
- Current runtime reality: ROI is authenticated-only today; guest access is still a future milestone

## Current Baseline
The branch now already includes a meaningful amount of ROI product infrastructure:

- Supabase auth helpers:
  - `src/lib/supabase-browser.js`
  - `src/lib/supabase-server.js`
  - `src/lib/supabase.js`
- Login, signup callback, dashboard, and report pages:
  - `pages/login.js`
  - `pages/auth/callback.js`
  - `pages/dashboard.jsx`
  - `pages/report/[id].jsx`
- Persisted reports and chat usage state in the current tables:
  - `users`
  - `reports`
  - `chat_messages`
  - `chat_usage`
  - `events`
- Current schema migration already added in repo:
  - `supabase/migrations/20260421_000001_auth_reports_schema.sql`
- Current ROI runtime still centers on:
  - `pages/api/roi-agent.js`
  - `src/lib/roi/agent.ts`
  - `src/lib/roi/types.ts`
  - `public/roi-template.html`
  - `public/roi-exec-template.html`
- PDF download route already exists:
  - `pages/api/roi-pdf.js`
- Current eval harness is not yet present in this checked-out branch; it exists only in the paused stash and must be restored explicitly

## Current Runtime Architecture
- Authenticated ROI flow runs on Supabase, not NextAuth.
- Report generation flow is still centered on:
  - `pages/roi-report.jsx`
  - `pages/api/roi-agent.js`
  - `src/lib/roi/agent.ts`
- Persisted report viewing flow is centered on:
  - `pages/dashboard.jsx`
  - `pages/report/[id].jsx`
  - `reports.state_data` + `reports.rendered_html` + `reports.rendered_full_html`
- Current chat exists in two parallel systems:
  - editable SSE chat via `pages/api/roi-agent.js` with `mode: 'chat'`
  - simple persisted Q&A chat via `pages/api/chat.js`
- Current PDF/export flow is still template-first and client-state-driven:
  - `pages/api/roi-pdf.js`
  - `pages/api/roi-email.js`
- Current runtime prompt path is still the monolithic generator in `src/lib/roi/agent.ts`; `MasterPrompt.md` and the prompt modules are not the active orchestration path

## Current Source Of Truth
The system does not have a single report source of truth yet.

- Active edit session truth: client-held `reportState`
- Persisted structured truth: `reports.state_data`
- Persisted render artifacts: `reports.rendered_html` / `reports.rendered_full_html`

Most future refactor work should treat `reports.state_data` as the compatibility structured source, but the app must stop trusting client-supplied state in chat mode.

## Known Root Causes Of Generic Workflows
- Current intake is too weak:
  - `pages/roi-report.jsx` still submits empty `Number of Employees`, `Estimated Annual Revenue`, `Country`, `Key Priorities`, and `processes`
- Active generation does not run from `MasterPrompt.md`; it still uses `buildGenerationSystemPrompt()` in `src/lib/roi/agent.ts`
- Runtime has explicit generic fallback behavior when research is weak
- Evidence is not persisted as first-class data anywhere in the DB
- No specificity/verification gate exists before saving the report
- Some narrative scaffolding in `src/lib/roi/pipeline/assembleReport.ts` remains inherently generic even when research quality is good

## Rebaseline Rules
- Do not replace the current auth/report/template flow wholesale.
- Build the new architecture additively beside the current implementation.
- Keep `reports` as the compatibility table while introducing versioned/evidence-first tables.
- Treat the current merged branch as the new baseline for all remaining ROI refactor work.
- Prefer backend-first changes that avoid `ReportViewer.jsx`, templates, and `pages/roi-report.jsx` until the schema bridge is in place.

## Success Metrics
| Metric | Baseline | Current | Target | Notes |
|---|---:|---:|---:|---|
| Gold eval cases collected | 0 | 0 | 15+ | Strong existing reports + inputs |
| Avg specificity score | TBD | TBD | +40% over baseline | Derived from rubric |
| Reports with persisted evidence | 0% | 0% | 100% | Every generated report |
| Reports passing specificity gate | 0% | 0% | 80%+ | On eval set |
| Reports with >=2 research-derived workflows | TBD | TBD | 80%+ | When evidence exists |
| Executive summary citing company evidence | TBD | TBD | 90%+ | On eval set |
| Risks section citing company evidence | TBD | TBD | 90%+ | On eval set |
| Chat edits creating versions | 0% | 0% | 100% | For material edits |
| PDF generation success rate | TBD | TBD | 95%+ | Stored artifact |
| Guest reopen flow implemented | No | No | Yes | Magic link |
| Optional account claim flow implemented | No | No | Yes | Freemium-ready |

## Milestones
| ID | Milestone | Status | Exit Criteria |
|---|---|---|---|
| M0 | Eval harness and rubric | Not Started | Eval harness restored on this merged baseline; gold set + scorer + baseline run complete |
| M1 | Schema bridge and canonical report schema | Partially Satisfied | Current `reports` rows map cleanly into canonical documents; bridge tables exist |
| M2 | Staged generation pipeline | Not Started | Current UI generates through new pipeline |
| M3 | Evidence-first validation and specificity gate | Not Started | Generic reports are blocked or downgraded |
| M4 | Server-owned reports and versioning APIs | Partially Satisfied | `reportId` is authoritative and version rows are the durable state source |
| M5 | Consultant-style chat with targeted recompute | Partially Satisfied | Chat no longer depends on client-owned full state |
| M6 | Interactive report renderer + export flow | Partially Satisfied | Interactive web report becomes source of truth; PDF remains export artifact |
| M7 | Guest access, optional accounts, freemium scaffolding | Not Started | Magic links + account claim + quotas |

## Current Priority
1. M4
2. M1
3. M0
4. M3
5. M2
6. M5
7. M6
8. M7

## Target Module Map
```text
src/lib/roi/
  domain/
    schemas.ts
    report.ts
    evidence.ts
    version.ts
    validation.ts
  repositories/
    reportsRepo.ts
    versionsRepo.ts
    evidenceRepo.ts
    artifactsRepo.ts
    accessRepo.ts
  application/
    createReport.ts
    generateReport.ts
    chatOnReport.ts
    rebuildFromStage.ts
    exportPdf.ts
    sendReportEmail.ts
  pipeline/
    stages/
      intake.ts
      research.ts
      synthesize.ts
      model.ts
      narrative.ts
      verify.ts
    rules/
      masterPromptRules.ts
      terminology.ts
      specificity.ts
      financial.ts
      provenance.ts
  chat/
    classifyIntent.ts
    actionTypes.ts
    actionExecutor.ts
    invalidation.ts
  render/
    web/
    print/
  adapters/
    llm/
      provider.ts
      openai.ts
      anthropic.ts
    search/
      webSearch.ts
      fetchPage.ts
    storage/
      supabaseStorage.ts
src/lib/supabase/
  server.ts
  client.ts
pages/api/reports/
  index.js
  [id].js
  [id]/generate.js
  [id]/chat.js
  [id]/export/pdf.js
  [id]/email.js
  [id]/claim.js
pages/reports/
  [id].jsx
  [id]/print.jsx
src/components/ROIWorkspace/
```

## Current Compatibility Surface
- Existing routes/UI that must keep working while we refactor:
  - `pages/roi-report.jsx`
  - `pages/report/[id].jsx`
  - `pages/dashboard.jsx`
  - `pages/login.js`
  - `pages/api/roi-agent.js`
  - `pages/api/chat.js`
  - `pages/api/roi-pdf.js`
  - `pages/api/reports/[id].js`
- Existing persisted state source:
  - `reports.input_data`
  - `reports.state_data`
  - `reports.rendered_html`
  - `reports.rendered_full_html`
- Existing chat persistence source:
  - `chat_messages`
  - `chat_usage`
- Existing report constraints in runtime:
  - non-employees are currently limited to one report in `pages/api/roi-agent.js`
  - employee detection is still inconsistent across some files (role vs email-domain checks)

## Canonical Report Document
```ts
type ReportDocument = {
  id: string
  status:
    | 'draft'
    | 'researching'
    | 'synthesizing'
    | 'modeling'
    | 'writing'
    | 'verifying'
    | 'ready'
    | 'failed'
  input: {
    companyName: string
    website?: string
    recipient?: { name?: string; title?: string; email?: string }
    questionnaire?: unknown
    transcript?: string
    source: 'public_form' | 'internal_user'
  }
  evidence: {
    items: EvidenceItem[]
    facts: ExtractedFact[]
    gaps: string[]
    researchAttempts: ResearchAttempt[]
  }
  research: {
    companyProfile: CompanyProfile
    painPoints: PainPoint[]
    workflows: WorkflowDraft[]
    confidence: 'high' | 'low'
    coreThesis: string
  }
  financial: {
    globals: GlobalInputs
    workflows: WorkflowInput[]
    calculator: RoiCalculatorOutput
    revenueAnchor?: RevenueAnchor
    validations: ValidationResult[]
  }
  narrative: {
    sections: NarrativeSections
    provenance: ProvenanceRow[]
  }
  metadata: {
    currentVersion: number
    lastCompletedStage?: string
    createdAt: string
    updatedAt: string
    ownerUserId?: string
    guestEmail?: string
  }
}
```

## Current Supabase Schema
- `users`: profile/role table for ROI auth layer
- `reports`: current compatibility table storing `input_data`, `state_data`, and rendered HTML
- `chat_messages`: current per-user chat persistence table
- `chat_usage`: current message-limit table
- `events`: analytics/event table

## Schema Bridge Plan
Keep the current tables intact and add the new architecture around them.

Bridge tables to add next:
- `report_versions`: immutable version snapshots of canonical report documents
- `report_evidence`: persisted sources, snippets, facts, and confidence
- `artifacts`: PDF and other export artifacts

Later bridge tables, after the core evidence/version flow is stable:
- `access_grants`: future guest-link claiming layer
- `subscriptions`: future freemium plan/limit layer

Bridge rules:
- `reports` remains the compatibility surface for the live app during migration.
- `report_versions` becomes the new durable source of truth.
- Successful generation and material chat edits should shadow-write into `report_versions` before full cutover.
- New repository code must be able to read both:
  - current `reports` rows
  - future `report_versions` rows

## Schema Mapping
- `reports.id` -> `ReportDocument.id`
- `reports.user_id` -> `ReportDocument.metadata.ownerUserId`
- `reports.email` -> recipient or guest access fallback metadata
- `reports.status` -> `ReportDocument.status`
- `reports.input_data` -> `ReportDocument.input`
- `reports.state_data.company/globals/workflows/copy/...` -> `research`, `financial`, `narrative`
- `reports.rendered_html` / `reports.rendered_full_html` -> compatibility artifacts only
- `chat_messages` stays as-is initially; later it can gain nullable `version_id` / `action_json`

## Target API Contract (Future)
- `POST /api/reports`: create a draft report from intake input; returns `{ reportId, status }`
- `GET /api/reports/:id`: return latest report document, version meta, and access metadata
- `POST /api/reports/:id/generate`: SSE endpoint for staged generation
- `POST /api/reports/:id/chat`: SSE endpoint for consultant-style edits against persisted report
- `POST /api/reports/:id/export/pdf`: generate or return PDF artifact
- `POST /api/reports/:id/email`: send summary + secure link + optional PDF
- `POST /api/reports/:id/claim`: convert guest-owned access into user-owned report access

## Tickets

### M0 — Eval Harness And Guardrails
- [ ] ROI-001 Reapply the eval harness stash onto this merged baseline
- [ ] ROI-002 Restore the curated gold evaluation set on this merged baseline
- [ ] ROI-003 Verify the eval runner works against the current merged app state
- [ ] ROI-004 Add trace logging to the current runtime (`roi-agent`, chat, pdf, email)

### M1 — Schema Bridge And Canonical Report Model
- [ ] ROI-010 Add bridge migration for `report_versions`, `report_evidence`, and `artifacts`
- [ ] ROI-011 Define canonical Zod schemas for `ReportDocument` and related evidence/version types
- [ ] ROI-012 Add mappers from current `reports` rows and `ReportState` into canonical documents
- [ ] ROI-013 Add repository layer that can read current `reports` rows and future `report_versions`
- [ ] ROI-014 Shadow-write canonical `report_versions` rows on successful generation and material chat edits

### M2 — Staged Generation Pipeline
- [ ] ROI-020 Create provider and search adapters
- [ ] ROI-021 Extract intake stage behind the current `/api/roi-agent`
- [ ] ROI-022 Extract research stage shell behind the current runtime
- [ ] ROI-023 Extract synthesis/model/narrative stage shells without changing current UX
- [ ] ROI-024 Route the current generator through staged orchestration incrementally
- [ ] ROI-025 Keep current routes and templates working through the compatibility layer
- [ ] ROI-026 Add verification stage hooks without hard-blocking output yet
- [ ] ROI-027 Replace the monolithic generator internals while preserving the current API contracts

### M3 — Specificity And Verification
- [ ] Persist evidence items and extracted facts as first-class data
- [ ] Define specificity thresholds against the gold set
- [ ] Enforce MasterPrompt rule validators in a verification stage
- [ ] Add downgrade path for low-confidence hypothesis-led output
- [ ] Start with a non-blocking verification gate before save, then tighten to blocking once thresholds are calibrated

### M4 — Server-Owned Reports And APIs
- [ ] ROI-030 Stop trusting client-supplied full report state in chat mode
- [ ] ROI-031 Load persisted canonical state server-side before edits
- [ ] ROI-032 Persist version snapshots as the durable state source
- [ ] ROI-033 Keep current `reports` writes for compatibility while shadow-writing versions

### M5 — Consultant-Style Chat
- [ ] ROI-040 Build chat intent classifier
- [ ] ROI-041 Build action executor
- [ ] ROI-042 Add invalidation and selective recompute rules
- [ ] ROI-043 Unify the current dual chat behavior around the canonical report model
- [ ] ROI-044 Add version summaries for material edits

### M6 — Interactive Report Renderer And Export Flow
- [ ] ROI-050 Build interactive report workspace page
- [ ] ROI-051 Build React section renderer with section IDs and provenance links
- [ ] ROI-052 Add interactive drill-down from executive summary to full-report sections
- [ ] ROI-053 Keep PDF as an export artifact, not the primary document model
- [ ] ROI-054 Refactor email flow around the canonical report document

### M7 — Access And Freemium
- [ ] ROI-060 Add guest access grants and magic-link access flow
- [ ] ROI-061 Add guest-to-account claim flow
- [ ] ROI-062 Extend the existing dashboard for versions, evidence access, and ownership transitions
- [ ] ROI-063 Add freemium quotas
- [ ] ROI-064 Add internal/admin roles

## First Build Slice
These are the first tickets to execute:
- ROI-030
- ROI-031
- ROI-001
- ROI-002
- ROI-003
- ROI-004
- ROI-010
- ROI-011
- ROI-012
- ROI-013
- ROI-014
- Persist evidence items and extracted facts as first-class data
- Define specificity thresholds against the gold set

## Acceptance Criteria For First Build Slice
- Chat no longer trusts client-supplied full report state in `/api/roi-agent`.
- The eval harness is restored and runs against the current merged baseline.
- The current branch still builds and the current ROI UX still works
- Bridge tables exist without breaking current auth/report/chat behavior
- Current `reports` rows can be mapped into canonical report documents
- Successful generation and material chat edits can shadow-write version rows without replacing the current compatibility flow
- Research evidence can be persisted separately from final prose

## Decisions Log
- 2026-04-21: Use Supabase for DB/Auth/Storage
- 2026-04-21: PDF only, no DOCX
- 2026-04-21: Guest magic links + optional accounts
- 2026-04-21: Good Claude reports used as evaluation gold set first
- 2026-04-21: Keep current UI working during early backend refactor
- 2026-04-27: Treat the merged auth/report/template branch as the new ROI refactor baseline
- 2026-04-27: Use a schema-bridge migration strategy instead of replacing current `reports`/chat tables immediately
- 2026-04-27: The future app will use an interactive report view; current templates remain compatibility/export surfaces only

## Risks / Open Questions
- OpenAI cost remains separate from free infra
- Need decision on when to add Anthropic adapter
- Need threshold tuning for specificity gate
- `/api/roi-pdf` is currently unauthenticated and should be revisited before merge-forwarding to production
- Auth/report/template code is now live enough that `ReportViewer.jsx` and `pages/api/roi-agent.js` are high-conflict surfaces for future work
- There are currently two chat systems (`/api/roi-agent` chat and `/api/chat`) that need to be unified later
- The template/report scaffolding in `assembleReport.ts` still injects generic content even when research quality is high

## Progress Log
### 2026-04-21
- Planning complete
- Architecture agreed
- Build-ready backlog created in `docs/roi-refactor-backlog.md`
### 2026-04-27
- Auth, report persistence, dashboard, and template/PDF changes were merged into the working ROI branch
- The plan was rebaselined to build on the current merged implementation instead of replacing auth/report/template flows from scratch
- A deeper exploration pass confirmed that the immediate next leverage is server-owned chat state, schema bridge tables, evidence persistence, and a non-blocking specificity gate
