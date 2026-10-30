import React, { useState } from 'react'
import { EXECUTIVE_FAQS, BRAND } from './data/verifiedFacts'

/**
 * FaqSection
 *
 * Converted to pure Tailwind CSS:
 * - 2-column sticky sidebar layout
 * - Interactive accordion with verified client proof callouts on every answer
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx)
  }

  return (
    <section className="py-20 md:py-24 px-6 bg-white relative" id="faq">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-start">
          {/* Sticky Left Column */}
          <div className="lg:sticky lg:top-24">
            <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
              Frequently Answered Questions
            </span>
            <h2 className="font-sans text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.18] tracking-tight text-[#000022] mb-3.5">
              Direct Answers to C-Suite Concerns
            </h2>
            <p className="text-[clamp(16px,1.4vw,18px)] text-[#4a4e69] leading-relaxed">
              Everything managing partners, CFOs, and operations leaders ask
              about our guarantee, security, workflow boundaries, and team time
              commitment.
            </p>
            <div className="mt-7">
              <a
                href={BRAND.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold rounded-full border border-[#000022]/15 text-[#000022] hover:bg-[#f7f8f7] transition-all duration-200"
              >
                Have a specific question? Ask Marc →
              </a>
            </div>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-3.5">
            {EXECUTIVE_FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl bg-white overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-[#6666ff]/40 shadow-md shadow-[#6666ff]/5'
                      : 'border-[#000022]/8'
                  }`}
                >
                  <button
                    type="button"
                    className="w-full p-5 md:p-6 border-none bg-transparent flex items-center justify-between text-left text-base font-bold text-[#000022] cursor-pointer gap-4"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`text-xl font-light transition-transform duration-200 ${
                        isOpen ? 'rotate-45 text-[#6666ff]' : 'text-[#888899]'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-[14.5px] text-[#4a4e69] leading-relaxed">
                      <div>{faq.a}</div>
                      <div className="mt-3.5 p-3 md:p-3.5 bg-[#00b8b0]/10 border border-[#00b8b0]/25 rounded-xl text-[13px] font-semibold text-[#007a74] flex items-center gap-2">
                        <span>✓ Verified client proof:</span>
                        <span>{faq.proof}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
