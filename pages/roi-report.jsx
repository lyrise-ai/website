import React, { useState, useCallback } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import clsx from 'clsx'
import MainHeader from '../src/layout/MainHeader'
import LogosMarquee from '../src/components/MainLandingPage/LogosMarquee'
import LastSection from '../src/components/MainLandingPage/LastSection'

// ── Constants ─────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { icon: '📄', name: 'Writing proposals or quotes', dept: 'Sales' },
  { icon: '📊', name: 'Updating CRM after calls', dept: 'Sales' },
  { icon: '📧', name: 'Email follow-ups & outreach', dept: 'Sales' },
  { icon: '🤝', name: 'Onboarding new clients', dept: 'Operations' },
  { icon: '📋', name: 'Project status reporting', dept: 'Operations' },
  { icon: '📅', name: 'Scheduling meetings & calls', dept: 'Operations' },
  { icon: '💬', name: 'Customer support & ticket triage', dept: 'Operations' },
  { icon: '📦', name: 'Order processing & fulfilment', dept: 'Operations' },
  { icon: '🧾', name: 'Processing invoices & billing', dept: 'Finance' },
  { icon: '📈', name: 'Building management reports', dept: 'Finance' },
  { icon: '📉', name: 'Financial reconciliation', dept: 'Finance' },
  { icon: '📝', name: 'Creating contracts', dept: 'Legal' },
  { icon: '🗂️', name: 'Compliance & regulatory filings', dept: 'Legal' },
  { icon: '🧑‍💼', name: 'Recruiting & screening candidates', dept: 'HR' },
  { icon: '🏁', name: 'Employee onboarding & offboarding', dept: 'HR' },
  { icon: '🔍', name: 'Data entry & data cleaning', dept: 'Operations' },
]

const INDUSTRY_OPTS = [
  'Technology / SaaS',
  'Financial Services',
  'Legal & Professional Services',
  'Healthcare',
  'Real Estate',
  'Retail & E-Commerce',
  'Consulting & Advisory',
  'Manufacturing',
  'Logistics & Supply Chain',
  'Education',
  'Government & Public Sector',
  'Other',
]
const EMPLOYEE_OPTS = ['1–10', '11–50', '51–200', '201–500', '500+']
const REVENUE_OPTS = [
  'Under $1M',
  '$1M–$5M',
  '$5M–$20M',
  '$20M–$100M',
  '$100M+',
]
const COUNTRY_OPTS = [
  'Saudi Arabia',
  'UAE',
  'Qatar',
  'Kuwait',
  'Bahrain / Oman',
  'Egypt',
  'Europe',
  'North America',
  'Other',
]
const PRIORITY_OPTS = [
  'Cut operating costs',
  'Scale without hiring',
  'Faster turnaround',
  'Better client experience',
  'Fewer errors & rework',
  'Free up leadership time',
  'Win more deals',
  'Improve compliance',
]
const VOLS = [
  { label: 'Fewer than 30/mo', value: 'Under 30 per month' },
  { label: '30–100/mo', value: '30–100 per month' },
  { label: '100–300/mo', value: '100–300 per month' },
  { label: 'Over 300/mo', value: 'Over 300 per month' },
]
const TIMES = [
  { label: 'Under 30 min', value: 'Under 30 minutes' },
  { label: '30–60 min', value: '30–60 minutes' },
  { label: '1–2 hours', value: '1–2 hours' },
  { label: 'Over 2 hours', value: 'Over 2 hours' },
]
const ROLES = [
  'Operations / Admin',
  'Sales',
  'Finance',
  'HR / People',
  'Legal',
  'Leadership',
]
const CURRENCIES = [
  'USD – US Dollar ($)',
  'EUR – Euro (€)',
  'GBP – British Pound (£)',
  'SAR – Saudi Riyal (ر.س)',
  'AED – UAE Dirham (د.إ)',
  'QAR – Qatari Riyal (ر.ق)',
  'KWD – Kuwaiti Dinar (د.ك)',
  'BHD – Bahraini Dinar (BD)',
  'OMR – Omani Rial (ر.ع.)',
  'EGP – Egyptian Pound (E£)',
  'NGN – Nigerian Naira (₦)',
  'ZAR – South African Rand (R)',
]
const STAGE_LABELS = {
  research: 'Researching your company…',
  modeler: 'Modelling financial assumptions…',
  calculator: 'Calculating ROI…',
  writer: 'Writing report copy…',
  assemble: 'Assembling report…',
  render: 'Finalising report…',
}
const TOTAL_STEPS = 4

