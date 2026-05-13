import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { parseApolloCsv } from '@/src/lib/roi/bulk/parseApolloCsv'
import { dedupByCompany } from '@/src/lib/roi/bulk/dedupRows'
import { mapRowToFormPayload } from '@/src/lib/roi/bulk/mapRowToFormPayload'
import { createBulkSession } from '@/src/hooks/useBulkSession'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EDITABLE_FIELDS = [
  { key: 'companyName', label: 'Company name', required: true },
  { key: 'recipientFirstName', label: 'Contact name' },
  { key: 'recipientTitle', label: 'Title' },
  { key: 'email', label: 'Email', required: true },
  { key: 'country', label: 'Country' },
  { key: 'industry', label: 'Industry' },
  { key: 'website', label: 'Website' },
]

function EditRowModal({ row, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => ({
    companyName: row.companyName || '',
    recipientFirstName: `${row.recipientFirstName || ''} ${
      row.recipientLastName || ''
    }`.trim(),
    recipientTitle: row.recipientTitle || '',
    email: row.email || '',
    country: row.country || '',
    industry: row.industry || '',
    website: row.website || '',
  }))

  const canSave =
    draft.companyName.trim().length > 0 && EMAIL_RE.test(draft.email.trim())

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-outfit text-lg font-bold text-[#2C2C2C] mb-4">
          Edit row
        </h2>
        <div className="space-y-3">
          {EDITABLE_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="text"
                value={draft[field.key]}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="font-outfit text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="font-outfit text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() =>
              onSave({
                companyName: draft.companyName.trim(),
                recipientFirstName: draft.recipientFirstName.trim(),
                recipientLastName: '',
                recipientTitle: draft.recipientTitle.trim(),
                email: draft.email.trim().toLowerCase(),
                country: draft.country.trim(),
                industry: draft.industry.trim(),
                website: draft.website.trim(),
              })
            }
            className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full px-5 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BulkIntake() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [rawCount, setRawCount] = useState(0)
  const [rows, setRows] = useState([])
  const [skipped, setSkipped] = useState(new Set())
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [emailMode, setEmailMode] = useState('production') // 'production' | 'override'
  const [overrideEmail, setOverrideEmail] = useState('')

  const handleFiles = useCallback(async (file) => {
    if (!file) return
    setError(null)
    setParsing(true)
    try {
      const all = await parseApolloCsv(file)
      const deduped = dedupByCompany(all)
      setRawCount(all.length)
      setRows(deduped)
      setSkipped(new Set())
    } catch (err) {
      setError(err?.message ?? 'Could not parse this CSV.')
      setRows([])
      setRawCount(0)
    } finally {
      setParsing(false)
    }
  }, [])

  const onPick = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFiles(file)
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFiles(file)
  }

  const toggleRow = (index) => {
    setSkipped((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const saveEdit = (patch) => {
    setRows((prev) =>
      prev.map((r, i) => (i === editingIndex ? { ...r, ...patch } : r)),
    )
    setSkipped((prev) => {
      // If the row previously had no email/company and was forced-skipped,
      // un-skip it so the user's edit takes effect.
      if (!prev.has(editingIndex)) return prev
      const next = new Set(prev)
      next.delete(editingIndex)
      return next
    })
    setEditingIndex(null)
  }

  const selectableRows = useMemo(
    () =>
      rows.map((row, i) => {
        const payload = mapRowToFormPayload(row)
        const disabled = !payload.email || !payload.companyName
        return { row, payload, disabled, index: i }
      }),
    [rows],
  )

  const selectedPayloads = useMemo(
    () =>
      selectableRows
        .filter((r) => !r.disabled && !skipped.has(r.index))
        .map((r) => r.payload),
    [selectableRows, skipped],
  )

  const overrideValid =
    emailMode === 'production' ||
    (overrideEmail.trim().length > 0 && EMAIL_RE.test(overrideEmail.trim()))

  const onGenerate = () => {
    if (selectedPayloads.length === 0 || !overrideValid) return
    const sessionId = createBulkSession(selectedPayloads, {
      emailOverride:
        emailMode === 'override' ? overrideEmail.trim().toLowerCase() : null,
    })
    router.push(`/roi-report/bulk/${sessionId}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/dashboard"
            className="font-outfit text-xs text-gray-500 hover:text-gray-800"
          >
            ← Back to dashboard
          </Link>
          <h1 className="font-outfit text-2xl font-bold text-[#2C2C2C] mt-2">
            Bulk Upload
          </h1>
          <p className="font-outfit text-sm text-gray-500 mt-0.5">
            Upload an Apollo.io CSV to generate ROI reports for each company.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors cursor-pointer px-8 py-12 text-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onPick}
          className="hidden"
        />
        <p className="font-outfit text-sm font-semibold text-[#2C2C2C]">
          {parsing
            ? 'Parsing CSV…'
            : 'Drop your Apollo CSV here or click to browse'}
        </p>
        <p className="font-outfit text-xs text-gray-400 mt-1">
          Required columns: Company Name, Email. Other columns are mapped
          automatically.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 font-outfit">
          {error}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mt-6">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Email delivery
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="emailMode"
                  value="production"
                  checked={emailMode === 'production'}
                  onChange={() => setEmailMode('production')}
                  className="h-4 w-4"
                />
                <span className="font-outfit text-sm text-[#2C2C2C]">
                  Send to production recipients
                </span>
                <span className="font-outfit text-xs text-gray-400">
                  — each report goes to its contact email
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="emailMode"
                  value="override"
                  checked={emailMode === 'override'}
                  onChange={() => setEmailMode('override')}
                  className="h-4 w-4 mt-1"
                />
                <div className="flex-1">
                  <div className="font-outfit text-sm text-[#2C2C2C]">
                    Send to another email
                    <span className="font-outfit text-xs text-gray-400 ml-1">
                      — all reports go to one address
                    </span>
                  </div>
                  {emailMode === 'override' && (
                    <input
                      type="email"
                      value={overrideEmail}
                      onChange={(e) => setOverrideEmail(e.target.value)}
                      placeholder="elena@lyrise.ai"
                      className="font-outfit text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-500 mt-2 w-full max-w-xs"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          <p className="font-outfit text-sm text-gray-500 mt-6 mb-3">
            Parsed {rawCount} {rawCount === 1 ? 'row' : 'rows'} →{' '}
            <span className="font-semibold text-[#2C2C2C]">
              {rows.length} unique {rows.length === 1 ? 'company' : 'companies'}
            </span>{' '}
            · {selectedPayloads.length} selected
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3" />
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-4 py-3">
                    Company
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-4 py-3">
                    Contact
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-4 py-3">
                    Country
                  </th>
                  <th className="font-outfit font-semibold text-[11px] uppercase tracking-wider text-gray-400 text-left px-4 py-3">
                    Currency
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {selectableRows.map(({ row, payload, disabled, index }) => {
                  const isSkipped = disabled || skipped.has(index)
                  return (
                    <tr
                      key={`${row.companyName}-${index}`}
                      className={`border-b border-gray-50 ${
                        disabled ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3 align-middle">
                        <input
                          type="checkbox"
                          checked={!isSkipped}
                          disabled={disabled}
                          onChange={() => toggleRow(index)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="font-outfit text-[#2C2C2C] px-4 py-3">
                        <div className="font-medium">
                          {payload.companyName || (
                            <span className="text-amber-600">
                              (missing — click Edit)
                            </span>
                          )}
                        </div>
                        {payload.industry && (
                          <div className="text-xs text-gray-400">
                            {payload.industry}
                          </div>
                        )}
                      </td>
                      <td className="font-outfit text-gray-600 px-4 py-3">
                        <div>{payload.recipientName || '—'}</div>
                        <div className="text-xs text-gray-400">
                          {payload.recipientTitle || ''}
                          {payload.recipientTitle && payload.email ? ' · ' : ''}
                          {payload.email || (
                            <span className="text-amber-600">
                              no email — click Edit
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="font-outfit text-gray-500 px-4 py-3">
                        {payload.country || '—'}
                      </td>
                      <td className="font-outfit text-gray-500 px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2957FF]">
                          {payload.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingIndex(index)}
                          className="font-outfit text-xs font-semibold text-[#2957FF] hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            {emailMode === 'override' && !overrideValid && (
              <span className="font-outfit text-xs text-red-500">
                Enter a valid override email
              </span>
            )}
            <button
              type="button"
              onClick={onGenerate}
              disabled={selectedPayloads.length === 0 || !overrideValid}
              className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors rounded-full px-6 py-2.5"
            >
              Generate {selectedPayloads.length}{' '}
              {selectedPayloads.length === 1 ? 'Report' : 'Reports'} →
            </button>
          </div>
        </>
      )}

      {editingIndex !== null && rows[editingIndex] && (
        <EditRowModal
          row={rows[editingIndex]}
          onSave={saveEdit}
          onCancel={() => setEditingIndex(null)}
        />
      )}
    </div>
  )
}
