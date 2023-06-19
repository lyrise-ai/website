import * as React from 'react'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import Script from 'next/script'
import ForbesSection from '../src/components/ForbesSection/ForbesSection'
import Layout from '../src/components/Layout/Layout'
import AISection from '../src/components/AISection/AISection'
import GoogleStartups from '../src/components/GoogleStartups/GoogleStartups'
import HiringType from '../src/components/HiringType/HiringType'
import HeroSection from '../src/components/HeroSection/HeroSection'
import TopPartners from '../src/components/TopPartners/TopPartners'
import FAQSection from '../src/components/FAQSection/FAQSection'
import {
  heroSection,
  expertsSection,
  aiSection,
} from '../src/constants/dataScientists'
import LeaveToLyRise from '../src/components/LeaveToLyRise/LeaveToLyRise'

export default function DataScientists() {
  React.useEffect(() => {
    const scrollToAISection = () => {
      const currentLocation = window.location.href
      const hasAIAnchor = currentLocation.includes('#hire-your-talent')
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
      amplitude.getInstance().logEvent('visitedEmployerHomePage-DataScientists')
      ReactGA.event({
        category: 'DataScientists',
        action: 'visitedEmployerHomePage-DataScientists',
      })
      // window.dataLayer.push({
      //   event: 'hubspot_employer_visit',
      //   eventProps: {
      //     category: 'page',
      //     action: 'visit',
      //     label: 'hubspot_employer_visit',
      //     value: 'visit',
      //   },
      // })
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
      <Layout>
        <HeroSection
          title={heroSection.title}
          subtitle={heroSection.subtitle}
          img={heroSection.img}
        />
        <LeaveToLyRise cards={expertsSection} />
        <TopPartners />
        <HiringType />
        <GoogleStartups />
        <AISection
          title={aiSection.title}
          subtitle={aiSection.subtitle}
          steps={aiSection.steps}
          img={aiSection.img}
        />
        <ForbesSection />
        <FAQSection />
      </Layout>
    </>
  )
}
