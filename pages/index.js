import * as React from 'react'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import '@fontsource/poppins'
import ForbesSection from '../src/components/ForbesSection/ForbesSection'
import Layout from '../src/components/Layout/Layout'
import AISection from '../src/components/AISection/AISection'
import GoogleStartups from '../src/components/GoogleStartups/GoogleStartups'
import HiringType from '../src/components/HiringType/HiringType'
import HeroSection from '../src/components/HeroSection/HeroSection'
import TopPartners from '../src/components/TopPartners/TopPartners'
import FAQSection from '../src/components/FAQSection/FAQSection'
import LeaveToLyRise from '../src/components/LeaveToLyRise/LeaveToLyRise'
import { expertsSection } from '../src/constants/main'
// import { FlagsProvider } from '../src/providers/RemoteConfigFirebase/FlagsProvider'

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
    <>
      <Script
        type="text/javascript"
        id="hs-script-loader"
        async
        src="//js.hs-scripts.com/8514634.js"
        strategy="lazyOnload"
      />
      <ToastContainer />
      {/* <FlagsProvider> */}
      <Layout>
        <HeroSection />
        {/* <MembersSection /> this puts extra margin in the children's for loop in the layout.js */}
        {/* <ExpertSection /> */}
        <LeaveToLyRise cards={expertsSection} />
        <TopPartners />
        <HiringType />
        <GoogleStartups />
        <AISection />
        <ForbesSection />
        <FAQSection />
        <div>This page is under maintenance ⚙️ </div>
      </Layout>
      {/* </FlagsProvider> */}
    </>
  )
}
