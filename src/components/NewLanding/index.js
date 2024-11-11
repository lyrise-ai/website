import React from 'react'

import Layout from '../Layout/Layout'

import FAQ from './faq'
import ChatHeroSection from './hero/ChatHeroSection'
import Security from './security'
import LandingTestimonials from './testimonials'
import ExpertNetwork from './expert-network/ExpertNetwork'
import Solutions from './solutions/Solutions'
import BackedBy from './backed-by'

import HowItWorks, { robHowItWorksConfig } from './how-it-works/HowItWorks'
import AcceleratorPromo from './accelerator-promo'

export default function NewLanding() {
  return (
    <Layout isRaw={true}>
      <div className="w-full h-fit new-landing-container">
        <AcceleratorPromo />
        <ChatHeroSection />
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
