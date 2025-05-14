import React, { createContext } from 'react'
import Hero from '../Sections/Hero'
import ChatAi from '../Sections/ChatAi'
import Process from '../Sections/Process'
import LogosMarquee from '../Sections/LogosMarquee'
import ExpertsNetwork from '../Sections/ExpertsNetwork'
import WhyLyRise from '../Sections/WhyLyRise'
import DataSecurity from '../Sections/DataSecurity'
import { PageBuilderContext } from '../../../context/PageBuilderContext'

function HireAiPage({ siteContent }) {
  return (
    <>
      <PageBuilderContext.Provider value={{ siteContent }}>
        <Hero />
        <ChatAi />
        <Process />
        <LogosMarquee />
        <ExpertsNetwork />
        <WhyLyRise />
        <DataSecurity />
      </PageBuilderContext.Provider>
    </>
  )
}

export default HireAiPage
