// Dedup Apollo rows down to one per company, picking the most senior contact.

import type { BulkRow } from './parseApolloCsv'
import { seniorityRank } from './seniorityRank'

function normalizeCompanyKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+&\s+/g, ' and ')
    .replace(/[.,]/g, '')
    .replace(
      /\b(inc|llc|ltd|limited|llp|plc|gmbh|co|corp|corporation|company)\b/g,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim()
}

export function dedupByCompany(rows: BulkRow[]): BulkRow[] {
  const groups = new Map<string, BulkRow[]>()
  const orderedKeys: string[] = []

  rows.forEach((row) => {
    if (!row.companyName) return
    const key = normalizeCompanyKey(row.companyName)
    if (!key) return
    if (!groups.has(key)) {
      groups.set(key, [])
      orderedKeys.push(key)
    }
    groups.get(key)!.push(row)
  })

  return orderedKeys.map((key) => {
    const candidates = groups.get(key)!
    return candidates.reduce((best, row) => {
      const bestScore = seniorityRank(best.seniority, best.recipientTitle)
      const score = seniorityRank(row.seniority, row.recipientTitle)
      return score > bestScore ? row : best
    }, candidates[0])
  })
}
