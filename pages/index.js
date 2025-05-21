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
      <AcceleratorPromo />
      <HeroSection />
      <LogoSection />
      <PlugnHireSection />
    </MainLayout>
  )
}
