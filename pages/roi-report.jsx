import React, { useState, useCallback, useEffect, useRef } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import clsx from 'clsx'
import MainHeader from '../src/layout/MainHeader'
import LogosMarquee from '../src/components/MainLandingPage/LogosMarquee'
import LastSection from '../src/components/MainLandingPage/LastSection'
import ReportViewer from '../src/components/ROIGenerator/ReportViewer'
import { drainSSE } from '../src/lib/drainSSE'
import { createRouteClient } from '../src/lib/supabaseRouteClient'
import { getRoleForUser } from '../src/lib/authHelpers'

// ── Constants ─────────────────────────────────────────────────────────────────

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
const CURRENCIES = [
  'USD – US Dollar (USD)',
  'EUR – Euro (EUR)',
  'GBP – British Pound (GBP)',
  'SAR – Saudi Riyal (SAR)',
  'AED – UAE Dirham (AED)',
  'QAR – Qatari Riyal (QAR)',
  'KWD – Kuwaiti Dinar (KWD)',
  'BHD – Bahraini Dinar (BHD)',
  'OMR – Omani Rial (OMR)',
  'EGP – Egyptian Pound (EGP)',
  'NGN – Nigerian Naira (NGN)',
  'ZAR – South African Rand (ZAR)',
]
const TOTAL_STEPS = 2
const IS_DEV = process.env.NODE_ENV === 'development'
const DEV_STEP1_PRESET = {
  companyName: 'LyRise',
  website: 'lyrise.ai',
  whatYouDo: 'selling ai solutions for businesses',
  industry: 'Technology / SaaS',
}
const DEV_STEP2_PRESET = {
  email: 'yousef@lyrise.ai',
  recipientName: 'Yousef',
  recipientTitle: 'COO',
  currency: 'USD – US Dollar (USD)',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function validateStep(step, s1, s2) {
  const errors = {}
  if (
    step === 1 &&
    (!s1.companyName.trim() || s1.companyName.trim().length < 2)
  ) {
    errors.companyName = 'Please enter your company name'
  }
  if (step === 2) {
    if (!s2.email.trim() || !/\S+@\S+\.\S+/.test(s2.email)) {
      errors.email = 'Please enter a valid work email'
    }
    if (!s2.currency) errors.currency = 'Please select a currency'
  }
  return errors
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
        <h2 className="mb-1 text-xl font-bold text-gray-900">
          Let&apos;s start with the basics
        </h2>
        <p className="text-sm text-gray-500">
          Takes under a minute — we research the rest automatically.
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
      <TextInput
        id="website"
        label="Company website"
        value={data.website}
        onChange={(v) => onChange('website', v)}
        placeholder="e.g. acmecorp.com"
        optional
        autoComplete="url"
      />
      <TextInput
        id="whatYouDo"
        label="What does your company sell or deliver?"
        value={data.whatYouDo}
        onChange={(v) => onChange('whatYouDo', v)}
        placeholder="e.g. B2B management consulting for operations and strategy"
        optional
      />
      <div className="space-y-2">
        <label className="text-[12.5px] font-semibold text-gray-800">
          Industry{' '}
          <span className="font-normal text-gray-400">
            — helps us benchmark faster
          </span>
        </label>
        <PillGroup
          options={INDUSTRY_OPTS}
          value={data.industry}
          onChange={(v) => onChange('industry', v)}
        />
      </div>
    </div>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

function Step2({ data, onChange, errors, isDev }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Delivery
        </p>
        <h2 className="mb-1 text-xl font-bold text-gray-900">
          Where should we send your report?
        </h2>
        <p className="text-sm text-gray-500">
          Your report is generated and emailed — usually ready in 60 seconds.
        </p>
        {isDev && (
          <p className="mt-2 text-xs text-amber-600">
            Dev mode is on: the form is prefilled, email/PDF are skipped, and
            you can use a fast mock preview.
          </p>
        )}
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
        placeholder="e.g. Sarah Al-Rashid"
        optional
        autoComplete="name"
      />
      <TextInput
        id="recipientTitle"
        label="Your title"
        value={data.recipientTitle}
        onChange={(v) => onChange('recipientTitle', v)}
        placeholder="e.g. COO, Head of Operations"
        optional
      />
      <div className="space-y-2">
        <label className="text-[12.5px] font-semibold text-gray-800">
          Operating currency <span className="text-red-500">*</span>
        </label>
        <PillGroup
          options={CURRENCIES}
          value={data.currency}
          onChange={(v) => onChange('currency', v)}
          error={errors.currency}
        />
      </div>
    </div>
  )
}

// ── Generating & Success views ────────────────────────────────────────────────

function ErrorView({ message, onRetry, onUseEstimates }) {
  const isResearchFailure =
    message?.includes('Stages done: none') ||
    message?.includes('no assembled report') ||
    message?.includes("couldn't research") ||
    message?.includes('retrieve specific web pages')
  return (
    <div className="px-8 py-10 text-center">
      <div
        className="flex items-center justify-center w-12 h-12 mx-auto mb-5 border rounded-full"
        style={{ background: '#fff7ed', borderColor: '#fed7aa' }}
      >
        <span style={{ fontSize: 22 }}>⚠</span>
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        {isResearchFailure
          ? "Couldn't gather company data online"
          : 'Generation incomplete'}
      </h2>
      {isResearchFailure ? (
        <>
          <p className="max-w-sm mx-auto mb-6 text-sm leading-relaxed text-gray-500">
            The agent had trouble finding public data for this company. You can
            retry with web search, or generate a report instantly using your
            questionnaire inputs and industry benchmarks.
          </p>
          <div className="flex flex-col max-w-xs gap-3 mx-auto">
            <button
              type="button"
              onClick={onUseEstimates}
              className="w-full px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Use industry benchmarks (instant) →
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="w-full px-5 py-2.5 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Retry with web search
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="max-w-sm mx-auto mb-6 text-sm text-gray-500">
            {message || 'Something went wrong. Please try again.'}
          </p>
          <div className="flex flex-col max-w-xs gap-3 mx-auto">
            <button
              type="button"
              onClick={onRetry}
              className="w-full px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onUseEstimates}
              className="w-full px-5 py-2.5 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Use industry benchmarks instead
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function GeneratingView({ generationLog }) {
  return (
    <div className="px-8 py-12 text-center">
      <div
        className="inline-block mb-6 text-5xl"
        style={{ animation: 'spin 1.2s linear infinite' }}
      >
        ⟳
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Building your ROI report…
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Our AI is researching your company and modelling your automation
        potential. This takes about 45–90 seconds.
      </p>
      <div className="h-32 p-4 overflow-y-auto font-mono text-xs text-left text-gray-600 whitespace-pre-wrap border border-gray-100 rounded-lg bg-gray-50">
        {generationLog || 'Starting…'}
      </div>
    </div>
  )
}

function SuccessView({ email, reportId, isEmployee }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const bottomRef = useRef(null)

  const userSentCount = messages.filter((m) => m.role === 'user').length

  // Load existing conversation from DB when reportId is set
  useEffect(() => {
    if (!reportId) return
    fetch(`/api/chat?reportId=${reportId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages)
        }
      })
      .catch(() => {})
  }, [reportId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const sendMessage = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isSending || limitReached || !reportId) return

    const updated = [...messages, { role: 'user', content: trimmed }]
    setMessages(updated)
    setInputValue('')
    setIsSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, message: trimmed }),
      })

      if (res.status === 403) {
        setLimitReached(true)
        return
      }
      if (res.status === 429) {
        // Remove the optimistic user message we added
        setMessages((prev) => prev.slice(0, -1))
        setInputValue(trimmed)
        return
      }

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="p-8">
      {/* ── Success header ── */}
      <div className="pb-8 text-center border-b border-gray-100">
        <div className="flex items-center justify-center mx-auto mb-6 border border-green-100 rounded-full w-14 h-14 bg-green-50">
          <FaCheckCircle className="text-3xl text-green-500" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          Report on its way
        </h2>
        <p className="max-w-sm mx-auto mb-4 text-sm leading-relaxed text-gray-600">
          Your personalised AI ROI analysis has been generated and is being
          emailed to:
        </p>
        <div className="inline-block px-4 py-2 mb-6 text-sm font-semibold bg-gray-100 rounded-lg">
          {email}
        </div>
        <p className="max-w-sm mx-auto mb-6 text-sm text-gray-500">
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

      {/* ── Chat ── */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Ask about your report
          </h3>
          {!isEmployee && (
            <span
              className={`text-xs font-mono ${
                limitReached ? 'text-amber-500 font-semibold' : 'text-gray-400'
              }`}
            >
              {Math.min(userSentCount, 5)} / 5 messages used
            </span>
          )}
        </div>

        {/* Message history */}
        {messages.length > 0 && (
          <div className="pr-1 mb-4 space-y-3 overflow-y-auto max-h-72">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2957FF] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-gray-100 rounded-2xl">
                  <div className="flex items-center gap-1">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Limit reached banner */}
        {limitReached ? (
          <div className="p-5 text-center border bg-amber-50 border-amber-200 rounded-xl">
            <p className="mb-2 font-mono text-xs font-semibold text-amber-500">
              5 / 5 messages used
            </p>
            <p className="mb-1 text-sm font-semibold text-amber-800">
              You&apos;ve used your 5 free messages.
            </p>
            <p className="mb-4 text-xs text-amber-600">
              Want unlimited edits? Contact LyRise to refine your ROI strategy.
            </p>
            <a
              href="https://calendly.com/elena-lyrise/30min"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white transition-colors rounded-lg bg-amber-600 hover:bg-amber-700"
            >
              Contact Sales →
            </a>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              disabled={isSending}
              placeholder="Ask a question about your ROI report…"
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2957FF] transition-colors bg-white"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!inputValue.trim() || isSending}
              className="px-4 py-2.5 bg-[#2957FF] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export async function getServerSideProps({ req, res }) {
  const supabase = createRouteClient(req, res)
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  const { role } = await getRoleForUser(data.user.id)
  const isEmployee = role === 'EMPLOYEE'

  return {
    props: {
      user: data.user,
      isEmployee,
    },
  }
}

export default function ROIReport({ user, isEmployee }) {
  const [step, setStep] = useState(1)
  const [viewState, setViewState] = useState('form')
  const [generationLog, setGenerationLog] = useState('')
  const [reportState, setReportState] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [reportId, setReportId] = useState(null)
  const [initialMessagesUsed, setInitialMessagesUsed] = useState(0)

  const [s1, setS1] = useState(
    IS_DEV
      ? DEV_STEP1_PRESET
      : { companyName: '', website: '', whatYouDo: '', industry: '' },
  )
  const [s2, setS2] = useState(
    IS_DEV
      ? DEV_STEP2_PRESET
      : { email: '', recipientName: '', recipientTitle: '', currency: '' },
  )
  const [errors, setErrors] = useState({})

  const changeS1 = useCallback((key, val) => {
    setS1((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }, [])

  const changeS2 = useCallback((key, val) => {
    setS2((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }, [])

  const runGeneration = useCallback(
    async ({ skipLLM = false, estimatesOnly = false } = {}) => {
      setViewState('generating')
      setGenerationLog('')
      setReportState(null)
      setErrorMessage('')

      const payload = {
        'Company Name': s1.companyName.trim(),
        'Company Website URL': s1.website.trim(),
        'What does your company do?': s1.whatYouDo.trim(),
        Industry: s1.industry || '',
        'Number of Employees': '',
        'Estimated Annual Revenue': '',
        'Operating Currency': s2.currency ? s2.currency.split(' – ')[0] : '',
        Email: s2.email.trim(),
        'Recipient Name': s2.recipientName.trim(),
        'Recipient Title': s2.recipientTitle.trim(),
        Country: '',
        'Key Priorities': [],
        processes: [],
      }

      try {
        const response = await fetch('/api/roi-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'generate',
            formData: payload,
            devOptions: { skipLLM, estimatesOnly },
          }),
        })

        if (response.status === 401) {
          window.location.href = '/login'
          return
        }

        if (response.status === 409) {
          const data = await response.json()
          if (data.report_id) {
            window.location.href = `/report/${data.report_id}`
          }
          return
        }

        let latestState = null
        await drainSSE(
          response.body.getReader(),
          new TextDecoder(),
          (event) => {
            if (event.type === 'text_delta') {
              setGenerationLog((prev) => (prev + event.delta).slice(-2000))
            } else if (event.type === 'tool_start') {
              setGenerationLog((prev) => `${prev}\n[${event.tool}]`)
            } else if (event.type === 'report_update') {
              latestState = event.state
              setReportState(event.state)
            } else if (event.type === 'report_saved') {
              setReportId(event.report_id)
            } else if (event.type === 'done') {
              if (
                (event.assembled || latestState?.assembled) &&
                latestState?.renderedHtml
              ) {
                setViewState('preview')
              } else {
                setErrorMessage(
                  'Report generation finished without a complete report.',
                )
                setViewState('error')
              }
            } else if (event.type === 'error') {
              throw new Error(event.message)
            }
          },
        )
      } catch (err) {
        setErrorMessage(
          err.message || 'Something went wrong. Please try again.',
        )
        setViewState('error')
      }
    },
    [s1, s2],
  )

  const next = useCallback(
    async ({ skipLLM = false } = {}) => {
      const currentErrors = validateStep(step, s1, s2)
      setErrors(currentErrors)
      if (Object.keys(currentErrors).length) return
      if (step < TOTAL_STEPS) {
        setStep((prev) => prev + 1)
        return
      }
      await runGeneration({ skipLLM })
    },
    [step, s1, s2, runGeneration],
  )

  const back = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1))
    setErrors({})
  }, [])

  // Non-form views
  if (viewState === 'loading') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader user={user} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-gray-900 animate-spin" />
        </div>
      </div>
    )
  }

  if (viewState === 'generating') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader user={user} />
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-xl bg-white border border-gray-100 shadow-xl rounded-2xl">
            <GeneratingView generationLog={generationLog} />
          </div>
        </div>
      </div>
    )
  }

  if (viewState === 'preview' && reportState) {
    return (
      <ReportViewer
        initialState={reportState}
        email={s2.email}
        reportId={reportId}
        isEmployee={isEmployee}
        initialMessagesUsed={initialMessagesUsed}
        backHref={isEmployee ? '/dashboard' : undefined}
      />
    )
  }

  if (viewState === 'success') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader user={user} />
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-xl bg-white border border-gray-100 shadow-xl rounded-2xl">
            <SuccessView
              email={s2.email}
              reportId={reportId}
              isEmployee={isEmployee}
            />
          </div>
          <div className="w-full mt-12 md:w-1/2">
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
        <MainHeader user={user} />
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-xl bg-white border border-gray-100 shadow-xl rounded-2xl">
            <ErrorView
              message={errorMessage}
              onRetry={() => runGeneration()}
              onUseEstimates={() => runGeneration({ estimatesOnly: true })}
            />
          </div>
        </div>
      </div>
    )
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="rebranding-landing-page -mt-[12px]">
      <MainHeader user={user} />
      <Head>
        <title>Get Your AI ROI Report | LyRise</title>
        <meta
          name="description"
          content="Discover how much time and money AI can save your business."
        />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans text-gray-900">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl"
          >
            {/* Progress bar */}
            <div className="h-0.5 bg-gray-100">
              <div
                className="h-full transition-all duration-300 ease-out bg-gray-900"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Card header */}
            <div className="flex items-center justify-between pt-5 pb-1 px-7">
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
            <div className="pt-5 pb-2 px-7" style={{ minHeight: 360 }}>
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
                      data={s2}
                      onChange={changeS2}
                      errors={errors}
                      isDev={IS_DEV}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between py-5 mt-4 border-t border-gray-100 px-7">
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
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={clsx(
                      'h-1.5 rounded-full transition-all duration-200',
                      s === step ? 'w-4 bg-gray-900' : 'w-1.5 bg-gray-200',
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {IS_DEV && step === TOTAL_STEPS && (
                  <button
                    type="button"
                    onClick={() => next({ skipLLM: true })}
                    className="px-5 py-2 text-sm font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Fast mock preview
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => next()}
                  className="px-5 py-2 text-sm font-semibold text-white transition-colors bg-gray-900 rounded-lg shadow-sm hover:bg-gray-700"
                >
                  {step === TOTAL_STEPS ? 'Generate my report →' : 'Continue →'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full mt-12 md:w-1/2">
          <LogosMarquee />
        </div>
      </div>
      <LastSection />
    </div>
  )
}
