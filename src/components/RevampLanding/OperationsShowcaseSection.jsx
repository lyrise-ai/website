import React from 'react'
import HeroAgentCanvas from './HeroAgentCanvas'

/**
 * OperationsShowcaseSection
 *
 * Styled with Tailwind CSS according to LyRise Design System:
 * - 96px standard section padding (py-16 md:py-24)
 * - Executive eyebrow, headline, and subhead framing the operations bento grid
 * - Clear anchor id with scroll margin to prevent header overlap
 */
export default function OperationsShowcaseSection({
  activeSegmentId,
  onSelectSegment,
  onSelectWorkflowForCalc,
}) {
  return (
    <section
      className="relative w-full bg-white px-6 py-16 md:py-20 lg:py-24 overflow-hidden border-b border-[#000022]/6 scroll-mt-24"
      id="operations-showcase"
    >
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-12">
          <div className="font-mono text-[11px] md:text-xs font-bold text-[#6666ff] uppercase tracking-[0.14em] mb-3">
            {'// 01 LIVE OPERATIONS ENGINE'}
          </div>
          <h2 className="font-sans text-[clamp(26px,3.2vw,40px)] font-extrabold text-[#000022] tracking-[-0.03em] leading-[1.18] mb-4">
            Watch How Autonomous Agents Execute In Real Time
          </h2>
          <p className="text-[15px] md:text-[17px] text-[#4a4e69] leading-relaxed">
            Select an industry below to see how LyRise intercepts repetitive
            manual workflows, enforces zero-drift compliance gates, and delivers
            verified financial gain.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="w-full">
          <HeroAgentCanvas
            activeSegmentId={activeSegmentId}
            onSelectSegment={onSelectSegment}
            onSelectWorkflowForCalc={onSelectWorkflowForCalc}
          />
        </div>
      </div>
    </section>
  )
}
