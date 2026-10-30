import React from 'react'
import { BRAND } from './data/verifiedFacts'
import HeroDotMatrixSimulationCanvas from './HeroDotMatrixSimulationCanvas'

/**
 * HeroSection
 *
 * Unified Dot-Matrix / LED Halftone Simulation Hero (Kindred Design System):
 * - Live HTML5 canvas rendering with DPR scaling
 * - Horizontal scanline rows of dots (`rowStep = step * 2.05`)
 * - Discrete quantized LED dot radii with pinpoint highlights
 * - Copy Quiet Zone: Elliptic fade mask keeping text & CTAs crystal legible
 * - Unified real autonomous robots & stepped construction simulation
 * - Kindred-inspired black pill CTA with chromatic rainbow underglow
 */
export default function HeroSection({ onAgentInteract }) {
  return (
    <section
      className="relative min-h-[100svh] w-full flex flex-col items-center px-4 sm:px-6 pt-28 sm:pt-24 md:pt-28 pb-8 md:pb-14 bg-[#f7f7f5] overflow-hidden"
      id="top"
    >
      {/* Full-Viewport Dot-Matrix LED Simulation Canvas */}
      <HeroDotMatrixSimulationCanvas onAgentInteract={onAgentInteract} />

      {/* Centered Content Container - Shifted down on mobile to sit centrally above the foundation simulation */}
      <div className="max-w-[1000px] w-full mx-auto flex flex-col items-center text-center relative z-20 pt-8 sm:pt-4 pb-4 md:pb-10">
        {/* Release Badge (Interactive Link to Operations Showcase Flow) - Strictly 1 Line */}
        <a
          href="#operations-showcase"
          className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 bg-white/90 backdrop-blur-sm border border-[#000022]/10 rounded-full mb-5 sm:mb-6 text-[11.5px] sm:text-[12.5px] md:text-[13px] font-medium text-[#4200ff] hover:bg-white hover:border-[#6666ff]/45 transition-all duration-200 cursor-pointer shadow-xs whitespace-nowrap max-w-full overflow-hidden"
        >
          <span className="shrink-0 font-mono text-[9px] sm:text-[10px] font-bold text-white bg-[#0d0d0d] px-1.5 sm:px-2 py-0.5 rounded-full tracking-wider group-hover:bg-[#4200ff] transition-colors">
            NEW
          </span>
          <span className="text-[#000022] font-semibold truncate sm:overflow-visible">
            Autonomous AI Operations for Professional Services
          </span>
          <span className="shrink-0 text-xs text-[#6666ff] font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            ↗
          </span>
        </a>

        {/* Commanding Headline across strictly two lines */}
        <h1 className="font-sans text-[clamp(21px,5.4vw,56px)] font-black sm:font-extrabold leading-[1.16] tracking-[-0.035em] text-[#000022] mx-auto mb-4 sm:mb-6 max-w-[1000px] w-full">
          <span className="block whitespace-nowrap">
            Find the $1M hiding in your team’s week.
          </span>
          <span className="block whitespace-nowrap">
            Then let AI agents go and{' '}
            <span className="relative inline-block pb-1">
              get it.
              <span className="absolute -bottom-2.5 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-[#6666ff] to-[#00b8b0] shadow-[0_2px_10px_rgba(102,102,255,0.4)]" />
            </span>
          </span>
        </h1>

        {/* Executive Subhead */}
        <p className="text-[15px] sm:text-[17px] md:text-[19.5px] text-[#4a4e69] leading-relaxed mx-auto mb-6 sm:mb-8 max-w-[740px] px-2 sm:px-0">
          We map repeated workflows and deploy custom AI agents inside your
          existing stack with an audited 3:1 written guarantee or your money
          back.
        </p>

        {/* High-Contrast Dual CTAs with Unique ID for Precision Canvas Tracking */}
        <div
          id="hero-cta-group"
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-5 sm:mb-6 w-full sm:w-auto"
        >
          {/* Primary CTA with LyRise Signature Aurora Underglow */}
          <div className="relative group inline-block w-full sm:w-auto">
            <span
              className="absolute left-[6%] right-[6%] -bottom-1.5 h-4 rounded-full bg-gradient-to-r from-[#6666ff] via-[#4200ff] to-[#00b8b0] blur-[12px] opacity-75 group-hover:opacity-100 group-hover:blur-[16px] group-hover:-bottom-2.5 transition-all duration-300 pointer-events-none"
              aria-hidden="true"
            />
            <a
              href={BRAND.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6666ff] text-white font-semibold text-[15px] sm:text-[15.5px] px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-[0_4px_20px_rgba(102,102,255,0.38)] hover:bg-[#4200ff] hover:-translate-y-0.5 hover:shadow-[0_6px_26px_rgba(66,0,255,0.48)] transition-all duration-200"
            >
              Get Free Profit Map <span className="text-sm">→</span>
            </a>
          </div>

          <a
            href="#calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border border-[#000022]/15 text-[#000022] font-semibold text-[15px] sm:text-[15.5px] px-6 sm:px-7 py-3.5 sm:py-4 rounded-full shadow-sm hover:bg-white hover:border-[#000022]/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            Price One Workflow in 60s
          </a>
        </div>

        {/* Executive Proof Indicators: Grounds the hero with proof and kills sparse empty space */}
        <div className="inline-flex items-center justify-center flex-wrap gap-x-5 sm:gap-x-7 gap-y-2 text-[12px] sm:text-[13px] font-medium text-[#64748b] pt-1">
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#00b8b0] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <strong className="text-[#000022] font-semibold">
              3:1 Audited ROI Guarantee
            </strong>
          </span>
          <span className="hidden sm:inline text-[#cbd5e1]">•</span>
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#6666ff] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Live in 14 Days</span>
          </span>
          <span className="hidden sm:inline text-[#cbd5e1]">•</span>
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#00b8b0] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Zero Stack Disruption</span>
          </span>
        </div>
      </div>
    </section>
  )
}
