// Tests for assembleReport — focused on how the report flags annual revenue
// across the three places it surfaces (company snapshot, data provenance, and
// the revenue context statement).
//
// No test-runner dependency: uses Node's built-in `node:test` + `node:assert`.
// The TypeScript source (with `@/` path aliases) is bundled on the fly by
// esbuild into a temp ESM module, which we then import.
//
//   Run:  node --test src/lib/roi/pipeline/__tests__/assembleReport.test.mjs
//
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { after, before, describe, test } from 'node:test'

import * as esbuild from 'esbuild'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../../../../..')

let buildAssembled
let tmpDir

before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'roi-test-'))
  const outfile = path.join(tmpDir, 'fixtures.mjs')
  await esbuild.build({
    entryPoints: [path.join(here, 'fixtures.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    // Mirror tsconfig.json's `"@/*": ["./*"]` alias so source imports resolve.
    alias: { '@': repoRoot },
    logLevel: 'silent',
  })
  ;({ buildAssembled } = await import(pathToFileURL(outfile).href))
})

after(() => {
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('assembleReport — annual revenue flagging', () => {
  describe('when neither a form revenue range nor a research estimate exists', () => {
    test('company snapshot shows an "Unknown" badge row', () => {
      const out = buildAssembled({
        normInput: { revenueRange: '' },
        company: { revenueEstimateM: null },
      })
      const body = out.display.companySnapshotTableBody
      assert.match(body, /Annual revenue — not provided/)
      assert.match(body, /class="badge-assumed">Unknown</)
    })

    test('data provenance shows an "Unknown" status row', () => {
      const out = buildAssembled({
        normInput: { revenueRange: '' },
        company: { revenueEstimateM: null },
      })
      const html = out.display.provenanceTableHTML
      assert.match(html, /Annual revenue anchor/)
      // The status cell carries the consistent "Unknown" label.
      assert.match(html, />Unknown</)
    })

    test('revenue context statement explains the gap', () => {
      const out = buildAssembled({
        normInput: { revenueRange: '' },
        company: { revenueEstimateM: null },
      })
      assert.match(
        out.display.revenueContextStatement,
        /Annual revenue was not provided/,
      )
    })

    test('uses the consistent "Unknown" label in both snapshot and provenance', () => {
      const out = buildAssembled({
        normInput: { revenueRange: '' },
        company: { revenueEstimateM: null },
      })
      // Snapshot: status badge reads "Unknown".
      assert.match(
        out.display.companySnapshotTableBody,
        /class="badge-assumed">Unknown</,
      )
      // Provenance: the status cell (not the detail cell) reads "Unknown".
      const statusCells = out.display.provenanceTableHTML.match(
        /font-size:8pt;[^"]*">([^<]*)</g,
      )
      assert.ok(
        statusCells.some((c) => c.endsWith('>Unknown<')),
        'expected an "Unknown" status cell in the provenance table',
      )
      // The deprecated "Not provided" status label must not appear in any
      // status cell (it may still appear as descriptive detail text).
      assert.ok(
        !statusCells.some((c) => c.endsWith('>Not provided<')),
        'status cells should not use the deprecated "Not provided" label',
      )
    })
  })

  describe('when the form supplies a revenue range', () => {
    test('does not flag revenue as unknown', () => {
      const out = buildAssembled({
        normInput: { revenueRange: '$1M–$5M' },
        company: { revenueEstimateM: null },
      })
      assert.match(out.display.companySnapshotTableBody, /\$1M–\$5M/)
      assert.match(
        out.display.companySnapshotTableBody,
        /class="badge-scraped">Provided</,
      )
      assert.doesNotMatch(
        out.display.companySnapshotTableBody,
        /Annual revenue — not provided/,
      )
      assert.equal(out.display.revenueContextStatement, '')
    })
  })

  describe('when research derives a numeric revenue estimate', () => {
    test('shows a benchmarked estimate and a revenue percentage statement', () => {
      const out = buildAssembled({
        normInput: { revenueRange: '' },
        company: { revenueEstimateM: 6 },
      })
      assert.match(
        out.display.companySnapshotTableBody,
        /Revenue estimated \$6M annually/,
      )
      assert.match(
        out.display.companySnapshotTableBody,
        /class="badge-benchmarked">Benchmarked</,
      )
      assert.doesNotMatch(
        out.display.companySnapshotTableBody,
        /Annual revenue — not provided/,
      )
      assert.match(
        out.display.revenueContextStatement,
        /% of your estimated annual revenue/,
      )
    })
  })
})
