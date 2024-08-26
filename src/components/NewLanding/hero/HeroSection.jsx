import Link from 'next/link'
import React from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import BotChat from './BotChat'
import ArrowButton from '../../Buttons/ArrowButton'

export default function HeroSection() {
  return (
    // note: overflow was hidden here
    <div className="flex flex-col md:grid grid-cols-9 w-full px-10x relative m-auto md:mb-20 md:max-w-[90rem] gap-10 py-3 md:py-20 max-md:px-5">
      <div className="col-span-4 flex flex-col lg:gap-5 md:ml-10 justify-center">
        <h1 className="text-5xl lg:text-7xl font-semibold  font-primary max-sm:mt-10">
          Hire AI Talent Instantly
        </h1>
        <h3 className="pr-5 text-neutral-600 font-secondary text-lg md:text-xl lg:text-2xl font-medium lg:font-primary">
          Our LLM will match you with the top 2% vetted AI engineers in Africa,
          for free.
        </h3>
        <Link href={LYRISEAI_PRODUCT_URL + 'signup'}>
          <ArrowButton>
            Hire Now!
          </ArrowButton>
        </Link>
      </div>
      <div className="col-span-5 md:max-lg:mr-10 h-[40vh] lg:h-[75vh]">
        <BotChat />
      </div>
    </div>
  )
}
