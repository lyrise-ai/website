import fs from 'fs'
import path from 'path'

import { loadStandalonePdfCase } from './scoreReport.mjs'

const evalRoot = path.resolve(process.cwd(), 'evals/roi')
const casesRoot = path.join(evalRoot, 'cases')
const RESERVED_FILE_NAMES = new Set([
  'source.pdf',
  'reference.pdf',
  'actual.pdf',
])

const TOOL_ANCHORS = [
  'Salesforce',
  'HubSpot',
  'NetSuite',
  'Xero',
  'Clio',
  'iManage',
  'SharePoint',
  'SAP',
  'Microsoft Dynamics',
  'QuickBooks',
]

const RISK_KEYWORDS = [
  'privilege',
  'jurisdictional',
  'hallucination',
  'compliance',
  'audit',
  'confidentiality',
  'regulatory',
]

function getStandalonePdfCases(root) {
  const results = []

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    entries.forEach((entry) => {
      const entryPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        walk(entryPath)
        return
      }

      if (
        !entry.isFile() ||
        path.extname(entry.name).toLowerCase() !== '.pdf' ||
        RESERVED_FILE_NAMES.has(entry.name.toLowerCase())
      ) {
        return
      }

      results.push(entryPath)
    })
  }

  walk(root)
  return results.sort((a, b) => a.localeCompare(b))
}

function getLooseRootPdfCases(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && path.extname(entry.name).toLowerCase() === '.pdf',
    )
    .map((entry) => path.join(root, entry.name))
    .sort((a, b) => a.localeCompare(b))
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function extractRecipientNames(text) {
  const match = text.match(
    /PREPARED FOR\s+([A-Z][A-Za-z'’.-]+(?:\s+[A-Z][A-Za-z'’.-]+){0,4})/,
  )
  return match ? [match[1].trim()] : []
}

function extractWorkflowAnchors(text) {
  const match = text.match(
    /Workflows in scope:\s*(.+?)(?:\s{2,}|BEFORE VS\.? AFTER AI|WHAT HAPPENS NEXT|WHAT WE'D DEPLOY|$)/i,
  )

  if (!match) return []

  return unique(
    match[1]
      .split(/[·|]/)
      .map((value) => value.trim())
      .filter(Boolean),
  )
}

function extractPositiveAnchors(text) {
  const anchors = []
  const quantitativeMatches = text.match(
    /\b\d[\d,.+]*\s+(?:fee earners|employees|lawyers|principals|matters\/month|matters|clients|reviews\/month|shipments\/month|engagements|offices)\b/gi,
  )

  if (quantitativeMatches) {
    anchors.push(
      ...quantitativeMatches.slice(0, 3).map((value) => value.trim()),
    )
  }

  TOOL_ANCHORS.forEach((tool) => {
    if (text.toLowerCase().includes(tool.toLowerCase())) {
      anchors.push(tool)
    }
  })

  return unique(anchors).slice(0, 5)
}

function extractRiskAnchors(text) {
  return unique(
    RISK_KEYWORDS.filter((keyword) => text.toLowerCase().includes(keyword)),
  )
}

function formatReferenceMarkdown(text, documentType) {
  let formatted = text.trim()

  const headings =
    documentType === 'executive-summary'
      ? [
          'BOTTOM LINE UP FRONT',
          'CONFIDENCE & REVENUE CONTEXT',
          'THE PATTERN UNDERNEATH',
          'BEFORE VS. AFTER AI',
          'WHERE THE PROFIT UPLIFT COMES FROM',
          'COST OF DELAY',
          'WHAT HAPPENS NEXT',
        ]
      : [
          'EXECUTIVE SUMMARY',
          'COMPANY SNAPSHOT',
          'BEFORE AI VS. AFTER AI',
          'PROFIT UPLIFT',
          'RISKS & MITIGATIONS',
          'NEXT STEPS',
        ]

  headings.forEach((heading) => {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    formatted = formatted.replace(
      new RegExp(`\\s${escaped}\\s`, 'g'),
      `\n\n## ${heading}\n\n`,
    )
  })

  return formatted.replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

function buildScaffoldCase(autoCase, referenceText, sourcePath) {
  return {
    ...autoCase,
    recipientNames: extractRecipientNames(referenceText),
    workflowAnchors: extractWorkflowAnchors(referenceText),
    positiveAnchors: extractPositiveAnchors(referenceText),
    riskAnchors: extractRiskAnchors(referenceText),
    sourceFileName: path.basename(sourcePath),
    needsReview: true,
    notes: [
      'Auto-generated from a dropped PDF fixture.',
      'Review recipient names, positive anchors, workflow anchors, and risk anchors before treating as a fully curated gold case.',
    ],
  }
}

function writeCaseFiles({ caseDir, scaffoldCase, referenceText, sourcePath }) {
  fs.mkdirSync(caseDir, { recursive: true })
  fs.writeFileSync(
    path.join(caseDir, 'case.json'),
    `${JSON.stringify(scaffoldCase, null, 2)}\n`,
    'utf8',
  )
  fs.writeFileSync(
    path.join(caseDir, 'reference.md'),
    formatReferenceMarkdown(referenceText, scaffoldCase.documentType),
    'utf8',
  )

  const destinationPdfPath = path.join(caseDir, 'reference.pdf')
  fs.renameSync(sourcePath, destinationPdfPath)
}

async function main() {
  const standalonePdfs = [
    ...getLooseRootPdfCases(evalRoot),
    ...getStandalonePdfCases(casesRoot),
  ]

  if (standalonePdfs.length === 0) {
    console.log('No standalone ROI PDFs found to scaffold.')
    return
  }

  console.log(`Scaffolding ${standalonePdfs.length} ROI PDF case(s)...`)

  for (const pdfPath of standalonePdfs) {
    const { testCase, reference } = await loadStandalonePdfCase(pdfPath)
    const scaffoldCase = buildScaffoldCase(testCase, reference, pdfPath)
    const caseDir = path.join(casesRoot, scaffoldCase.id)

    if (fs.existsSync(caseDir)) {
      throw new Error(
        `Cannot scaffold ${scaffoldCase.id}: target directory already exists at ${caseDir}`,
      )
    }

    writeCaseFiles({
      caseDir,
      scaffoldCase,
      referenceText: reference,
      sourcePath: pdfPath,
    })

    console.log(`  - ${scaffoldCase.id}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
