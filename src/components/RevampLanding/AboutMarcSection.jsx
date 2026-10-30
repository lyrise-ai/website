/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { FOUNDER_DATA } from './data/verifiedFacts'

/**
 * AboutMarcSection
 *
 * Converted to pure Tailwind CSS:
 * - Founder profile portrait and credentials
 * - 3 key metrics (years building, engineers built, capital raised & earned)
 */
export default function AboutMarcSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-[#f7f8f7] relative" id="about">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center">
          {/* Marc's Photo */}
          <div className="text-center">
            <div className="w-56 h-56 md:w-60 md:h-60 rounded-3xl overflow-hidden mx-auto border border-[#000022]/10 shadow-xl shadow-[#000022]/5 bg-[#dfe1df]">
              <img
                src={FOUNDER_DATA.image}
                alt={FOUNDER_DATA.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3.5 text-xs text-[#666677] font-semibold">
              Based in Boston & New York
            </div>
          </div>

          {/* Marc's Bio & Credibility */}
          <div>
            <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2">
              Founder & Leadership
            </span>
            <h3 className="text-2xl md:text-[28px] font-extrabold text-[#000022] my-1 mb-1 tracking-tight">
              {FOUNDER_DATA.name}
            </h3>
            <div className="text-sm text-[#4200ff] font-bold mb-4">
              {FOUNDER_DATA.title}
            </div>

            <p className="text-[15px] text-[#555566] leading-relaxed mb-5">
              {FOUNDER_DATA.bio}
            </p>

            <blockquote className="m-0 italic text-sm text-[#333344] border-l-[3px] border-[#6666ff] pl-3.5 leading-relaxed">
              “Professional services firms don’t need another software
              subscription. They need guaranteed capacity returned so their best
              people can focus on billable client work.”
            </blockquote>

            {/* 3 Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-5 mt-6 border-t border-[#000022]/8">
              <div>
                <div className="font-mono text-2xl md:text-[26px] font-extrabold text-[#000022] leading-none mb-1">
                  {FOUNDER_DATA.yearsBuilding}
                </div>
                <div className="text-xs text-[#777788] font-semibold">
                  Building AI Systems
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl md:text-[26px] font-extrabold text-[#000022] leading-none mb-1">
                  {FOUNDER_DATA.engineersBuilt}
                </div>
                <div className="text-xs text-[#777788] font-semibold">
                  AI Engineers & Leads
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl md:text-[26px] font-extrabold text-[#008f88] leading-none mb-1">
                  {FOUNDER_DATA.capitalRaisedAndEarned}
                </div>
                <div className="text-xs text-[#777788] font-semibold">
                  Raised & Earned
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
