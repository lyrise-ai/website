import React, { useState, useCallback } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import clsx from 'clsx'
import MainHeader from '../src/layout/MainHeader'
import LogosMarquee from '../src/components/MainLandingPage/LogosMarquee'
import LastSection from '../src/components/MainLandingPage/LastSection'
import ReportViewer from '../src/components/ROIGenerator/ReportViewer'
import { drainSSE } from '../src/lib/drainSSE'

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
  if (step === 1) {
    if (!s1.companyName.trim() || s1.companyName.trim().length < 2) {
      errors.companyName = 'Please enter your company name'
    }
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
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Where should we send your report?
        </h2>
        <p className="text-sm text-gray-500">
          Your report is generated and emailed — usually ready in 60 seconds.
        </p>
        {isDev && (
          <p className="text-xs text-amber-600 mt-2">
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

function GeneratingView({ generationLog }) {
  return (
    <div className="text-center py-12 px-8">
      <div
        className="text-5xl mb-6 inline-block"
        style={{ animation: 'spin 1.2s linear infinite' }}
      >
        ⟳
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Building your ROI report…
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Our AI is researching your company and modelling your automation
        potential. This takes about 45–90 seconds.
      </p>
      <div className="font-mono text-xs text-gray-600 bg-gray-50 rounded-lg p-4 h-32 overflow-y-auto text-left whitespace-pre-wrap border border-gray-100">
        {generationLog || 'Starting…'}
      </div>
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
  const [generationLog, setGenerationLog] = useState('')
  const [reportState, setReportState] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Step 1
  const [s1, setS1] = useState(
    IS_DEV
      ? DEV_STEP1_PRESET
      : {
          companyName: '',
          website: '',
          whatYouDo: '',
          industry: '',
        },
  )

  // Step 2
  const [s2, setS2] = useState(
    IS_DEV
      ? DEV_STEP2_PRESET
      : {
          email: '',
          recipientName: '',
          recipientTitle: '',
          currency: '',
        },
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

  const next = useCallback(
    async ({ skipLLM = false } = {}) => {
      const currentErrors = validateStep(step, s1, s2)
      setErrors(currentErrors)
      if (Object.keys(currentErrors).length) return

      if (step < TOTAL_STEPS) {
        setStep((prev) => prev + 1)
        return
      }

      setViewState('generating')
      setGenerationLog('')
      setReportState(null)

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
            devOptions: { skipLLM },
          }),
        })

        let latestState = null
        await drainSSE(
          response.body.getReader(),
          new TextDecoder(),
          (event) => {
            if (event.type === 'text_delta') {
              setGenerationLog((prev) => (prev + event.delta).slice(-2000))
            } else if (event.type === 'tool_start') {
              setGenerationLog((prev) => prev + `\n[${event.tool}]`)
            } else if (event.type === 'report_update') {
              latestState = event.state
              setReportState(event.state)
            } else if (event.type === 'done') {
              if (event.assembled || latestState?.assembled) {
                setViewState('preview')
              } else {
                setErrorMessage(
                  'Report generation finished without a complete report. Please try again.',
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
    [step, s1, s2],
  )

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
            <GeneratingView generationLog={generationLog} />
          </div>
        </div>
      </div>
    )
  }

  if (viewState === 'preview' && reportState) {
    return <ReportViewer initialState={reportState} email={s2.email} />
  }

  if (viewState === 'success') {
    return (
      <div className="rebranding-landing-page -mt-[12px]">
        <MainHeader />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100">
            <SuccessView email={s2.email} />
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
                    className="text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg px-5 py-2 hover:bg-gray-200 transition-colors"
                  >
                    Fast mock preview
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => next()}
                  className="text-sm font-semibold text-white bg-gray-900 rounded-lg px-5 py-2 hover:bg-gray-700 transition-colors shadow-sm"
                >
                  {step === TOTAL_STEPS ? 'Generate my report →' : 'Continue →'}
                </button>
              </div>
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
