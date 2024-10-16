import Link from 'next/link'
import React, { useState } from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import ArrowButton from '../../Buttons/ArrowButton'
import Video from './Video'

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  const handleToggleVideo = () => {
    setShowVideo((prevShowVideo) => !prevShowVideo)
  }

  return (
    // note: overflow was hidden here
    <div className="flex flex-col md:grid grid-cols-9 w-full relative mx-auto md:mb-20 md:max-w-[84rem] gap-10 max-md:px-5 h-[calc(100vh-13rem)]">
      <div
        data-show-video={showVideo}
        className="flex flex-col lg:gap-5 justify-center col-span-4 max-w-2xl mx-auto data-[show-video=false]:col-span-9 data-[show-video=false]:text-center data-[show-video=false]:items-center"
      >
        <h1 className="text-5xl lg:text-7xl font-semibold font-primary max-sm:mt-10">
          Hire AI Talent Instantly
        </h1>
        <h3 className="pr-5 text-neutral-600 font-secondary text-lg md:text-xl lg:text-2xl lg:font-primary max-md:mb-2">
          Our LLM will match you with the top 2% vetted AI engineers in north
          Africa, for free!
        </h3>
        <div className="flex gap-5">
          {showVideo ? null : (
            <ArrowButton
              showArrow
              variant="secondary"
              onClick={handleToggleVideo}
            >
              Watch Demo
            </ArrowButton>
          )}
          <Link href={LYRISEAI_PRODUCT_URL + 'signup'}>
            <ArrowButton
              showArrow
              className="max-md:w-full justify-between font-medium py-3 max-w-fit"
            >
              Try It Now!
            </ArrowButton>
          </Link>
        </div>
      </div>
      {showVideo && (
        <div className="col-span-5 border-[12px] bg-[#EFF2FF] border-white rounded-[20px] overflow-hidden md:max-lg:mr-10 my-auto">
          <Video />
        </div>
      )}
    </div>
  )
}
