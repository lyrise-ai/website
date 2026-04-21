# ROI Refactor Backlog

## Goal
Refactor the ROI system to produce company-specific, evidence-grounded reports that match the quality and behavior of the Claude + `MasterPrompt.md` workflow, while supporting persisted reports, consultant-style chat, PDF export, and freemium access.

## Locked Decisions
- Backend foundation: Supabase
- Export format: PDF only
- Auth model: guest magic links + optional account creation
- Existing strong Claude reports: evaluation gold set first, not full-report RAG
- Keep current intake/UI working during early backend refactor
- Keep legacy NextAuth untouched for non-ROI site flows

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
| M0 | Eval harness and rubric | Not Started | Gold set + scorer + baseline run complete |
| M1 | Supabase foundation and canonical report schema | Not Started | Reports, versions, evidence persist cleanly |
| M2 | Staged generation pipeline | Not Started | Current UI generates through new pipeline |
| M3 | Evidence-first validation and specificity gate | Not Started | Generic reports are blocked or downgraded |
| M4 | Server-owned reports and versioning APIs | Not Started | `reportId` is authoritative |
| M5 | Consultant-style chat with targeted recompute | Not Started | Chat no longer depends on client-owned full state |
| M6 | React report renderer + print/PDF flow | Not Started | Web + PDF use same report document |
| M7 | Guest access, optional accounts, freemium scaffolding | Not Started | Magic links + account claim + quotas |

## Current Priority
1. M0
2. M1
3. M2
4. M3
5. M4
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

## Supabase Schema V1
- `profiles`: `id`, `email`, `display_name`, `role`, `created_at`
- `subscriptions`: `user_id`, `plan`, `status`, `monthly_report_limit`, `monthly_chat_limit`, `created_at`
- `reports`: `id`, `owner_user_id`, `guest_email`, `status`, `company_name`, `current_version_id`, `created_at`, `updated_at`
- `report_versions`: `id`, `report_id`, `version_number`, `stage`, `document_json`, `change_summary`, `created_by`, `created_at`
- `report_evidence`: `id`, `report_id`, `version_id`, `url`, `title`, `source_type`, `snippet`, `facts_json`, `confidence`, `used_in_sections`, `created_at`
- `chat_threads`: `id`, `report_id`, `created_at`
- `chat_messages`: `id`, `thread_id`, `role`, `content`, `action_json`, `version_id`, `created_at`
- `artifacts`: `id`, `report_id`, `version_id`, `kind`, `storage_path`, `status`, `metadata_json`, `created_at`
- `access_grants`: `id`, `report_id`, `email`, `token_hash`, `expires_at`, `claimed_by_user_id`, `created_at`

## API Contract V1
- `POST /api/reports`: create a draft report from intake input; returns `{ reportId, status }`
- `GET /api/reports/:id`: return latest report document, version meta, and access metadata
- `POST /api/reports/:id/generate`: SSE endpoint for staged generation
- `POST /api/reports/:id/chat`: SSE endpoint for consultant-style edits against persisted report
- `POST /api/reports/:id/export/pdf`: generate or return PDF artifact
- `POST /api/reports/:id/email`: send summary + secure link + optional PDF
- `POST /api/reports/:id/claim`: convert guest-owned access into user-owned report access

## Tickets

### M0 — Eval Harness And Guardrails
- [ ] ROI-001 Build gold evaluation dataset
- [ ] ROI-002 Implement scoring rubric from `MasterPrompt.md`
- [ ] ROI-003 Add trace logging to current pipeline
- [ ] ROI-004 Add local eval runner

### M1 — Supabase Foundation And Domain Model
- [ ] ROI-010 Stand up Supabase project and env contract
- [ ] ROI-011 Create SQL schema v1
- [ ] ROI-012 Define canonical Zod schemas
- [ ] ROI-013 Add repository layer
- [ ] ROI-014 Build adapter from current in-memory state

### M2 — Staged Generation Pipeline
- [ ] ROI-020 Create provider and search adapters
- [ ] ROI-021 Implement intake stage
- [ ] ROI-022 Implement research stage with evidence persistence
- [ ] ROI-023 Implement synthesis stage
- [ ] ROI-024 Implement financial modeling stage
- [ ] ROI-025 Implement narrative stage
- [ ] ROI-026 Implement verification stage
- [ ] ROI-027 Replace current monolithic generator with compatibility wrapper

### M3 — Specificity And Verification
- [ ] Define specificity thresholds
- [ ] Enforce evidence minimums before finalization
- [ ] Enforce MasterPrompt rule validators
- [ ] Add downgrade path for low-confidence hypothesis-led output

### M4 — Server-Owned Reports And APIs
- [ ] ROI-030 Create report CRUD endpoints
- [ ] ROI-031 Add staged generation SSE endpoint
- [ ] ROI-032 Persist report versions on generation
- [ ] ROI-033 Add guest access grants and magic links

### M5 — Consultant-Style Chat
- [ ] ROI-040 Build chat intent classifier
- [ ] ROI-041 Build action executor
- [ ] ROI-042 Add invalidation and selective recompute rules
- [ ] ROI-043 Add chat endpoint
- [ ] ROI-044 Add version summaries for material edits

### M6 — Renderer, PDF, And Email
- [ ] ROI-050 Build report workspace page
- [ ] ROI-051 Build React section renderer
- [ ] ROI-052 Build print route for PDF
- [ ] ROI-053 Move PDF generation to print route
- [ ] ROI-054 Refactor email flow

### M7 — Access And Freemium
- [ ] ROI-060 Add Supabase auth flows
- [ ] ROI-061 Add guest-to-account claim flow
- [ ] ROI-062 Build dashboard
- [ ] ROI-063 Add freemium quotas
- [ ] ROI-064 Add internal/admin roles

## First Build Slice
These are the first tickets to execute:
- ROI-001
- ROI-002
- ROI-003
- ROI-004
- ROI-010
- ROI-011
- ROI-012
- ROI-013
- ROI-014
- ROI-020
- ROI-021
- ROI-022
- ROI-023
- ROI-024
- ROI-025
- ROI-026
- ROI-027

## Acceptance Criteria For First Build Slice
- A report can be created and persisted in Supabase
- Evidence items are stored during research
- The current UI still works through a compatibility layer
- The pipeline is split into explicit stages
- Reports fail verification if they are too generic
- Eval runner can compare current vs refactored output on the gold set

## Decisions Log
- 2026-04-21: Use Supabase for DB/Auth/Storage
- 2026-04-21: PDF only, no DOCX
- 2026-04-21: Guest magic links + optional accounts
- 2026-04-21: Good Claude reports used as evaluation gold set first
- 2026-04-21: Keep current UI working during early backend refactor

## Risks / Open Questions
- OpenAI cost remains separate from free infra
- Need redaction policy for storing gold reports in eval fixtures
- Need decision on when to add Anthropic adapter
- Need threshold tuning for specificity gate

## Progress Log
### 2026-04-21
- Planning complete
- Architecture agreed
- Build-ready backlog created in `docs/roi-refactor-backlog.md`