// ── Helpers ───────────────────────────────────────────────────────────────────

function inferDept(name) {
  if (/proposal|quote|lead|sales|crm|prospect/i.test(name)) return 'Sales'
  if (/invoice|billing|finance|payroll|reconcil/i.test(name)) return 'Finance'
  if (/contract|legal|complian|regulat/i.test(name)) return 'Legal'
  if (/recruit|hiring|hr|onboard.*employee|talent/i.test(name)) return 'HR'
  return 'Operations'
}

function deptToRole(dept) {
  const map = {
    Sales: 'Sales',
    Finance: 'Finance',
    Legal: 'Legal',
    HR: 'HR / People',
    Operations: 'Operations / Admin',
  }
  return map[dept] || ''
}

async function drainSSE(reader, decoder, onEvent, buffer = '') {
  const { done, value } = await reader.read()
  if (done) return
  const chunk = buffer + decoder.decode(value, { stream: true })
  const lines = chunk.split('\n')
  const remaining = lines.pop()
  // Parse valid JSON lines first (skip malformed), then dispatch without wrapping in try/catch
  // so errors thrown by onEvent propagate up to the caller's try/catch
  lines
    .filter((l) => l.startsWith('data: '))
    .reduce((acc, line) => {
      try {
        acc.push(JSON.parse(line.slice(6)))
      } catch {
        /* skip malformed */
      }
      return acc
    }, [])
    .forEach((event) => onEvent(event))
  await drainSSE(reader, decoder, onEvent, remaining)
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Pill({ label, active, onClick, dimmed }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={dimmed}
      className={clsx(
        'px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-100',
        active
          ? 'bg-gray-900 border-gray-900 text-white'
          : dimmed
          ? 'border-gray-200 text-gray-400 opacity-40 cursor-not-allowed'
          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900 cursor-pointer',
      )}
    >
      {label}
    </button>
  )
}

function PillGroup({ options, value, onChange, error }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <Pill
            key={opt}
            label={opt}
            active={value === opt}
            onClick={() => onChange(value === opt ? '' : opt)}
          />
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function MultiPillGroup({ options, value, onChange, max }) {
  const atCap = value.length >= max
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value.includes(opt)
          return (
            <Pill
              key={opt}
              label={opt}
              active={active}
              dimmed={atCap && !active}
              onClick={() => {
                if (active) onChange(value.filter((v) => v !== opt))
                else if (!atCap) onChange([...value, opt])
              }}
            />
          )
        })}
      </div>
      {atCap && (
        <p className="mt-1.5 text-xs text-gray-400">
          {max} selected — deselect one to pick another
        </p>
      )}
    </div>
  )
}

