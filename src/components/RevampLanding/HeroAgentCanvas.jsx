/* eslint-disable security/detect-object-injection */
import React, { useState, useEffect } from 'react'
import { SEGMENTS } from './data/verifiedFacts'

/**
 * HeroAgentCanvas
 *
 * Styled with Tailwind CSS matching the LyRise design system:
 * - Segment switcher tabs with clean pill styling
 * - 3-column executive bento grid (01 Intake Stream, 02 Agent Execution, 03 Verified Yield)
 * - Harmonized card heights and balanced typography
 */
export default function HeroAgentCanvas({
  activeSegmentId = 'collections',
  onSelectSegment,
  onSelectWorkflowForCalc,
}) {
  const [selectedSegmentId, setSelectedSegmentId] = useState(activeSegmentId)
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0)
  const [isLiveActive, setIsLiveActive] = useState(true)

  const currentSegment =
    SEGMENTS.find((s) => s.id === selectedSegmentId) || SEGMENTS[0]
  const currentWorkflow =
    currentSegment.workflows[activeWorkflowIdx] || currentSegment.workflows[0]

  useEffect(() => {
    if (activeSegmentId) {
      setSelectedSegmentId(activeSegmentId)
      setActiveWorkflowIdx(0)
    }
  }, [activeSegmentId])

  // Ambient simulated workflow cycle
  useEffect(() => {
    if (!isLiveActive) return undefined

    const timer = setInterval(() => {
      setActiveWorkflowIdx(
        (prev) => (prev + 1) % currentSegment.workflows.length,
      )
    }, 4500)

    return () => clearInterval(timer)
  }, [isLiveActive, currentSegment.workflows.length])

  const handleSelectSeg = (id) => {
    setSelectedSegmentId(id)
    setActiveWorkflowIdx(0)
    if (onSelectSegment) onSelectSegment(id)
  }

  return (
    <div
      className="flex flex-col gap-8 w-full text-left"
      onMouseEnter={() => setIsLiveActive(false)}
      onMouseLeave={() => setIsLiveActive(true)}
    >
      {/* Top Segment Switcher Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2.5">
        <span className="font-mono text-xs font-bold text-[#7b8098] uppercase tracking-wider mr-1">
          Select Industry:
        </span>
        <div className="inline-flex items-center p-1 bg-[#f4f5f8] border border-[#000022]/8 rounded-full flex-wrap gap-1">
          {SEGMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`font-sans text-[13px] font-semibold px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                selectedSegmentId === s.id
                  ? 'bg-[#000022] text-white shadow-sm shadow-[#000022]/20'
                  : 'text-[#555566] hover:text-[#000022] hover:bg-white/70'
              }`}
              onClick={() => handleSelectSeg(s.id)}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Executive Operations Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.32fr_1fr] gap-6 w-full items-stretch">
        {/* Bento Card 1: Live Intake & Baseline Stream */}
        <div className="bg-white border border-[#000022]/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm shadow-[#000022]/4 transition-all duration-300 hover:border-[#6666ff]/40 hover:shadow-lg hover:shadow-[#6666ff]/8 hover:-translate-y-0.5 relative">
          <div>
            <div className="flex items-center justify-between gap-2.5 border-b border-[#000022]/6 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00b8b0] shadow-[0_0_8px_#00b8b0] animate-pulse" />
                <span className="font-mono text-xs font-bold text-[#7b8098] tracking-wider">
                  01 // INTAKE STREAM
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#4200ff] bg-[#f0f0ff] border border-[#6666ff]/20 rounded-full px-2.5 py-0.5">
                {currentWorkflow.freq || '80 / wk'}
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="bg-[#f8f9fc] border border-[#000022]/6 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#000022]">
                  <span className="text-[#6666ff] text-sm">❖</span>
                  <span>{currentWorkflow.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#666677] mt-1.5 font-medium">
                  <span>
                    Frequency:{' '}
                    <strong className="text-[#000022] font-semibold">
                      {currentWorkflow.freq || '80 / wk'}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Duration:{' '}
                    <strong className="text-[#000022] font-semibold">
                      {currentWorkflow.min || '15 min'}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-[#4a4e69]">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#f0f0ff] text-[#4200ff] flex items-center justify-center text-[10px] font-bold shrink-0">
                    ▸
                  </span>
                  <span>Intercepting repetitive case queue</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#f0f0ff] text-[#4200ff] flex items-center justify-center text-[10px] font-bold shrink-0">
                    ▸
                  </span>
                  <span>Extracting unstructured case documents</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#f0f0ff] text-[#4200ff] flex items-center justify-center text-[10px] font-bold shrink-0">
                    ▸
                  </span>
                  <span>Normalizing intake payload for agent processing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#000022]/6 pt-3.5 mt-5 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#008e87] flex items-center gap-1.5">
              <span className="text-sm font-extrabold">✓</span> Verified
              Baseline Logged
            </span>
            <span className="font-mono text-[11px] text-[#7b8098] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b8b0] animate-pulse" />
              Live sync
            </span>
          </div>
        </div>

        {/* Bento Card 2: Autonomous Agent Core Execution & Compliance Gates (Featured) */}
        <div className="bg-gradient-to-b from-white to-[#f7f8ff] border border-[#6666ff]/40 rounded-2xl p-6 flex flex-col justify-between shadow-md shadow-[#6666ff]/8 transition-all duration-300 hover:border-[#6666ff] hover:shadow-xl hover:shadow-[#6666ff]/15 hover:-translate-y-0.5 relative">
          <div>
            <div className="flex items-center justify-between gap-2.5 border-b border-[#000022]/6 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#4200ff] tracking-wider">
                  02 // AGENT EXECUTION
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#008e87] bg-[#e6f9f8] border border-[#00b8b0]/30 rounded-full px-2.5 py-0.5">
                1.4s LATENCY
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="bg-[#f0f0ff] border border-[#6666ff]/20 rounded-xl p-3 flex items-center gap-2.5">
                <span className="font-mono text-[10px] font-extrabold text-white bg-[#4200ff] px-2 py-0.5 rounded tracking-wider">
                  AGENT CORE
                </span>
                <span className="text-[13.5px] font-bold text-[#000022]">
                  {currentWorkflow.agent}
                </span>
              </div>

              {/* Executive Step-by-Step Operations Checklist */}
              <div className="flex flex-col gap-2.5 bg-white border border-[#000022]/6 rounded-xl p-3.5">
                <div className="flex items-center gap-2.5 text-xs text-[#22223b]">
                  <span className="w-4 h-4 rounded-full bg-[#e6f9f8] text-[#008e87] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    ✓
                  </span>
                  <span className="font-medium">
                    Historical ledger &amp; skip trace data parsed
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#22223b]">
                  <span className="w-4 h-4 rounded-full bg-[#e6f9f8] text-[#008e87] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    ✓
                  </span>
                  <span className="font-medium">
                    Zero-drift compliance &amp; jurisdiction rules applied
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#22223b]">
                  <span className="w-4 h-4 rounded-full bg-[#e6f9f8] text-[#008e87] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    ✓
                  </span>
                  <span className="font-medium">
                    Autonomous resolution or routed to specialist
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#000022]/6 pt-3.5 mt-5 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#4200ff] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4200ff] animate-pulse" />
              Autonomous Execution Loop
            </span>
            <span className="font-mono text-[10.5px] font-bold text-[#4a4e69] bg-[#f0f0f4] border border-[#000022]/6 rounded-full px-2.5 py-0.5">
              0% Drift Cap
            </span>
          </div>
        </div>

        {/* Bento Card 3: Audited Yield & Guarantee */}
        <div className="bg-white border border-[#000022]/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm shadow-[#000022]/4 transition-all duration-300 hover:border-[#00b8b0]/40 hover:shadow-lg hover:shadow-[#00b8b0]/8 hover:-translate-y-0.5 relative">
          <div>
            <div className="flex items-center justify-between gap-2.5 border-b border-[#000022]/6 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#7b8098] tracking-wider">
                  03 // VERIFIED YIELD
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[#008e87] bg-[#e6f9f8] border border-[#00b8b0]/35 rounded-full px-2.5 py-0.5">
                3:1 GUARANTEE
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-2.5 text-xs text-[#4a4e69]">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#e6f9f8] text-[#008e87] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    ✓
                  </span>
                  <span>10,000+ accounts scored</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#e6f9f8] text-[#008e87] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    ✓
                  </span>
                  <span>8,000 billable hours returned / yr</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#e6f9f8] text-[#008e87] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    ✓
                  </span>
                  <span>Month 3 audit signed by client</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#eaf8f7] to-[#f4fcfb] border border-[#00b8b0]/30 rounded-xl p-4 mt-1">
                <div className="font-mono text-[28px] font-black text-[#008e87] tracking-tight leading-none">
                  {selectedSegmentId === 'collections'
                    ? '$394,000'
                    : selectedSegmentId === 'law'
                    ? '$300,000'
                    : '$240,000'}
                  <span className="text-xs font-semibold text-[#556666]">
                    {' '}
                    / yr
                  </span>
                </div>
                <div className="text-xs text-[#556666] mt-1.5 font-medium">
                  Annual Total Financial Gain
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#000022]/6 pt-3.5 mt-5 flex items-center justify-between">
            <a
              href="#calculator"
              className="text-xs font-bold text-[#4200ff] hover:text-[#6666ff] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-0.5"
              onClick={(e) => {
                e.stopPropagation()
                if (onSelectWorkflowForCalc) {
                  onSelectWorkflowForCalc({
                    name: currentWorkflow.name,
                    frequency: currentSegment.defaultFrequency,
                    minutes: currentSegment.defaultMinutes,
                    hourlyRate: currentSegment.defaultHourlyRate,
                  })
                }
              }}
            >
              Calculate Firm Return →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
