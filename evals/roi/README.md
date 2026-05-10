# ROI Eval Harness

This directory holds the first evaluation harness for the ROI refactor.

## Purpose

- keep a small, versioned gold set of redacted ROI report examples
- score candidate outputs against `MasterPrompt.md`-driven quality signals
- compare current-system outputs against stronger reference reports over time

## Redaction Rules

- commit only redacted or synthetic client material
- do not commit raw client names, emails, attachments, or confidential numbers unless already approved for internal fixture use
- if a report is based on a real client, replace identifying details while preserving the structural quality of the report

## Layout

- `rubric.json`: scoring weights and shared quality checks
- `run.mjs`: loads cases and prints evaluation results
- `scoreReport.mjs`: scoring logic
- `cases/<case-id>/case.json`: case metadata and required anchors
- `cases/<case-id>/reference.md`: strong reference output, optional if PDF is present
- `cases/<case-id>/actual.md`: optional weaker/current output for comparison
- `cases/<case-id>/source.pdf`: optional redacted PDF source for reference scoring
- `cases/<case-id>/reference.pdf`: optional direct PDF reference input
- `cases/<case-id>/actual.pdf`: optional direct PDF current-output input
- any extra `*.pdf` dropped under `cases/` are treated as standalone auto-cases

## Running

```bash
npm run eval:roi
```

Convert dropped PDFs into scaffolded gold cases:

```bash
npm run eval:roi:scaffold
```

Run one case only:

```bash
node evals/roi/run.mjs --case sample-redacted
```

## Case Format

`case.json` example:

```json
{
  "id": "sample-redacted",
  "title": "Redacted legal ops company reference case",
  "companyName": "Northstar Legal Ops",
  "recipientNames": ["Maya Chen"],
  "requiredSections": [
    "Executive Summary",
    "Company Snapshot",
    "Before AI vs. After AI",
    "Profit Uplift",
    "Risks & Mitigations",
    "Next Steps"
  ],
  "positiveAnchors": ["Dubai", "managed legal services", "Salesforce"],
  "workflowAnchors": ["Contract intake triage", "Matter status reporting"],
  "riskAnchors": ["privilege", "jurisdictional"]
}
```

## Where To Put Valid Claude PDF Outputs

For each strong redacted Claude report, create a new case folder:

```text
evals/roi/cases/<case-id>/
  case.json
  reference.md      # optional if using a PDF directly
  source.pdf        # optional gold/reference PDF
  reference.pdf     # optional gold/reference PDF
  actual.md
  actual.pdf
```

Recommended workflow:

1. Add the redacted PDF as `source.pdf` or `reference.pdf`.
2. Optionally copy the report text into `reference.md` if you want a cleaned-up text version, but it is no longer required.
3. Fill `case.json` with the company name, recipient names, required anchors, workflow anchors, and risk anchors.
4. If you have a weak current-system version for the same company, add it as `actual.md` or `actual.pdf`.

Fast path:

- If you just want the harness to start using a dropped Claude PDF immediately, put it anywhere under `evals/roi/cases/`.
- Any PDF not named `source.pdf`, `reference.pdf`, or `actual.pdf` will be treated as a standalone auto-case.
- Auto-cases use inferred company names from the file name and executive-summary defaults when the PDF looks like an executive summary.
- Manual `case.json` files still give better scoring because they add company-specific anchors and workflow/risk expectations.

To promote dropped PDFs into scaffolded gold cases:

1. Drop the PDF anywhere under `evals/roi/cases/`.
2. Run `npm run eval:roi:scaffold`.
3. The script will create a dedicated case folder with:
   - `case.json`
   - `reference.md`
   - `reference.pdf`
4. Review and tighten the generated anchors in `case.json`.

Important:

- The eval runner now accepts `reference.md` first, then falls back to `reference.pdf` or `source.pdf`.
- For current-system comparisons, the runner accepts `actual.md` or `actual.pdf`.
- If you drop in only a strong Claude PDF plus `case.json`, the harness can use it directly for scoring.
- If you drop in only a standalone Claude PDF with no `case.json`, the harness will still evaluate it in auto-case mode.

## Notes

- The starter case in this directory is a scaffold so the harness can be built and tested immediately.
- Replace or expand it with real redacted gold reports as they become available.
