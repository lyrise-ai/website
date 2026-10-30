import React from 'react'
import { PRICING_TIERS, BRAND } from './data/verifiedFacts'

/**
 * PricingSection
 *
 * Converted to pure Tailwind CSS:
 * - 3 transparent pricing cards with buyer time commitments and deliverable lists
 * - Featured tier callout with 3:1 value guarantee badge
 */
export default function PricingSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white relative" id="pricing">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[760px] mx-auto mb-12 text-center">
          <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
            Simple, Predictable Pricing
          </span>
          <h2 className="font-sans text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.18] tracking-tight text-[#000022] mb-3.5">
            Start Free. Scale Only When the Value is Proven.
          </h2>
          <p className="text-[clamp(16px,1.4vw,18px)] text-[#4a4e69] leading-relaxed">
            No enterprise lock-in. Every paid engagement is backed by our
            written 3:1 Value Guarantee: $3 of verified return for every $1
            invested, or a 100% refund.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {PRICING_TIERS.map((tier) => {
            const isFeatured = tier.id === 'tier-we-build-it'
            return (
              <div
                key={tier.id}
                className={`bg-white border rounded-2xl p-7 md:p-9 flex flex-col justify-between relative transition-all duration-250 hover:-translate-y-1 ${
                  isFeatured
                    ? 'border-[#6666ff] shadow-xl shadow-[#6666ff]/12'
                    : 'border-[#000022]/8 shadow-sm shadow-[#000022]/3 hover:border-[#000022]/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-block font-mono text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        isFeatured
                          ? 'bg-[#6666ff]/15 text-[#4200ff]'
                          : 'bg-[#000022]/6 text-[#555566]'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <span className="text-xs text-[#888899] font-semibold">
                      {tier.buyerTime}
                    </span>
                  </div>

                  <h3 className="text-[22px] font-extrabold text-[#000022] mt-1 mb-0">
                    {tier.name}
                  </h3>

                  <div className="font-mono text-[38px] font-extrabold tracking-tight text-[#000022] my-3 mb-1 leading-none">
                    {tier.price}
                  </div>
                  <div className="text-xs text-[#777788] mb-3.5">
                    {tier.cadence} · {tier.timeline}
                  </div>

                  <p className="text-[13.5px] text-[#555566] leading-relaxed m-0">
                    {tier.oneLiner}
                  </p>

                  {/* Deliverables List */}
                  <ul className="list-none p-0 my-6 mb-8 flex flex-col gap-3">
                    {tier.deliverables.map((d, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-[#555566] leading-relaxed"
                      >
                        <span
                          className={`font-extrabold ${
                            isFeatured ? 'text-[#00b8b0]' : 'text-[#6666ff]'
                          }`}
                        >
                          ✓
                        </span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a
                    href={BRAND.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full font-bold text-sm transition-all duration-200 ${
                      tier.ctaType === 'primary'
                        ? 'bg-[#6666ff] text-white shadow-md shadow-[#6666ff]/25 hover:bg-[#4200ff]'
                        : 'bg-white border border-[#000022]/15 text-[#000022] hover:bg-[#f7f8f7]'
                    }`}
                  >
                    {tier.ctaText}
                  </a>
                  {isFeatured && (
                    <div className="text-center text-[11px] text-[#008f88] font-semibold mt-2">
                      Protected by written 3:1 Value Guarantee
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
