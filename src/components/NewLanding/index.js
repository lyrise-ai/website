import React from 'react'

import Layout from '../Layout/Layout'
import Img from '../Product/Img'
import HowItWorks from './how/How'

import backedby1 from '../../../src/assets/hero/backed-by/1.png'
import backedby2 from '../../../src/assets/hero/backed-by/2.png'
import backedby3 from '../../../src/assets/hero/backed-by/3.png'
import FAQ from './faq'
import HeroSection from './hero/HeroSection'
import Security from './security'
import LandingTestimonials from './testimonials'
import ExpertNetwork from './expert-network/ExpertNetwork'
import Solutions from './solutions/Solutions'

export default function NewLanding() {
  return (
    <Layout isRaw={true}>
      <div className="w-full h-fit new-landing-container">
        <HeroSection />
        <BackedBy />
        <Solutions />
        {/* <HowItWorks /> */}
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

function BackedBy() {
  return (
    <div className="flex flex-col items-center gap-5 w-full overflow-hidden">
      <div className="text-3xl lg:text-4xl font-semibold text-center mb-10 font-primary mt-20">
        Associated With
      </div>
      <div className="flex gap-10 mx-10">
        <div className="h-auto w-1/3">
          <Img src={backedby1} className="" />
        </div>
        <div className="h-auto w-1/3">
          <Img src={backedby2} />
        </div>
        <div className="h-auto w-1/3">
          <Img src={backedby3} />
        </div>
      </div>
    </div>
  )
}
