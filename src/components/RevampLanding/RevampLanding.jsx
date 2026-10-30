import React, { useState } from 'react'
import Head from 'next/head'
import RevampHeader from './RevampHeader'
import HeroSection from './HeroSection'
import OperationsShowcaseSection from './OperationsShowcaseSection'
import BackedByStrip from './BackedByStrip'
import WhoItsForSection from './WhoItsForSection'
import ProblemSection from './ProblemSection'
import HowItWorksSection from './HowItWorksSection'
import ResultsSection from './ResultsSection'
import CompareSection from './CompareSection'
import WorkflowCalculator from './WorkflowCalculator'
import PricingSection from './PricingSection'
import GuaranteeBand from './GuaranteeBand'
import FaqSection from './FaqSection'
import AboutMarcSection from './AboutMarcSection'
import BookingCloseSection from './BookingCloseSection'

export default function RevampLanding() {
  const [selectedSegmentId, setSelectedSegmentId] = useState('collections')

  const handleSelectSegment = (id) => {
    setSelectedSegmentId(id)
  }

  const handleSelectWorkflowForCalc = (wfData) => {
    const calcEl = document.getElementById('calculator')
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full min-h-screen bg-white text-[#000022] font-sans antialiased selection:bg-[#6666ff]/20 selection:text-[#000022] [&_[id]]:scroll-mt-[96px]">
      <Head>
        <title>LyRise · Autonomous AI Agents for Professional Services</title>
        <meta
          name="description"
          content="Find the $1M hiding in your team's week. We interview your team, map repeated workflows, and build custom AI agents. Guaranteed 3:1 return or your money back."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Sticky Header */}
      <RevampHeader />

      {/* Hero Section with 2D Builders at Bottom Corners (Matching Sketch) */}
      <HeroSection />

      {/* Operations Showcase Bento Grid (Moved into dedicated section below Hero) */}
      <OperationsShowcaseSection
        activeSegmentId={selectedSegmentId}
        onSelectSegment={handleSelectSegment}
        onSelectWorkflowForCalc={handleSelectWorkflowForCalc}
      />

      {/* Verified Backers & Accelerators Strip */}
      <BackedByStrip />

      {/* 4 Professional Services Segments */}
      <WhoItsForSection onSelectSegment={handleSelectSegment} />

      {/* 58% Work About Work Problem */}
      <ProblemSection />

      {/* How It Works (3 Steps + Joseph 4-Phase Scanner) */}
      <HowItWorksSection />

      {/* Quantrax & NY Legal Proof + 3-Tab Deliverables & Live Video Demo */}
      <ResultsSection />

      {/* 5-Option Comparison Matrix */}
      <CompareSection />

      {/* 60-Second Interactive Workflow Calculator */}
      <section className="py-20 md:py-24 px-6 relative bg-white !pb-8">
        <div className="max-w-[1240px] mx-auto">
          <WorkflowCalculator
            initialPreset={selectedSegmentId}
            onPresetChange={handleSelectSegment}
          />
        </div>
      </section>

      {/* 3-Column Transparent Pricing */}
      <PricingSection />

      {/* 3:1 Guarantee Band */}
      <GuaranteeBand />

      {/* 8-Question Executive FAQ */}
      <FaqSection />

      {/* About Marc Nader & Founder Credibility */}
      <AboutMarcSection />

      {/* Two-Door Close (30-min call or Self-Serve ROI Tool) & Footer */}
      <BookingCloseSection />
    </div>
  )
}