function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  optional,
  error,
  autoComplete,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[12.5px] font-semibold text-gray-800">
        {label}
        {optional && (
          <span className="font-normal text-gray-400"> — optional</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={clsx(
          'w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors',
          error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 hover:border-gray-300 focus:border-gray-500',
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ── Step 1 ────────────────────────────────────────────────────────────────────

function Step1({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Your company
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Let&apos;s start with the basics
        </h2>
        <p className="text-sm text-gray-500">
          Context that shapes the whole analysis — takes under a minute.
        </p>
      </div>

      <TextInput
        id="companyName"
        label="Company name"
        value={data.companyName}
        onChange={(v) => onChange('companyName', v)}
        placeholder="e.g. Acme Corp"
        autoComplete="organization"
        error={errors.companyName}
      />

      <div className="space-y-2">
        <label className="text-[12.5px] font-semibold text-gray-800">
          Industry
        </label>
        <PillGroup
          options={INDUSTRY_OPTS}
          value={data.industry}
          onChange={(v) => onChange('industry', v)}
          error={errors.industry}
        />
      </div>

      <TextInput
        id="whatYouDo"
        label="What does your company sell or deliver?"
        value={data.whatYouDo}
        onChange={(v) => onChange('whatYouDo', v)}
        placeholder="e.g. B2B management consulting for operations and strategy"
        optional
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[12.5px] font-semibold text-gray-800">
            How many people work here?
          </label>
          <PillGroup
            options={EMPLOYEE_OPTS}
            value={data.employees}
            onChange={(v) => onChange('employees', v)}
            error={errors.employees}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[12.5px] font-semibold text-gray-800">
            Approximate annual revenue
          </label>
          <PillGroup
            options={REVENUE_OPTS}
            value={data.revenue}
            onChange={(v) => onChange('revenue', v)}
            error={errors.revenue}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[12.5px] font-semibold text-gray-800">
          Country / Region{' '}
          <span className="font-normal text-gray-400">
            — optional, sets rate benchmarks
          </span>
        </label>
        <PillGroup
          options={COUNTRY_OPTS}
          value={data.country}
          onChange={(v) => onChange('country', v)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[12.5px] font-semibold text-gray-800">
          Top priorities right now{' '}
          <span className="font-normal text-gray-400">
            — optional, pick up to 3
          </span>
        </label>
        <MultiPillGroup
          options={PRIORITY_OPTS}
          value={data.priorities}
          onChange={(v) => onChange('priorities', v)}
          max={3}
        />
      </div>
    </div>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

function Step2({
  procs,
  procInput,
  onInputChange,
  onAdd,
  onRemove,
  onSugClick,
  suggestions,
  sugIndex,
  onKeyDown,
  error,
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Your operations
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          What work eats the most time?
        </h2>
        <p className="text-sm text-gray-500">
          Name every task your team does repeatedly that feels slow or manual.
          Add one at a time.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={procInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => setTimeout(() => onInputChange(''), 150)}
            placeholder="e.g. Writing proposals, updating the CRM…"
            autoComplete="off"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none hover:border-gray-300 focus:border-gray-500 transition-colors"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onSugClick(s)
                  }}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors',
                    i === sugIndex ? 'bg-gray-50' : 'hover:bg-gray-50',
                  )}
                >
                  <span className="text-base w-5 text-center flex-shrink-0">
                    {s.icon}
                  </span>
                  <span className="flex-1 text-gray-800">{s.name}</span>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">
                    {s.dept || 'custom'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={procInput.trim().length < 2}
          className="flex-shrink-0 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg disabled:opacity-35 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          Add
        </button>
      </div>

      {procs.length === 0 ? (
        <p className="text-sm text-center text-gray-400 py-6 leading-relaxed">
          Start typing a process name above, or pick from the suggestions.
          <br />
          Add at least one — the more you add, the better the report.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {procs.map((p, i) => (
            <div
              key={p.name}
              className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 py-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500 flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-base flex-shrink-0">{p.icon}</span>
              <span className="flex-1 text-sm font-medium text-gray-800">
                {p.name}
              </span>
              <span className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded px-2 py-0.5 flex-shrink-0">
                {p.dept}
              </span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 1l8 8M9 1L1 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

function ScalePills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const v = opt.value !== undefined ? opt.value : opt
        const label = opt.label !== undefined ? opt.label : opt
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={clsx(
              'px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer',
              value === v
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900',
            )}
          >
            {label}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onChange('')}
        className={clsx(
          'px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer',
          value === ''
            ? 'bg-gray-900 border-gray-900 text-white'
            : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900',
        )}
      >
        Not sure
      </button>
    </div>
  )
}

function Step3({ procs, onUpdate }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Scale & effort
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Give us a sense of the workload
        </h2>
        <p className="text-sm text-gray-500">
          For each process: how often it happens and how long one takes. Order
          of magnitude is fine.
        </p>
      </div>
      <div className="space-y-6">
        {procs.map((p, i) => (
          <div
            key={p.name}
            className={clsx(
              'pb-6',
              i < procs.length - 1 && 'border-b border-gray-100',
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <span>{p.icon}</span>
              <span className="text-sm font-semibold text-gray-800">
                {p.name}
              </span>
              <span className="text-[11px] font-medium text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                {p.dept}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  How often does this happen?
                </p>
                <ScalePills
                  options={VOLS}
                  value={p.volume}
                  onChange={(v) => onUpdate(i, 'volume', v)}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  How long does one take today?
                </p>
                <ScalePills
                  options={TIMES}
                  value={p.timePerItem}
                  onChange={(v) => onUpdate(i, 'timePerItem', v)}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Who mainly does this?{' '}
                  <span className="text-gray-400">(optional)</span>
                </p>
                <ScalePills
                  options={ROLES}
                  value={p.ownerRole}
                  onChange={(v) => onUpdate(i, 'ownerRole', v)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 4 ────────────────────────────────────────────────────────────────────

function Step4({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Almost done
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Where should we send your report?
        </h2>
        <p className="text-sm text-gray-500">
          Your personalised AI ROI analysis will be ready in a few minutes.
        </p>
      </div>

      <TextInput
        id="email"
        label="Work email"
        type="email"
        value={data.email}
        onChange={(v) => onChange('email', v)}
        placeholder="you@company.com"
        autoComplete="email"
        error={errors.email}
      />
      <TextInput
        id="recipientName"
        label="Your name"
        value={data.recipientName}
        onChange={(v) => onChange('recipientName', v)}
        placeholder="e.g. Sarah Al-Mansoori"
        autoComplete="name"
        optional
      />
      <TextInput
        id="recipientTitle"
        label="Your title"
        value={data.recipientTitle}
        onChange={(v) => onChange('recipientTitle', v)}
        placeholder="e.g. COO"
        autoComplete="organization-title"
        optional
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="currency"
          className="text-[12.5px] font-semibold text-gray-800"
        >
          Currency for the report
        </label>
        <select
          id="currency"
          value={data.currency}
          onChange={(e) => onChange('currency', e.target.value)}
          className={clsx(
            'w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors appearance-none bg-white',
            errors.currency
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 hover:border-gray-300 focus:border-gray-500',
          )}
        >
          <option value="">Select your currency…</option>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="text-xs text-red-500 mt-1">{errors.currency}</p>
        )}
      </div>

      <TextInput
        id="website"
        label="Website"
        value={data.website}
        onChange={(v) => onChange('website', v)}
        placeholder="yourcompany.com"
        optional
      />
    </div>
  )
}

// ── Generating & Success views ────────────────────────────────────────────────

function GeneratingView({ currentStage }) {
  return (
    <div className="text-center py-16">
      <div
        className="text-5xl mb-8 inline-block"
        style={{ animation: 'spin 1.2s linear infinite' }}
      >
        ⟳
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {STAGE_LABELS[currentStage] || 'Preparing your report…'}
      </h2>
      <p className="text-sm text-gray-500">
        This takes about 30–60 seconds. Please don&apos;t close this tab.
      </p>
    </div>
  )
}

function SuccessView({ email }) {
  return (
    <div className="text-center py-14">
      <div className="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
        <FaCheckCircle className="text-3xl text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Report on its way
      </h2>
      <p className="text-gray-600 mb-4 max-w-sm mx-auto text-sm leading-relaxed">
        Your personalised AI ROI analysis has been generated and is being
        emailed to:
      </p>
      <div className="inline-block text-sm font-semibold bg-gray-100 rounded-lg px-4 py-2 mb-6">
        {email}
      </div>
      <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
        Want to walk through the findings with our team? Book a free 30-min
        call.
      </p>
      <a
        href="https://calendly.com/elena-lyrise/30min"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
      >
        Book a 30-min call →
      </a>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ROIReport() {
  const [step, setStep] = useState(1)
  const [viewState, setViewState] = useState('form')
  const [currentStage, setCurrentStage] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Step 1
  const [s1, setS1] = useState({
    companyName: '',
    industry: '',
    whatYouDo: '',
    employees: '',
    revenue: '',
    country: '',
    priorities: [],
  })

  // Step 2
  const [procs, setProcs] = useState([])
  const [procInput, setProcInput] = useState('')
  const [sugIndex, setSugIndex] = useState(-1)

  // Step 4
  const [s4, setS4] = useState({
    email: '',
    recipientName: '',
    recipientTitle: '',
    currency: '',
    website: '',
  })

  const [errors, setErrors] = useState({})

  // Derived suggestions
  const suggestions =
    procInput.trim().length >= 1
      ? (() => {
          const low = procInput.toLowerCase()
          const existing = new Set(procs.map((p) => p.name))
          const hits = SUGGESTIONS.filter(
            (s) => !existing.has(s.name) && s.name.toLowerCase().includes(low),
          )
          const isNew = !SUGGESTIONS.some((s) => s.name.toLowerCase() === low)
          if (isNew && procInput.trim().length >= 2) {
            return [
              ...hits.slice(0, 6),
              {
                icon: '✏️',
                name: `Add "${procInput.trim()}"`,
                custom: procInput.trim(),
                dept: '',
              },
            ]
          }
          return hits.slice(0, 6)
        })()
      : []

  const changeS1 = useCallback((key, val) => {
    setS1((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }, [])

  const changeS4 = useCallback((key, val) => {
    setS4((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }, [])

  const addProc = useCallback((proc) => {
    setProcs((prev) => {
      if (prev.find((p) => p.name === proc.name)) return prev
      return [
        ...prev,
        {
          ...proc,
          volume: '',
          timePerItem: '',
          ownerRole: deptToRole(proc.dept),
        },
      ]
    })
    setProcInput('')
    setSugIndex(-1)
    setErrors((prev) => ({ ...prev, procs: '' }))
  }, [])

  const addFromInput = useCallback(() => {
    const val = procInput.trim()
    if (val.length < 2) return
    const match = SUGGESTIONS.find(
      (s) => s.name.toLowerCase() === val.toLowerCase(),
    )
    if (match) addProc(match)
    else addProc({ name: val, dept: inferDept(val), icon: '🔧' })
  }, [procInput, addProc])

  const removeProc = useCallback((i) => {
    setProcs((prev) => prev.filter((_, idx) => idx !== i))
  }, [])

  const updateProc = useCallback((i, field, val) => {
    setProcs((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)),
    )
  }, [])

  const handleSugClick = useCallback(
    (s) => {
      if (s.custom)
        addProc({ name: s.custom, dept: inferDept(s.custom), icon: '🔧' })
      else addProc(s)
    },
    [addProc],
  )

  const handleSugKey = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSugIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSugIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (sugIndex >= 0 && suggestions[sugIndex]) {
          handleSugClick(suggestions[sugIndex])
        } else {
          addFromInput()
        }
      } else if (e.key === 'Escape') {
        setProcInput('')
        setSugIndex(-1)
      }
    },
    [suggestions, sugIndex, handleSugClick, addFromInput],
  )

  const handleInputChange = useCallback((val) => {
    setProcInput(val)
    setSugIndex(-1)
  }, [])

  const validate = useCallback(
    (s) => {
      const errs = {}
      if (s === 1) {
        if (!s1.companyName.trim()) errs.companyName = 'Required'
        if (!s1.industry) errs.industry = 'Please select your industry'
        if (!s1.employees) errs.employees = 'Required'
        if (!s1.revenue) errs.revenue = 'Required'
      }
      if (s === 2) {
        if (!procs.length) errs.procs = 'Add at least one process to continue'
      }
      if (s === 4) {
        const em = s4.email.trim()
        if (!em || !em.includes('@') || em.indexOf('.', em.indexOf('@')) < 0) {
          errs.email = 'Please enter a valid email address'
        }
        if (!s4.currency) errs.currency = 'Required'
      }
      setErrors(errs)
      return Object.keys(errs).length === 0
    },
    [s1, procs, s4],
  )

  const next = useCallback(async () => {
    if (!validate(step)) return
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1)
      return
    }

    setViewState('generating')
    setCurrentStage(null)

    const processRegistry = procs.map((p) => ({
      name: p.name,
      department: p.dept,
      icon: p.icon,
      volume_per_month: p.volume || null,
      time_per_item: p.timePerItem || null,
      owner_role: p.ownerRole || null,
      systems_used: [],
      decision_points: [],
      handoffs: [],
      steps: [],
    }))

    const rawSite = s4.website.trim()
    const website = rawSite
      ? rawSite.startsWith('http')
        ? rawSite
        : `https://${rawSite}`
      : ''

    const payload = {
      'Company Name': s1.companyName,
      'Company Website URL': website,
      'What does your company do?': s1.whatYouDo,
      'Number of Employees': s1.employees,
      'Estimated Annual Revenue': s1.revenue,
      Email: s4.email,
      'Recipient Name': s4.recipientName,
      'Recipient Title': s4.recipientTitle,
      'Operating Currency': s4.currency,
      Industry: s1.industry,
      Country: s1.country,
      'Key Priorities': s1.priorities,
      processes: processRegistry,
      'Biggest time drain on your team': procs[0]?.name || '',
      'Monthly volume of this process (approx.)':
        procs[0]?.volume || 'Not sure',
      'Primary process time per item': procs[0]?.timePerItem || '',
      'Any other bottlenecks to mention? (optional)': procs
        .slice(1)
        .map((p) => {
          let txt = p.name
          if (p.volume) txt += ` (~${p.volume})`
          if (p.timePerItem) txt += ` (~${p.timePerItem})`
          return txt
        })
        .join('; '),
    }

    try {
      const response = await fetch('/api/roi-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      await drainSSE(response.body.getReader(), new TextDecoder(), (event) => {
        if (event.type === 'progress') setCurrentStage(event.stage)
        else if (event.type === 'done') setViewState('success')
        else if (event.type === 'error') throw new Error(event.message)
      })
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
      setViewState('error')
    }
  }, [step, validate, s1, s4, procs])

  const back = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1))
    setErrors({})
  }, [])

  // Non-form views
  if (viewState === 'generating') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100">
            <GeneratingView currentStage={currentStage} />
          </div>
        </div>
      </div>
    )
  }

  if (viewState === 'success') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100">
            <SuccessView email={s4.email} />
          </div>
          <div className="md:w-1/2 w-full mt-12">
            <LogosMarquee />
          </div>
        </div>
        <LastSection />
      </div>
    )
  }

  if (viewState === 'error') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                setViewState('form')
                setStep(1)
              }}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="rebranding-landing-page -mt-[12px]">
      <MainHeader />
      <Head>
        <title>Get Your AI ROI Report | LyRise</title>
        <meta
          name="description"
          content="Discover how much time and money AI can save your business."
        />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-900">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-0.5 bg-gray-100">
              <div
                className="h-full bg-gray-900 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Card header */}
            <div className="flex items-center justify-between px-7 pt-5 pb-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center text-white text-[11px] font-bold tracking-tight">
                  Ly
                </div>
                LyRise
              </div>
              <span className="text-xs font-medium text-gray-400">
                Step {step} of {TOTAL_STEPS}
              </span>
            </div>

            {/* Step content */}
            <div className="px-7 pt-5 pb-2" style={{ minHeight: 360 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {step === 1 && (
                    <Step1 data={s1} onChange={changeS1} errors={errors} />
                  )}
                  {step === 2 && (
                    <Step2
                      procs={procs}
                      procInput={procInput}
                      onInputChange={handleInputChange}
                      onAdd={addFromInput}
                      onRemove={removeProc}
                      onSugClick={handleSugClick}
                      suggestions={suggestions}
                      sugIndex={sugIndex}
                      onKeyDown={handleSugKey}
                      error={errors.procs}
                    />
                  )}
                  {step === 3 && <Step3 procs={procs} onUpdate={updateProc} />}
                  {step === 4 && (
                    <Step4 data={s4} onChange={changeS4} errors={errors} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between px-7 py-5 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={back}
                className={clsx(
                  'text-sm font-medium text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-400 hover:text-gray-800 transition-colors',
                  step === 1 && 'invisible',
                )}
              >
                ← Back
              </button>

              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={clsx(
                      'h-1.5 rounded-full transition-all duration-200',
                      s === step ? 'w-4 bg-gray-900' : 'w-1.5 bg-gray-200',
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="text-sm font-semibold text-white bg-gray-900 rounded-lg px-5 py-2 hover:bg-gray-700 transition-colors shadow-sm"
              >
                {step === TOTAL_STEPS ? 'Generate my report →' : 'Continue →'}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="md:w-1/2 w-full mt-12">
          <LogosMarquee />
        </div>
      </div>
      <LastSection />
    </div>
  )
}
