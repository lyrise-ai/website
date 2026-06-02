import Papa from 'papaparse'

export const BULK_FIELD_KEYS = [
  'companyName',
  'recipientFirstName',
  'recipientLastName',
  'recipientTitle',
  'seniority',
  'email',
  'website',
  'companyLinkedinUrl',
  'industry',
  'employees',
  'annualRevenue',
  'country',
  'keywords',
  'technologies',
] as const

export type BulkFieldKey = typeof BULK_FIELD_KEYS[number]

export interface RowIssue {
  field: BulkFieldKey | 'row'
  severity: 'error' | 'warning'
  message: string
}

export interface BulkRow {
  rawRowIndex: number
  companyName: string
  recipientFirstName: string
  recipientLastName: string
  recipientTitle: string
  seniority: string
  email: string
  website: string
  companyLinkedinUrl: string
  industry: string
  employees: string
  annualRevenue: string
  country: string
  keywords: string
  technologies: string
  issues: RowIssue[]
}

export type DetectedColumns = Record<BulkFieldKey, string | null>

export interface ParseBulkCsvResult {
  rows: BulkRow[]
  detectedColumns: DetectedColumns
  fileWarnings: string[]
  fileErrors: string[]
}

type RawCsvRow = Record<string, string>
type BulkRowDraft = Omit<BulkRow, 'issues'>

const BOM_RE = /^\uFEFF/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REQUIRED_FIELDS: BulkFieldKey[] = ['companyName', 'email']
const OPTIONAL_WARNING_FIELDS: Array<{
  field: BulkFieldKey
  message: string
}> = [
  { field: 'website', message: 'Missing website' },
  { field: 'industry', message: 'Missing industry' },
  { field: 'country', message: 'Missing country' },
  { field: 'employees', message: 'Missing employee count' },
  { field: 'annualRevenue', message: 'Missing annual revenue' },
]

const HEADER_ALIASES: Record<BulkFieldKey, string[]> = {
  companyName: [
    'Company Name',
    'Company',
    'Account Name',
    'Organization',
    'Business Name',
  ],
  recipientFirstName: [
    'First Name',
    'Contact First Name',
    'Lead First Name',
    'first_name',
  ],
  recipientLastName: [
    'Last Name',
    'Contact Last Name',
    'Lead Last Name',
    'last_name',
  ],
  recipientTitle: ['Title', 'Job Title', 'Position', 'Contact Title'],
  seniority: ['Seniority', 'Job Seniority', 'Role Seniority'],
  email: ['Email', 'Work Email', 'Business Email', 'contact_email'],
  website: ['Website', 'Company Website', 'Company Website URL', 'Domain'],
  companyLinkedinUrl: [
    'Company Linkedin Url',
    'Company LinkedIn URL',
    'LinkedIn',
    'Company LinkedIn',
    'Linkedin URL',
  ],
  industry: ['Industry', 'Vertical'],
  employees: ['# Employees', 'Employees', 'Employee Count', 'Headcount'],
  annualRevenue: ['Annual Revenue', 'Revenue', 'Estimated Revenue'],
  country: ['Country', 'Company Country', 'HQ Country'],
  keywords: ['Keywords', 'Company Keywords', 'Description'],
  technologies: ['Technologies', 'Tech Stack', 'Technology Stack'],
}

function normalizeHeader(value: string): string {
  return value
    .replace(BOM_RE, '')
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
}

function normalizeCell(value: unknown): string {
  return String(value ?? '')
    .replace(BOM_RE, '')
    .trim()
}

function emptyDetectedColumns(): DetectedColumns {
  return BULK_FIELD_KEYS.reduce((acc, key) => {
    acc[key] = null
    return acc
  }, {} as DetectedColumns)
}

function detectColumns(headers: string[]): DetectedColumns {
  const detected = emptyDetectedColumns()
  // Map normalizedHeader → the transformed key PapaParse uses as the row key
  // (transformHeader applies normalizeCell, so row keys === normalizeCell(csvHeader))
  const headerMap = new Map<string, string>()

  headers.forEach((header) => {
    const transformedKey = normalizeCell(header)
    if (transformedKey) headerMap.set(normalizeHeader(transformedKey), transformedKey)
  })

  BULK_FIELD_KEYS.forEach((field) => {
    const hit = HEADER_ALIASES[field]
      .map((alias) => headerMap.get(normalizeHeader(alias)))
      .find(Boolean)
    detected[field] = hit ?? null
  })

  return detected
}

function pick(
  row: RawCsvRow,
  header: string | null,
  lowercase = false,
): string {
  if (!header) return ''
  const value = normalizeCell(row[header])
  return lowercase ? value.toLowerCase() : value
}

