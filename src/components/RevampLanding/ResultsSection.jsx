import React from 'react'
import { CASE_STUDIES } from './data/verifiedFacts'
import AgentInActionDemo from './AgentInActionDemo'

/**
 * ResultsSection
 *
 * Converted to pure Tailwind CSS:
 * - 2 verified enterprise case study cards (Quantrax & NY Legal)
 * - 3-metric audited ledger stats
 * - Embedded AgentInActionDemo component
 */
export default function ResultsSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white relative" id="results">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[760px] mb-12">
          <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
            Client Deliverables & Proof
          </span>
          <h2 className="font-sans text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.18] tracking-tight text-[#000022] mb-3.5">
            Verified Results Across 100+ Professional Services Deployments
          </h2>
          <p className="text-[clamp(16px,1.4vw,18px)] text-[#4a4e69] leading-relaxed">
            No anonymous quotes or vague efficiency percentages. Every figure
            below is verified through Month 3 financial audits signed by the
            client’s leadership.
          </p>
        </div>

        {/* 2 Headline Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="bg-white border border-[#000022]/8 rounded-2xl p-7 md:p-9 shadow-sm shadow-[#000022]/3 transition-all duration-250 hover:border-[#6666ff]/40 hover:shadow-xl hover:shadow-[#6666ff]/10 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#6666ff]/10 text-[#4200ff]">
                  {cs.segment}
                </span>
                <span className="text-xs text-[#888899] font-medium">
                  {cs.teamSize}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-[#000022] my-2 mb-3.5 tracking-tight">
                {cs.firmName}
              </h3>

              <p className="text-[13.5px] text-[#555566] leading-relaxed m-0">
                {cs.summary}
              </p>

              {/* 3 Metric Stats */}
              <div className="grid grid-cols-3 gap-4 border-y border-[#000022]/8 py-5 my-6">
                <div>
                  <div className="font-mono text-[26px] font-bold tracking-tight text-[#000022] leading-none mb-1">
                    {cs.hoursReturned}
                  </div>
                  <div className="text-[11px] text-[#4a4e69] font-semibold">
                    {cs.hoursReturnedUnit}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[26px] font-bold tracking-tight text-[#008f88] leading-none mb-1">
                    {cs.profitUplift}
                  </div>
                  <div className="text-[11px] text-[#4a4e69] font-semibold">
                    {cs.profitUpliftUnit}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[26px] font-bold tracking-tight text-[#4200ff] leading-none mb-1">
                    {cs.guaranteeRatio}
                  </div>
                  <div className="text-[11px] text-[#4a4e69] font-semibold">
                    {cs.guaranteeLabel}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="m-0 italic text-[13.5px] text-[#333344] border-l-[3px] border-[#6666ff] pl-3.5">
                {cs.quote}
                <footer className="mt-1.5 not-italic text-[11px] text-[#777788] font-semibold">
                  — {cs.quoteAuthor}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>

        {/* Deliverables Showcase & Live Agent Execution (3 Tabs) */}
        <div>
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xl font-extrabold text-[#000022] m-0 tracking-tight">
              Inside the Deliverables: What You Actually Receive
            </h3>
            <span className="text-[13px] text-[#555566]">
              Select a tab to inspect real engagement artifacts ↓
            </span>
          </div>
          <AgentInActionDemo />
        </div>
      </div>
    </section>
  )
}
