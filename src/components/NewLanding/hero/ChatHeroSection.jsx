// this is the content of the hero section to re-enable the interactive chat section

import Link from 'next/link'
import React, { useState } from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import { ChatFocusContext } from '../../../providers/ChatFocusContext'
import ArrowButton from '../../Buttons/ArrowButton'
import BotChat from './BotChat'
import PageSection from '@components/NewLanding/section/PageSection'

export default function ChatHeroSection() {
  const [isChatFocused, setIsChatFocused] = useState(false)

  return (
    // note: overflow was hidden here
    <PageSection className="flex flex-col md:grid grid-cols-9 md:max-w-[84rem] w-full relative m-auto gap-10 py-3 md:py-20 max-md:px-5">
      <div className="col-span-4 flex flex-col lg:gap-5 justify-center">
        <h1 className="text-[2.75rem] leading-[2.5rem] lg:text-7xl font-semibold font-primary">
          Adopt AI Easier & Faster
        </h1>
        <h3 className="pr-5 text-neutral-600 font-secondary text-lg md:text-xl lg:text-2xl leading-5 mt-1 lg:font-primary max-md:mb-2">
          Our LLM will match you with the top 2% vetted AI engineers in north
          Africa, for free!
        </h3>
        <Link href={LYRISEAI_PRODUCT_URL + 'signup'} legacyBehavior>
          <ArrowButton
            showArrow
            className="max-md:w-full justify-between font-medium py-3 max-w-fit"
            id="mr2"
          >
            Hire Now!
          </ArrowButton>
        </Link>
      </div>
      <div className="relative col-span-5 md:max-lg:mr-10 h-[40vh] lg:h-[75vh]">
        <div
          className={`absolute transition-all duration-300 ease-in-out top-0 ${
            isChatFocused
              ? 'z-50 h-[50vh] -left-5 -right-5' // as outer container is applying x-padding 5rem
              : 'h-[40vh] lg:h-[75vh] left-0 right-0'
          }`}
        >
          <ChatFocusContext.Provider
            value={{ isChatFocused, setIsChatFocused }}
          >
            <BotChat />
          </ChatFocusContext.Provider>
        </div>
      </div>
    </PageSection>
  )
}
