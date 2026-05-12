import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { parseApolloCsv } from '@/src/lib/roi/bulk/parseApolloCsv'
import { dedupByCompany } from '@/src/lib/roi/bulk/dedupRows'
import { mapRowToFormPayload } from '@/src/lib/roi/bulk/mapRowToFormPayload'
import useBulkSession from '@/src/hooks/useBulkSession'

export default function BulkIntake() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [rawCount, setRawCount] = useState(0)
  const [rows, setRows] = useState([])
  const [skipped, setSkipped] = useState(new Set())
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(null)
  const { start } = useBulkSession(null)

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

  const onGenerate = () => {
    if (selectedPayloads.length === 0) return
    const sessionId = start(selectedPayloads)
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
                </tr>
              </thead>
              <tbody>
                {selectableRows.map(({ row, payload, disabled, index }) => {
                  const isSkipped = disabled || skipped.has(index)
                  return (
                    <tr
                      key={`${row.companyName}-${index}`}
                      className={`border-b border-gray-50 ${
                        disabled ? 'opacity-40' : ''
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
                          {payload.companyName || '—'}
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
                          {payload.email || (disabled ? 'no email' : '')}
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
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onGenerate}
              disabled={selectedPayloads.length === 0}
              className="font-outfit text-sm font-semibold text-white bg-[#2C2C2C] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors rounded-full px-6 py-2.5"
            >
              Generate {selectedPayloads.length}{' '}
              {selectedPayloads.length === 1 ? 'Report' : 'Reports'} →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