export function validateBulkRow(row: BulkRowDraft): BulkRow {
  const issues: RowIssue[] = []

  if (!row.companyName) {
    issues.push({
      field: 'companyName',
      severity: 'error',
      message: 'Missing company name',
    })
  }

  if (!row.email) {
    issues.push({
      field: 'email',
      severity: 'error',
      message: 'Missing email',
    })
  } else if (!EMAIL_RE.test(row.email)) {
    issues.push({
      field: 'email',
      severity: 'error',
      message: 'Invalid email address',
    })
  }

  OPTIONAL_WARNING_FIELDS.forEach(({ field, message }) => {
    if (!row[field]) {
      issues.push({
        field,
        severity: 'warning',
        message,
      })
    }
  })

  return {
    ...row,
    issues,
  }
}

function buildRow(
  csvRow: RawCsvRow,
  rowIndex: number,
  detectedColumns: DetectedColumns,
): BulkRow {
  return validateBulkRow({
    rawRowIndex: rowIndex,
    companyName: pick(csvRow, detectedColumns.companyName),
    recipientFirstName: pick(csvRow, detectedColumns.recipientFirstName),
    recipientLastName: pick(csvRow, detectedColumns.recipientLastName),
    recipientTitle: pick(csvRow, detectedColumns.recipientTitle),
    seniority: pick(csvRow, detectedColumns.seniority),
    email: pick(csvRow, detectedColumns.email, true),
    website: pick(csvRow, detectedColumns.website),
    companyLinkedinUrl: pick(csvRow, detectedColumns.companyLinkedinUrl),
    industry: pick(csvRow, detectedColumns.industry),
    employees: pick(csvRow, detectedColumns.employees),
    annualRevenue: pick(csvRow, detectedColumns.annualRevenue),
    country: pick(csvRow, detectedColumns.country),
    keywords: pick(csvRow, detectedColumns.keywords),
    technologies: pick(csvRow, detectedColumns.technologies),
  })
}

function buildFileMessages(
  rows: BulkRow[],
  detectedColumns: DetectedColumns,
): Pick<ParseBulkCsvResult, 'fileWarnings' | 'fileErrors'> {
  const fileWarnings: string[] = []
  const fileErrors: string[] = []

  const missingOptionalColumns = OPTIONAL_WARNING_FIELDS.map(
    ({ field }) => field,
  )
    .filter((field) => !detectedColumns[field])
    .map((field) => field.replace(/([A-Z])/g, ' $1').toLowerCase())
  if (missingOptionalColumns.length > 0) {
    fileWarnings.push(
      `Optional columns not detected: ${missingOptionalColumns.join(', ')}.`,
    )
  }

  const blockedRows = rows.filter((row) =>
    row.issues.some((issue) => issue.severity === 'error'),
  ).length
  if (blockedRows > 0) {
    fileWarnings.push(
      `${blockedRows} ${
        blockedRows === 1 ? 'row needs' : 'rows need'
      } review before generation.`,
    )
  }

  return { fileWarnings, fileErrors }
}

export function parseBulkCsv(file: File): Promise<ParseBulkCsvResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header: string) => normalizeCell(header),
      complete: (results) => {
        if (results.errors?.length) {
          const fatal = results.errors.find(
            (error) => error.type === 'Delimiter',
          )
          if (fatal) {
            reject(new Error(`CSV parse failed: ${fatal.message}`))
            return
          }
        }

        if (!results.data.length) {
          reject(new Error('No rows found in this CSV.'))
          return
        }

        const headers = Object.keys(results.data[0] ?? {})
        const detectedColumns = detectColumns(headers)

        const missingRequired = REQUIRED_FIELDS.filter(
          (field) => !detectedColumns[field],
        )
        if (missingRequired.length > 0) {
          const names = missingRequired
            .map((f) => (f === 'companyName' ? 'company name' : f))
            .join(' and ')
          resolve({
            rows: [],
            detectedColumns,
            fileWarnings: [],
            fileErrors: [
              `Could not detect required column${missingRequired.length > 1 ? 's' : ''} for ${names}. Check that your CSV has a recognisable header for ${missingRequired.length > 1 ? 'these fields' : 'this field'} and re-upload.`,
            ],
          })
          return
        }

        const rows = results.data.map((row, index) =>
          buildRow(row, index, detectedColumns),
        )
        const { fileWarnings, fileErrors } = buildFileMessages(
          rows,
          detectedColumns,
        )

        resolve({
          rows,
          detectedColumns,
          fileWarnings,
          fileErrors,
        })
      },
      error: (error: Error) => reject(error),
    })
  })
}
