import React from 'react'
import Link from 'next/link'
import { BRAND } from './data/verifiedFacts'

export default function BookingCloseSection() {
  return (
    <>
      <section className="py-20 md:py-24 px-6 relative bg-white" id="book">
        <div className="max-w-[1240px] mx-auto">
          {/* Booking Card */}
          <div className="bg-[#000022] rounded-3xl p-8 sm:p-14 text-white shadow-[0_20px_60px_rgba(0,0,34,0.3)] bg-[radial-gradient(circle_at_20%_20%,rgba(102,102,255,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,184,176,0.18),transparent_50%)]">
            <div className="max-w-[820px] mx-auto text-center">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#6666ff]/20 text-[#b3b3ff] mb-4 border border-[#6666ff]/30">
                Get Started · Zero Risk
              </span>
              <h2 className="text-[clamp(28px,3.6vw,44px)] font-extrabold text-white mb-4 leading-tight">
                Find the $1M Hiding in Your Team’s Week
              </h2>
              <p className="text-base text-[#b0b4c8] leading-relaxed mb-9 max-w-2xl mx-auto">
                In one 30-minute call, we will map your firm’s repeated
                workflows, calculate your Hours Returned live on screen, and
                deliver your free custom AI Profit Map within 72 hours.
              </p>

              {/* 3 Call Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-10">
                <div className="bg-white/[0.07] p-5 sm:p-6 rounded-2xl border border-white/15 backdrop-blur-md flex flex-col justify-start transition-all duration-200 hover:bg-white/[0.1] hover:border-white/25">
                  <div className="text-[11px] font-mono text-[#00b8b0] font-bold tracking-wider uppercase mb-2">
                    Step 01 · 10 min
                  </div>
                  <div className="text-[15px] font-bold text-white mb-1 tracking-tight">
                    Workflow Review
                  </div>
                  <div className="text-[13px] text-[#b0b4c8] leading-relaxed">
                    We examine your top 3 repeated document or case bottlenecks
                  </div>
                </div>

                <div className="bg-white/[0.07] p-5 sm:p-6 rounded-2xl border border-white/15 backdrop-blur-md flex flex-col justify-start transition-all duration-200 hover:bg-white/[0.1] hover:border-white/25">
                  <div className="text-[11px] font-mono text-[#00b8b0] font-bold tracking-wider uppercase mb-2">
                    Step 02 · 10 min
                  </div>
                  <div className="text-[15px] font-bold text-white mb-1 tracking-tight">
                    Live Calculation
                  </div>
                  <div className="text-[13px] text-[#b0b4c8] leading-relaxed">
                    We benchmark Hours Returned against 100+ peer firms
                  </div>
                </div>

                <div className="bg-white/[0.07] p-5 sm:p-6 rounded-2xl border border-white/15 backdrop-blur-md flex flex-col justify-start transition-all duration-200 hover:bg-white/[0.1] hover:border-white/25">
                  <div className="text-[11px] font-mono text-[#00b8b0] font-bold tracking-wider uppercase mb-2">
                    Step 03 · 10 min
                  </div>
                  <div className="text-[15px] font-bold text-white mb-1 tracking-tight">
                    Profit Map Plan
                  </div>
                  <div className="text-[13px] text-[#b0b4c8] leading-relaxed">
                    You receive the board-ready deliverable in 72 hours to keep
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href={BRAND.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#6666ff] hover:bg-[#4200ff] text-white font-semibold text-base rounded-full shadow-[0_4px_18px_rgba(102,102,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(66,0,255,0.5)] transition-all duration-200"
                >
                  Book Your 30-Minute AI Profit Map Session!
                </a>

                <Link
                  href="/roi-report"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-[15px] rounded-full border border-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Or Run Self-Serve Tool →
                </Link>
              </div>

              <div className="text-xs text-[#8888aa] mt-4">
                No sales pitch · Zero obligation · Handled directly by LyRise
                senior AI leadership
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Page Footer at the Bottom */}
      <footer className="w-full bg-[#f7f8f7] border-t border-[#000022]/10">
        <div className="max-w-[1240px] mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 md:gap-10">
            <div>
              <span className="text-2xl font-black text-[#000022] tracking-tight">
                ly<span className="text-[#6666ff]">Rise</span>
              </span>
              <p className="text-[13.5px] text-[#555566] my-3 max-w-[320px] leading-relaxed">
                The AI Operations System for mid-market professional services.
                Find your workflows, deploy custom agents, and secure guaranteed
                profit uplift.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#6666ff]/10 text-[#4200ff] border border-[#6666ff]/20">
                Results as a Service · SOC-2 Ready
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#000022] mb-3.5 uppercase tracking-wider">
                Navigation
              </div>
              <div className="flex flex-col gap-2 text-[13.5px]">
                <a
                  href="#who"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Who It’s For
                </a>
                <a
                  href="#how"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#results"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Case Studies
                </a>
                <a
                  href="#calculator"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Workflow Calculator
                </a>
                <a
                  href="#pricing"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Pricing & Guarantee
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#000022] mb-3.5 uppercase tracking-wider">
                Firm Solutions
              </div>
              <div className="flex flex-col gap-2 text-[13.5px]">
                <a
                  href="#who"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Law Firms
                </a>
                <a
                  href="#who"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Accounting & Advisory
                </a>
                <a
                  href="#who"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Consultancies
                </a>
                <a
                  href="#who"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Collections & Financial
                </a>
                <Link
                  href="/roi-report"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Live Profit Map Tool
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#000022] mb-3.5 uppercase tracking-wider">
                Leadership
              </div>
              <div className="flex flex-col gap-2 text-[13.5px]">
                <a
                  href="#about"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Marc Nader (Founder)
                </a>
                <a
                  href="https://blog.lyrise.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Our Blog
                </a>
                <a
                  href={BRAND.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#555566] hover:text-[#000022] transition-colors"
                >
                  Schedule Call
                </a>
                <span className="text-xs text-[#888899] mt-1.5">
                  Boston · New York
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#000022]/10 flex flex-wrap items-center justify-between text-xs text-[#8c909e] gap-4">
            <div>
              © {new Date().getFullYear()} LyRise Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-5">
              <a
                href="#faq"
                className="text-xs text-[#8c909e] hover:text-[#000022] transition-colors"
              >
                Security & VPC
              </a>
              <a
                href="#guarantee"
                className="text-xs text-[#8c909e] hover:text-[#000022] transition-colors"
              >
                3:1 Guarantee Terms
              </a>
              <a
                href="#book"
                className="text-xs text-[#8c909e] hover:text-[#000022] transition-colors"
              >
                Contact Leadership
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
