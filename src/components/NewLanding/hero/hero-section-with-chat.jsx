// this is the content of the hero section to re-enable the interactive chat section

import Link from 'next/link'
import React, { useState } from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import { ChatFocusContext } from '../../../providers/ChatFocusContext'
import ArrowButton from '../../Buttons/ArrowButton'
import BotChat from './BotChat'

export default function HeroSection() {
  const [isChatFocused, setIsChatFocused] = useState(false)

  return (
    // note: overflow was hidden here
    <div className="flex flex-col md:grid grid-cols-9 w-full relative m-auto md:mb-20 md:max-w-[84rem] gap-10 py-3 md:py-20 max-md:px-5">
      <div className="col-span-4 flex flex-col lg:gap-5 justify-center">
        <h1 className="text-5xl lg:text-7xl font-semibold font-primary max-sm:mt-10">
          Helping SMEs Adopt AI Easier and Faster
        </h1>
        <h3 className="pr-5 text-neutral-600 font-secondary text-lg md:text-xl lg:text-2xl font-medium lg:font-primary max-md:mb-2">
          Unlocking AI for 1 Million Businesses
        </h3>
        <Link href={LYRISEAI_PRODUCT_URL + 'signup'}>
          <ArrowButton
            showArrow
            className="max-md:w-full justify-between font-medium py-3 max-w-fit"
          >
            Try Now!
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
    </div>
  )
}