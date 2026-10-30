import React from 'react'
import { BRAND } from './data/verifiedFacts'

/**
 * GuaranteeBand
 *
 * Converted to pure Tailwind CSS:
 * - 3:1 written guarantee contract commitment
 * - 3-step proof breakdown (Formula, 16 Buyer Hours, Month 3 Wire Refund)
 */
export default function GuaranteeBand() {
  return (
    <div className="max-w-[1240px] mx-auto px-6" id="guarantee">
      <div className="bg-[#000022] bg-[radial-gradient(circle_at_50%_50%,rgba(0,184,176,0.18),transparent_60%)] text-white py-14 px-6 md:px-12 rounded-3xl my-10 max-w-[1240px] mx-auto text-center shadow-2xl relative overflow-hidden">
        <span className="inline-block font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#00b8b0]/20 text-[#00b8b0] mb-4 uppercase tracking-wider">
          {BRAND.guaranteeBadge}
        </span>
        <h2 className="text-[clamp(26px,3.2vw,38px)] font-extrabold text-white mb-4 tracking-tight">
          $3 of Verified Value for Every $1 You Invest. Or Your Money Back.
        </h2>
        <p className="text-base text-[#b0b4c8] max-w-[720px] mx-auto mb-9 leading-relaxed">
          We don’t ask you to trust AI hype. We agree on the measurement formula
          in your initial Profit Map, calculate the baseline hours, and audit
          the return in writing in Month 3.
        </p>

        {/* 3 Step Guarantee Path */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-[960px] mx-auto mb-9">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <div className="text-xs text-[#00b8b0] font-bold mb-1.5 uppercase tracking-wider">
              01 · The Formula
            </div>
            <div className="text-sm font-bold text-white mb-1">
              Agreed in Writing Upfront
            </div>
            <div className="text-[12.5px] text-[#8f94a8] leading-relaxed">
              Hours Returned × Your Team’s Loaded Hourly Rate. Zero fuzzy
              metrics or vanity counts.
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <div className="text-xs text-[#00b8b0] font-bold mb-1.5 uppercase tracking-wider">
              02 · The Commitment
            </div>
            <div className="text-sm font-bold text-white mb-1">
              16 Total Team Hours
            </div>
            <div className="text-[12.5px] text-[#8f94a8] leading-relaxed">
              If we require more than 16 hours of your team’s time to reach
              launch, we pay you for the extra hours.
            </div>
          </div>

          <div className="bg-white/5 border border-[#00b8b0]/35 p-5 rounded-2xl">
            <div className="text-xs text-[#00b8b0] font-bold mb-1.5 uppercase tracking-wider">
              03 · The Audit
            </div>
            <div className="text-sm font-bold text-white mb-1">
              Month 3 Value Check
            </div>
            <div className="text-[12.5px] text-[#8f94a8] leading-relaxed">
              If verified value is under 3:1 on your spend, you receive an
              immediate wire refund of the difference.
            </div>
          </div>
        </div>

        <a
          href={BRAND.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center py-3.5 px-8 rounded-full font-bold text-[15px] bg-[#6666ff] text-white shadow-lg shadow-[#6666ff]/30 hover:bg-[#4200ff] hover:shadow-xl hover:shadow-[#4200ff]/40 transition-all duration-200"
        >
          Claim Your 3:1 Guaranteed AI Profit Map!
        </a>
      </div>
    </div>
  )
}
