import React from 'react'

import Layout from '../Layout/Layout'
import HeroSection from './hero/HeroSection'
import HowItWorks from './how/How'
import Img from '../Product/Img'

import backedby1 from '../../../src/assets/hero/backed-by/1.png'
import backedby2 from '../../../src/assets/hero/backed-by/2.png'
import backedby3 from '../../../src/assets/hero/backed-by/3.png'
import Logos from './logos'
import UseCases from './use-cases/UseCases'
import Security from './security'
import LandingTestimonials from './testimonials'
import FAQ from './faq'
import LLMs from './llms'

export default function NewLanding() {
  return (
    <Layout isRaw={true}>
      {/* <Img src={background} className="w-screen h-fit object-cover absolute top-0 left-0" /> */}
      <div className="w-full h-fit new-landing-container">
        <HeroSection />
        <LLMs />
        <BackedBy />
        <HowItWorks />
        {/* <div className='bg-white h-[50vh]'>

                    <PartnersSlider />
                </div> */}
        <Logos />
        <UseCases />
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
        LyRise is backed by
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
