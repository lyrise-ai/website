import React from 'react'
import { COMPARISON_ROWS } from './data/verifiedFacts'

/**
 * CompareSection
 *
 * Converted to pure Tailwind CSS:
 * - 5-way strategic comparison table against headcount, dev shops, big consultancies, and generic copilots
 */
export default function CompareSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-[#f7f8f7] relative" id="compare">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[760px] mx-auto mb-12 text-center">
          <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
            Honest Comparison
          </span>
          <h2 className="font-sans text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.18] tracking-tight text-[#000022] mb-3.5">
            Compare LyRise to Your Other 4 Strategic Options
          </h2>
          <p className="text-[clamp(16px,1.4vw,18px)] text-[#4a4e69] leading-relaxed">
            Most professional services leaders have already evaluated hiring
            more headcount, contracting dev shops, or giving staff generic AI
            seats. Here is the reality.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-[#000022]/8 rounded-2xl overflow-x-auto shadow-xl shadow-[#000022]/3">
          <table className="w-full border-collapse text-[13px] min-w-[850px]">
            <thead>
              <tr>
                <th className="font-mono text-left py-3.5 px-4 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8 w-[22%]">
                  Decision Factor
                </th>
                <th className="font-mono text-left py-3.5 px-4 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8 w-[18%]">
                  Hire More People
                </th>
                <th className="font-mono text-left py-3.5 px-4 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8 w-[18%]">
                  Dev Shop
                </th>
                <th className="font-mono text-left py-3.5 px-4 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8 w-[18%]">
                  Big Consultancy
                </th>
                <th className="font-mono text-left py-3.5 px-4 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8 w-[14%]">
                  ChatGPT / Copilot
                </th>
                <th className="font-mono text-left py-3.5 px-4 bg-[#6666ff]/10 text-[#4200ff] font-bold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8 border-t-[3px] border-t-[#6666ff] w-[20%]">
                  LyRise
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.dimension} className="hover:bg-[#fcfdfe]">
                  <td className="py-4 px-4 border-b border-[#000022]/8 align-middle font-bold text-[#000022]">
                    {row.dimension}
                  </td>
                  <td className="py-4 px-4 border-b border-[#000022]/8 align-middle text-[#555566]">
                    {row.hirePeople}
                  </td>
                  <td className="py-4 px-4 border-b border-[#000022]/8 align-middle text-[#555566]">
                    {row.devShop}
                  </td>
                  <td className="py-4 px-4 border-b border-[#000022]/8 align-middle text-[#555566]">
                    {row.consultancy}
                  </td>
                  <td className="py-4 px-4 border-b border-[#000022]/8 align-middle text-[#777788]">
                    {row.chatgpt}
                  </td>
                  <td className="py-4 px-4 border-b border-[#000022]/8 align-middle bg-[#6666ff]/4 font-bold text-[#000022]">
                    <span className="text-[#008f88]">✓</span> {row.lyrise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
