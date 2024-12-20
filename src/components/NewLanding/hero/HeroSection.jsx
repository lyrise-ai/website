import Link from 'next/link'
import React, { useState } from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import ArrowButton from '../../Buttons/ArrowButton'
import Video from './Video'
import PageSection from '@components/NewLanding/section/PageSection'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    // note: overflow was hidden here
    <PageSection className="flex flex-col md:grid grid-cols-9 w-full relative mx-auto md:mb-20 md:max-w-[84rem] gap-10 max-md:px-5 h-[calc(100vh-13rem)]">
      <div
        data-show-video={true}
        className="group flex flex-col lg:gap-5 justify-center col-span-4 max-w-2xl md:max-w-4xl mx-auto transition-all data-[show-video=false]:col-span-9 data-[show-video=false]:text-center data-[show-video=false]:items-center max-md:data-[show-video=false]:my-auto"
      >
        <h1 className="text-5xl lg:text-7xl font-semibold font-primary max-sm:mt-10">
          Build AI Easier & Faster
        </h1>
        <h3 className="pr-5 text-neutral-600 font-secondary text-lg md:text-xl lg:text-2xl lg:font-primary max-md:mb-2">
          The platform for companies to adopt AI easier and faster
        </h3>
        <div className="flex gap-5 max-md:flex-col max-md:w-full">
          <Link href={LYRISEAI_PRODUCT_URL + 'signup'} legacyBehavior>
            <ArrowButton
              showArrow
              className="max-md:w-full justify-between font-medium py-3 max-w-fit group-data-[show-video=false]:mx-auto"
            >
              Try It Now!
            </ArrowButton>
          </Link>
        </div>
      </div>
      <motion.div
        data-show-video={true}
        className="col-span-5 border-[12px] bg-[#EFF2FF] border-white rounded-[20px] overflow-hidden md:max-lg:mr-10 my-auto hidden data-[show-video=true]:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Video isShown={true} />
      </motion.div>
    </PageSection>
  )
}
