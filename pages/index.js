import '@fontsource/poppins'
import amplitude from 'amplitude-js'
import Script from 'next/script'
import * as React from 'react'
import ReactGA from 'react-ga'
import NewLanding from '../src/components/NewLanding'
import MainLayout from '../src/layout'
import HeroSection from '../src/components/MainLandingPage/HeroSection'
import AcceleratorPromo from '../src/components/NewLanding/accelerator-promo'
import LogoSection from '../src/components/MainLandingPage/LogoSection'
import PlugnHireSection from '../src/components/MainLandingPage/PlugnHireSection'
import VideoSection from '../src/components/MainLandingPage/VideoSection'
import LogosMarquee from '../src/components/MainLandingPage/LogosMarquee'
import HowItWorksSection from '../src/components/MainLandingPage/HowItWorksSection'
import OurGuarantee from '../src/components/MainLandingPage/OurGuarantee'
import OurExperts from '../src/components/MainLandingPage/OurExperts'
import MediaEvents from '../src/components/MainLandingPage/MediaEvents'
import CaseStudies from '../src/components/MainLandingPage/CaseStudies'
import LastSection from '../src/components/MainLandingPage/LastSection'
import NewTestimonials from '../src/components/MainLandingPage/NewTestimonials'
import OurProcess from '../src/components/MainLandingPage/OurProcess'
import AiAgents from '../src/components/MainLandingPage/AiAgents'
import ROICalculator from '../src/components/MainLandingPage/ROICalculator'

export default function Index() {
  React.useEffect(() => {
    const scrollToAISection = () => {
      const currentLocation = window.location.href
      const hasAIAnchor = currentLocation.includes('#hire-your-talent')
      const hasFAQ = currentLocation.includes('#FAQ')
      if (hasFAQ) {
        const FAQElement = document.getElementById('FAQ')
        if (FAQElement) {
          FAQElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
      if (hasAIAnchor) {
        const anchorAI = document.getElementById('ai-section')
        if (anchorAI) {
          anchorAI.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    scrollToAISection()
  }, [])

  React.useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_ENV === 'production' &&
      typeof window !== 'undefined'
    ) {
      amplitude.getInstance().logEvent('visitedEmployerHomePage')
      ReactGA.event({
        category: 'MainLandingPage',
        action: 'visitedEmployerHomePage',
      })
    }
  }, [])

  return (
    <MainLayout>
      {/* <AcceleratorPromo /> */}
      {/* <PlugnHireSection /> */}
      {/* <LogoSection /> */}
      {/* <VideoSection /> */}
      <HeroSection />
      <div className="flex flex-col gap-10 sm:gap-[5vh] md:gap-[10vh]">
        <LogosMarquee />
        <HowItWorksSection />
        <OurProcess />
        <AiAgents />
        <OurGuarantee />
        {/* <ROICalculator /> */}
        <CaseStudies />
        <OurExperts />
        <MediaEvents />
        <NewTestimonials />
        <LastSection />
      </div>
    </MainLayout>
  )
}
