import React, { useState, useEffect } from 'react'
import { SEGMENTS, BRAND } from './data/verifiedFacts'

/**
 * WorkflowCalculator
 *
 * Converted to pure Tailwind CSS:
 * - 3 interactive sliders (frequency, duration, loaded hourly rate)
 * - Dynamic formula calculation (annual hours returned & annual profit uplift)
 * - 3:1 Guarantee ROI multiple callout
 */
export default function WorkflowCalculator({ initialPreset, onPresetChange }) {
  const [selectedPresetId, setSelectedPresetId] = useState(
    initialPreset || 'collections',
  )
  const [frequency, setFrequency] = useState(300)
  const [minutes, setMinutes] = useState(25)
  const [hourlyRate, setHourlyRate] = useState(55)

  useEffect(() => {
    const seg = SEGMENTS.find((s) => s.id === selectedPresetId)
    if (seg) {
      setFrequency(seg.defaultFrequency)
      setMinutes(seg.defaultMinutes)
      setHourlyRate(seg.defaultHourlyRate)
    }
  }, [selectedPresetId])

  const handlePresetClick = (id) => {
    setSelectedPresetId(id)
    if (onPresetChange) onPresetChange(id)
  }

  // Math: 50 working weeks/year, 75% returned by AI prep/automation
  const weeklyHours = (frequency * minutes) / 60
  const annualHoursReturned = Math.round(weeklyHours * 50 * 0.75)
  const annualProfitGain = Math.round(annualHoursReturned * hourlyRate)
  const estimatedMultiple = Math.max(
    3,
    Math.min(25, Math.round(annualProfitGain / 2500)),
  )

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white border border-[#000022]/8 rounded-3xl p-7 md:p-12 shadow-xl shadow-[#000022]/4"
      id="calculator"
    >
      {/* Left Column: Interactive Sliders & Presets */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2">
            60-Second Calculation
          </span>
          <h3 className="text-2xl md:text-[26px] font-extrabold text-[#000022] my-1 mb-2.5 tracking-tight">
            Calculate the Leak in One Repeated Workflow
          </h3>
          <p className="text-sm text-[#555566] m-0">
            Pick a firm preset below or drag the sliders to match your team’s
            weekly workload.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex gap-2 flex-wrap">
          {SEGMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                selectedPresetId === s.id
                  ? 'bg-[#6666ff] border-[#6666ff] text-white shadow-sm'
                  : 'bg-white border-[#000022]/15 text-[#000022] hover:bg-[#f7f8f7]'
              }`}
              onClick={() => handlePresetClick(s.id)}
            >
              {s.shortName}
            </button>
          ))}
        </div>

        {/* Slider 1: Frequency */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#000022]">
              Weekly frequency across team
            </span>
            <span className="font-mono text-[15px] font-bold text-[#6666ff] tracking-tight">
              {frequency.toLocaleString()} touches / week
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="1500"
            step="10"
            value={frequency}
            onChange={(e) => {
              setFrequency(Number(e.target.value))
              setSelectedPresetId('custom')
            }}
            className="w-full h-1.5 rounded-full bg-[#e2e4ea] outline-hidden accent-[#6666ff] cursor-pointer"
          />
        </div>

        {/* Slider 2: Minutes per touch */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#000022]">
              Minutes of team time per touch
            </span>
            <span className="font-mono text-[15px] font-bold text-[#6666ff] tracking-tight">
              {minutes} minutes
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={minutes}
            onChange={(e) => {
              setMinutes(Number(e.target.value))
              setSelectedPresetId('custom')
            }}
            className="w-full h-1.5 rounded-full bg-[#e2e4ea] outline-hidden accent-[#6666ff] cursor-pointer"
          />
        </div>

        {/* Slider 3: Hourly Rate */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#000022]">
              Loaded hourly cost of team member
            </span>
            <span className="font-mono text-[15px] font-bold text-[#6666ff] tracking-tight">
              ${hourlyRate} / hour
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="150"
            step="5"
            value={hourlyRate}
            onChange={(e) => {
              setHourlyRate(Number(e.target.value))
              setSelectedPresetId('custom')
            }}
            className="w-full h-1.5 rounded-full bg-[#e2e4ea] outline-hidden accent-[#6666ff] cursor-pointer"
          />
        </div>
      </div>

      {/* Right Column: Verified Value Output Card */}
      <div className="bg-[#000022] bg-[radial-gradient(circle_at_75%_25%,rgba(102,102,255,0.25),transparent_55%),radial-gradient(circle_at_25%_75%,rgba(0,184,176,0.18),transparent_55%)] rounded-2xl p-8 md:p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="font-mono text-[11px] font-bold text-[#00b8b0] bg-[#00b8b0]/15 border border-[#00b8b0]/30 rounded-full px-3 py-1 tracking-wider uppercase">
              Potential Capacity Recovered
            </span>
            <span className="font-mono text-[10.5px] font-semibold text-[#008e87] bg-[#e6f9f8] border border-[#00b8b0]/30 rounded px-2.5 py-1 tracking-wider">
              Formula: 75% AI Prep
            </span>
          </div>

          <div className="mb-6">
            <div className="text-[13px] text-[#b0b4c8] mb-1">
              Annual Profit Uplift Identified
            </div>
            <div className="font-mono text-[clamp(38px,4.5vw,54px)] font-extrabold leading-tight text-[#00b8b0] tracking-tight mb-2">
              ${annualProfitGain.toLocaleString()}
            </div>
            <div className="text-sm text-[#8f94a8]">
              Equivalent to{' '}
              <strong className="text-white">
                {annualHoursReturned.toLocaleString()} Hours Returned
              </strong>{' '}
              to your team every year.
            </div>
          </div>

          <div className="p-3.5 md:p-4 bg-white/6 border border-white/12 rounded-xl mb-7">
            <div className="text-[11px] text-[#00b8b0] font-bold uppercase tracking-wider mb-0.5">
              LyRise 3:1 Guarantee Benchmark
            </div>
            <div className="text-[13px] text-white">
              At a $2,500 turnkey engagement, this single workflow represents an
              estimated{' '}
              <strong className="text-[#00b8b0]">
                {estimatedMultiple} : 1
              </strong>{' '}
              return on investment.
            </div>
          </div>
        </div>

        <div>
          <a
            href={BRAND.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full font-bold text-sm bg-[#6666ff] text-white shadow-lg shadow-[#6666ff]/30 hover:bg-[#4200ff] transition-all duration-200"
          >
            Claim This in Your Free AI Profit Map!
          </a>
          <div className="text-center text-[11px] text-[#777799] mt-2.5">
            Zero obligation · Completed in 72 hours · Protected by 3:1 guarantee
          </div>
        </div>
      </div>
    </div>
  )
}
