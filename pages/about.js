import Script from 'next/script'
import { useEffect } from 'react'
import HeroSection from '../src/components/AboutComponents/HeroSection'
import MissionSection from '../src/components/AboutComponents/MissionSection'
import ValuesSection from '../src/components/AboutComponents/ValuesSection'
import EthosSection from '../src/components/AboutComponents/EthosSection'
import MilestonesSection from '../src/components/AboutComponents/MilestonesSection'
import FounderSection from '../src/components/AboutComponents/FounderSection'
import Header from '../src/components/Layout/Header/Header'
import Footer from '../src/components/Layout/Footer/Footer'
import SocialImpact from '../src/components/AboutComponents/SocialImpact'
import { carouselItems } from '../src/constants/aboutConstants'

export default function About() {
  useEffect(() => {
    document.body.style.backgroundColor = '#F5F7FF'
  }, [])
  return (
    <>
      {/* <Script
        type="text/javascript"
        id="hs-script-loader"
        async
        src="//js.hs-scripts.com/8514634.js"
      /> */}
      <Header isTalent={false} />
      <MissionSection />
      <HeroSection />
      <ValuesSection />
      <EthosSection />
      <MilestonesSection />
      <SocialImpact items={carouselItems} />
      <FounderSection />
      <Footer isTalent={false} />
    </>
  )
}
