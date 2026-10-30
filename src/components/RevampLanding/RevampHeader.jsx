import React, { useState } from 'react'
import Link from 'next/link'
import { BRAND } from './data/verifiedFacts'

/**
 * RevampHeader
 *
 * Converted to pure Tailwind CSS:
 * - Pinned frosted navbar with crisp backdrop-blur and opaque tint to prevent scroll bleed
 * - Brand logo & "Results as a Service" badge
 * - Desktop navigation links + Mobile responsive hamburger menu
 * - Dual action CTAs
 */
export default function RevampHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#000022]/10 shadow-sm transition-all duration-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline shrink-0"
        >
          <span className="text-[22px] font-extrabold text-[#000022] tracking-[-0.04em]">
            ly<span className="text-[#6666ff]">Rise</span>
          </span>
          <span className="font-mono text-[9.5px] font-bold text-[#4200ff] bg-[#f0f0ff] border border-[#6666ff]/25 rounded px-2 py-0.5 tracking-wider uppercase hidden sm:inline-block">
            Results as a Service
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7">
          <a
            href="#who"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            Who it’s for
          </a>
          <a
            href="#operations-showcase"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            Live Engine
          </a>
          <a
            href="#how"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            How it works
          </a>
          <a
            href="#results"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            Case Studies
          </a>
          <a
            href="#calculator"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            Calculator
          </a>
          <a
            href="#pricing"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-[14px] font-medium text-[#4a4e69] hover:text-[#6666ff] transition-colors duration-200 whitespace-nowrap"
          >
            FAQ
          </a>
        </nav>

        {/* Right Action CTAs & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#calculator"
            className="hidden sm:inline-flex items-center justify-center text-[13px] sm:text-[13.5px] font-medium text-[#000022] px-4 sm:px-5 py-2.5 border border-[#000022]/15 rounded-full hover:bg-[#000022]/5 hover:border-[#000022]/25 transition-all duration-200 whitespace-nowrap shrink-0"
          >
            Price Workflow
          </a>
          <a
            href={BRAND.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#6666ff] text-white font-semibold text-[13px] sm:text-[13.5px] px-5 sm:px-6 py-2.5 rounded-full shadow-md shadow-[#6666ff]/25 hover:bg-[#4200ff] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4200ff]/35 transition-all duration-200 whitespace-nowrap shrink-0"
          >
            Get Free Profit Map →
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-[#000022] hover:bg-[#000022]/5 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#000022]/10 px-6 py-4 flex flex-col gap-3 shadow-lg">
          <a
            href="#who"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Who it’s for
          </a>
          <a
            href="#operations-showcase"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Live Engine
          </a>
          <a
            href="#how"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </a>
          <a
            href="#results"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Case Studies
          </a>
          <a
            href="#calculator"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Workflow Calculator
          </a>
          <a
            href="#pricing"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing &amp; Guarantee
          </a>
          <a
            href="#faq"
            className="text-[15px] font-medium text-[#4a4e69] py-1 hover:text-[#6666ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </a>
        </div>
      )}
    </header>
  )
}
