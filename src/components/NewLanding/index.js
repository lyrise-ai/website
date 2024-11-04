import React from 'react'

import Layout from '../Layout/Layout'

import FAQ from './faq'
import HeroSection from './hero/HeroSection'
import Security from './security'
import LandingTestimonials from './testimonials'
import ExpertNetwork from './expert-network/ExpertNetwork'
import Solutions from './solutions/Solutions'
import BackedBy from './backed-by'

import HowItWorks, { robHowItWorksConfig } from './how-it-works/HowItWorks'

export default function NewLanding() {
  return (
    <Layout isRaw={true}>
      <div className="w-full h-fit new-landing-container">
        <HeroSection />
        <BackedBy />
        <Solutions />
        <HowItWorks config={robHowItWorksConfig} />
        <ExpertNetwork />
        <Security />
        <LandingTestimonials />
        <FAQ />
        <br />
        <br />
      </div>
    </Layout>
  )
}
