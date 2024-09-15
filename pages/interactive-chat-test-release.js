import '@fontsource/poppins'
import amplitude from 'amplitude-js'
import Script from 'next/script'
import * as React from 'react'
import ReactGA from 'react-ga'
import { ToastContainer } from 'react-toastify'
// import { FlagsProvider } from '../src/providers/RemoteConfigFirebase/FlagsProvider'
import LandingReleaseTest from '../src/components/NewLanding/release-test'

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
      {/* <MembersSection /> this puts extra margin in the children's for loop in the layout.js */}
      {/* <ExpertSection /> */}
      {/* 🟢 old landing page */}
      {/* <Layout>
        <HeroSection />
        <LeaveToLyRise cards={expertsSection} />
        <TopPartners />
        <HiringType />
        <GoogleStartups />
        <AISection />
        <ForbesSection />
        <FAQSection />
      </Layout> */}
      {/* 🟢 new landing page */}
      <LandingReleaseTest />
      {/* </FlagsProvider> */}
    </>
  )
}
