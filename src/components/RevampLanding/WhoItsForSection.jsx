import React from 'react'
import { SEGMENTS, BRAND } from './data/verifiedFacts'

/**
 * WhoItsForSection
 *
 * Converted to pure Tailwind CSS:
 * - 4 professional services segment bento cards
 * - Primary workflow pill with annual capacity restored metric
 * - Bottom objection handling banner ("Don't see your exact industry?")
 */
export default function WhoItsForSection({ onSelectSegment }) {
  const handleSelect = (id) => {
    if (onSelectSegment) {
      onSelectSegment(id)
    }
  }

  return (
    <section className="py-20 md:py-24 px-6 bg-[#f7f8f7] relative" id="who">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[760px] mb-12">
          <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
            Who It’s For
          </span>
          <h2 className="font-sans text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.18] tracking-tight text-[#000022] mb-3.5">
            Built for Professional Services Firms with 50 to 500 People
          </h2>
          <p className="text-[clamp(16px,1.4vw,18px)] text-[#4a4e69] leading-relaxed">
            If your billable fee earners or operations staff spend half their
            week on repeated extraction, review, and reporting tasks, LyRise
            builds the AI agents that take over the tedious work.
          </p>
        </div>

        {/* 4 Clean Segment Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.id}
              className="bg-white border border-[#000022]/8 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-250 hover:border-[#6666ff] hover:shadow-xl hover:shadow-[#6666ff]/10 hover:-translate-y-0.5"
            >
              <div>
                <span className="inline-block font-mono text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 bg-[#6666ff]/10 text-[#4200ff]">
                  {seg.client}
                </span>
                <h3 className="font-sans text-[19px] font-bold tracking-tight text-[#000022] mb-2">
                  {seg.name}
                </h3>

                <div className="bg-[#f7f8f7] border border-[#000022]/6 rounded-lg p-3 mb-5">
                  <div className="text-[11px] font-bold uppercase text-[#6666ff] mb-1">
                    Primary Workflow
                  </div>
                  <div className="text-[13px] font-semibold text-[#000022]">
                    {seg.topWorkflow}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#000022]/8 pt-4 flex items-center justify-between gap-2 mt-auto">
                <div className="min-w-0">
                  <div className="text-[15px] sm:text-[16px] font-extrabold text-[#008f88] font-mono leading-tight whitespace-nowrap">
                    {seg.recoverableEstimate.replace(' Returned / yr', '')}
                  </div>
                  <div className="text-[11px] text-[#777788] whitespace-nowrap mt-0.5">
                    Annual Capacity Restored
                  </div>
                </div>
                <a
                  href="#calculator"
                  onClick={() => handleSelect(seg.id)}
                  className="shrink-0 whitespace-nowrap inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-full border border-[#000022]/15 text-[#000022] hover:bg-[#f4f5f8] hover:border-[#000022]/30 transition-all duration-200"
                >
                  Price →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Catch-all objection block */}
        <div className="mt-8 p-5 md:p-6 bg-white border border-[#000022]/8 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div>
            <div className="text-[14px] font-bold text-[#000022]">
              Don’t see your exact industry or specialty?
            </div>
            <div className="text-[13px] text-[#555566]">
              If your team repeats documents, cases, or transactions more than
              50 times a week, we map it in 72 hours.
            </div>
          </div>
          <a
            href={BRAND.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold rounded-full bg-[#6666ff] text-white shadow-md shadow-[#6666ff]/25 hover:bg-[#4200ff] hover:shadow-lg hover:shadow-[#4200ff]/35 transition-all duration-200"
          >
            Ask Marc About Your Stack →
          </a>
        </div>
      </div>
    </section>
  )
}
