import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { parseBulkCsv, validateBulkRow } from '@/src/lib/roi/bulk/parseBulkCsv'
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
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 font-outfit text-lg font-bold text-[#2C2C2C]">
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
                className="rounded-lg border border-gray-200 px-3 py-2 font-outfit text-sm outline-none focus:border-gray-500"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-200 px-4 py-2 font-outfit text-sm font-medium text-gray-500 hover:text-gray-800"
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
            className="rounded-full bg-[#2C2C2C] px-5 py-2 font-outfit text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function getRowStatus(row, skipped, index) {
  const hasErrors = row.issues.some((issue) => issue.severity === 'error')
  if (hasErrors) return 'blocked'
  if (skipped.has(index)) return 'skipped'

  const hasWarnings = row.issues.some((issue) => issue.severity === 'warning')
  return hasWarnings ? 'warning' : 'ready'
}

export default function BulkIntake() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [rawCount, setRawCount] = useState(0)
  const [rows, setRows] = useState([])
  const [detectedColumns, setDetectedColumns] = useState({})
  const [fileWarnings, setFileWarnings] = useState([])
  const [fileErrors, setFileErrors] = useState([])
  const [skipped, setSkipped] = useState(new Set())
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [emailMode, setEmailMode] = useState('production')
  const [overrideEmail, setOverrideEmail] = useState('')

  const handleFiles = useCallback(async (file) => {
    if (!file) return

    setError(null)
    setParsing(true)

    try {
      const parsed = await parseBulkCsv(file)
      const deduped = dedupByCompany(parsed.rows)

      setRawCount(parsed.rows.length)
      setRows(deduped.rows)
      setDetectedColumns(parsed.detectedColumns)
      setFileWarnings([...parsed.fileWarnings, ...deduped.warnings])
      setFileErrors(parsed.fileErrors)
      setSkipped(new Set())
    } catch (err) {
      setError(err?.message ?? 'Could not parse this CSV.')
      setRawCount(0)
      setRows([])
      setDetectedColumns({})
      setFileWarnings([])
      setFileErrors([])
      setSkipped(new Set())
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
      prev.map((row, index) =>
        index === editingIndex
          ? validateBulkRow({
              ...row,
              ...patch,
            })
          : row,
      ),
    )

    setSkipped((prev) => {
      if (!prev.has(editingIndex)) return prev
      const next = new Set(prev)
      next.delete(editingIndex)
      return next
    })

    setEditingIndex(null)
  }

  const selectableRows = useMemo(
    () =>
      rows.map((row, index) => {
        const payload = mapRowToFormPayload(row)
        const status = getRowStatus(row, skipped, index)

        return {
          row,
          payload,
          index,
          status,
          disabled: status === 'blocked',
        }
      }),
    [rows, skipped],
  )

  const selectedPayloads = useMemo(
    () =>
      selectableRows
        .filter(({ status }) => status !== 'blocked' && status !== 'skipped')
        .map(({ payload }) => payload),
    [selectableRows],
  )

  const summary = useMemo(() => {
    const counts = {
      ready: 0,
      warning: 0,
      blocked: 0,
      skipped: 0,
    }

    selectableRows.forEach(({ status }) => {
      counts[status] += 1
    })

    return counts
  }, [selectableRows])

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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="font-outfit text-xs text-gray-500 hover:text-gray-800"
          >
            Back to dashboard
          </Link>
          <h1 className="mt-2 font-outfit text-2xl font-bold text-[#2C2C2C]">
            Bulk Upload
          </h1>
          <p className="mt-0.5 font-outfit text-sm text-gray-500">
            Upload a CSV to generate ROI reports for each company.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 bg-white px-8 py-12 text-center transition-colors hover:border-gray-400"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onPick}
          className="hidden"
        />
        <p className="font-outfit text-sm font-semibold text-[#2C2C2C]">
          {parsing ? 'Parsing CSV...' : 'Drop your CSV here or click to browse'}
        </p>
        <p className="mt-1 font-outfit text-xs text-gray-400">
          We detect common column names automatically. Required data per usable
          row: company name and email.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 font-outfit text-sm text-red-700">
          {error}
        </div>
      )}

      {rows.length > 0 && (fileErrors.length > 0 || fileWarnings.length > 0) && (
        <div className="mt-4 space-y-2">
          {fileErrors.map((message) => (
            <div
              key={message}
              className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 font-outfit text-sm text-red-700"
            >
              {message}
            </div>
          ))}
          {fileWarnings.map((message) => (
            <div
              key={message}
              className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 font-outfit text-sm text-amber-800"
            >
              {message}
            </div>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
              <div className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Ready
              </div>
              <div className="mt-2 font-outfit text-2xl font-bold text-[#2C2C2C]">
                {summary.ready}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
              <div className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Needs context
              </div>
              <div className="mt-2 font-outfit text-2xl font-bold text-amber-600">
                {summary.warning}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
              <div className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Blocked
              </div>
              <div className="mt-2 font-outfit text-2xl font-bold text-red-600">
                {summary.blocked}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
              <div className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Skipped
              </div>
              <div className="mt-2 font-outfit text-2xl font-bold text-gray-500">
                {summary.skipped}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <p className="mb-3 font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Email delivery
            </p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
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
                  each report goes to its contact email
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="radio"
                  name="emailMode"
                  value="override"
                  checked={emailMode === 'override'}
                  onChange={() => setEmailMode('override')}
                  className="mt-1 h-4 w-4"
                />
                <div className="flex-1">
                  <div className="font-outfit text-sm text-[#2C2C2C]">
                    Send to another email
                    <span className="ml-1 font-outfit text-xs text-gray-400">
                      all reports go to one address
                    </span>
                  </div>
                  {emailMode === 'override' && (
                    <input
                      type="email"
                      value={overrideEmail}
                      onChange={(e) => setOverrideEmail(e.target.value)}
                      placeholder="elena@lyrise.ai"
                      className="mt-2 w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 font-outfit text-sm outline-none focus:border-gray-500"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          <p className="mb-3 mt-6 font-outfit text-sm text-gray-500">
            Parsed {rawCount} {rawCount === 1 ? 'row' : 'rows'} {'->'}{' '}
            <span className="font-semibold text-[#2C2C2C]">
              {rows.length} unique {rows.length === 1 ? 'company' : 'companies'}
            </span>{' '}
            {'·'} {selectedPayloads.length} selected
          </p>

          {Object.keys(detectedColumns).length > 0 && (
            <div className="mb-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
              <p className="mb-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Detected columns
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(detectedColumns)
                  .filter(([, value]) => value)
                  .map(([field, value]) => (
                    <span
                      key={field}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-outfit text-xs text-gray-600"
                    >
                      {field}: {value}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3" />
                  <th className="px-4 py-3 text-left font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left font-outfit text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Currency
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {selectableRows.map(
                  ({ row, payload, disabled, index, status }) => {
                    const statusClasses = {
                      ready: '',
                      warning: 'bg-amber-50/30',
                      blocked: 'bg-red-50/30',
                      skipped: 'bg-gray-50',
                    }
                    const visibleIssues = row.issues.slice(0, 3)
                    const isChecked =
                      status !== 'blocked' && status !== 'skipped'

                    return (
                      <tr
                        key={`${row.rawRowIndex}-${index}`}
                        className={`border-b border-gray-50 ${statusClasses[status]}`}
                      >
                        <td className="px-4 py-3 align-middle">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={disabled}
                            onChange={() => toggleRow(index)}
                            className="h-4 w-4"
                          />
                        </td>
                        <td className="px-4 py-3 font-outfit text-[#2C2C2C]">
                          <div className="font-medium">
                            {payload.companyName || (
                              <span className="text-red-600">
                                missing - click Edit
                              </span>
                            )}
                          </div>
                          {payload.industry && (
                            <div className="text-xs text-gray-400">
                              {payload.industry}
                            </div>
                          )}
                          {visibleIssues.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {visibleIssues.map((issue) => (
                                <span
                                  key={`${issue.field}-${issue.message}`}
                                  className={`inline-flex items-center rounded-full px-2.5 py-1 font-outfit text-[11px] font-medium ${
                                    issue.severity === 'error'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  {issue.message}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-outfit text-gray-600">
                          <div>{payload.recipientName || '-'}</div>
                          <div className="text-xs text-gray-400">
                            {payload.recipientTitle || ''}
                            {payload.recipientTitle && payload.email
                              ? ' · '
                              : ''}
                            {payload.email || (
                              <span className="text-red-600">
                                no email - click Edit
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-outfit text-gray-500">
                          {payload.country || '-'}
                        </td>
                        <td className="px-4 py-3 font-outfit text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2957FF]">
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
                  },
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {emailMode === 'override' && !overrideValid && (
              <span className="font-outfit text-xs text-red-500">
                Enter a valid override email
              </span>
            )}
            <button
              type="button"
              onClick={onGenerate}
              disabled={selectedPayloads.length === 0 || !overrideValid}
              className="rounded-full bg-[#2C2C2C] px-6 py-2.5 font-outfit text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Generate {selectedPayloads.length}{' '}
              {selectedPayloads.length === 1 ? 'Report' : 'Reports'} {'->'}
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
