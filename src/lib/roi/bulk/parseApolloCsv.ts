// Parses an Apollo.io CSV export into BulkRow objects (one per CSV row,
// before dedup). Uses papaparse for robust quoted/multiline field handling.

import Papa from 'papaparse'

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
}

const BOM_RE = new RegExp(`^${String.fromCharCode(0xfeff)}`)

function pick(row: Record<string, string>, ...keys: string[]): string {
  const hit = keys.find((k) => {
    const v = row[k]
    return v != null && String(v).trim() !== ''
  })
  return hit ? String(row[hit]).trim() : ''
}

export function parseApolloCsv(file: File): Promise<BulkRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h: string) => h.replace(BOM_RE, '').trim(),
      complete: (results) => {
        if (results.errors?.length) {
          const fatal = results.errors.find((e) => e.type === 'Delimiter')
          if (fatal) {
            reject(new Error(`CSV parse failed: ${fatal.message}`))
            return
          }
        }
        const rows: BulkRow[] = results.data.map((r, i) => ({
          rawRowIndex: i,
          companyName: pick(r, 'Company Name', 'Company name'),
          recipientFirstName: pick(r, 'First Name'),
          recipientLastName: pick(r, 'Last Name'),
          recipientTitle: pick(r, 'Title'),
          seniority: pick(r, 'Seniority'),
          email: pick(r, 'Email').toLowerCase(),
          website: pick(r, 'Website'),
          companyLinkedinUrl: pick(r, 'Company Linkedin Url'),
          industry: pick(r, 'Industry'),
          employees: pick(r, '# Employees', 'Employees'),
          annualRevenue: pick(r, 'Annual Revenue'),
          country: pick(r, 'Company Country', 'Country'),
          keywords: pick(r, 'Keywords'),
          technologies: pick(r, 'Technologies'),
        }))
        resolve(rows)
      },
      error: (err: Error) => reject(err),
    })
  })
}
