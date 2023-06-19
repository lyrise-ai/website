import * as React from 'react'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import Script from 'next/script'
import Layout from '../src/components/Layout/Layout'
import HeroSection from '../src/components/HeroSection/HeroSection'
import TopPartners from '../src/components/TopPartners/TopPartners'
import FAQSection from '../src/components/FAQSection/FAQSection'
import HeroTalent from '../src/assets/Talent-HeroSection.png'

export default function Index() {
  React.useEffect(() => {
    const scrollToAISection = () => {
      const currentLocation = window.location.href
      const hasAIAnchor = currentLocation.includes('#FAQ')
      if (hasAIAnchor) {
        const anchorAI = document.getElementById('FAQ')
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
      amplitude.getInstance().logEvent('visitedTalentHomePage')
      ReactGA.event({
        category: 'TalentHomePage',
        action: 'visitedTalentHomePage',
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
      />
      <Layout isTalent>
        <HeroSection
          title="Join the top AI. and Data Talents."
          subtitle="Get jobs with the experts on the cutting-edge of deception at the most sinister companies."
          img={HeroTalent}
          isTalent
        />
        <TopPartners />
        <FAQSection />
      </Layout>
    </>
  )
}
