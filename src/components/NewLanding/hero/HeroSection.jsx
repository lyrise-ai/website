import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'

export default function HeroSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: [0.25, 0.75],
    }

    const handlePlay = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      })
    }

    const observer = new IntersectionObserver(handlePlay, options)

    observer.observe(videoRef.current)

    // return () => {
    //   observer.unobserve(videoRef.current)
    // }
  })

  return (
    // note: overflow was hidden here
    <div className="flex flex-col md:grid grid-cols-9 w-full px-10x relative m-auto md:mb-20 md:max-w-[90rem] gap-10 py-3 md:py-20 max-md:px-5">
      <div className="col-span-4 flex flex-col max-md:text-center md:ml-10 max-md:items-center">
        <h1 className="text-3xl lg:text-7xl font-semibold mb-6 font-primary max-sm:mt-10">
          Hire AI Talent Instantly
        </h1>
        <h3 className="pr-5 mb-6 text-neutral-600 font-secondary text-lg md:text-xl lg:text-2xl font-medium lg:font-primary">
          Our LLM will match you with the top 2% vetted AI engineers in Africa,
          for free.
        </h3>
        <Link href={LYRISEAI_PRODUCT_URL + 'signup'}>
          <button
            className="bg-primary hover:bg-blue-700 py-2 font-secondary rounded-lg text-white text-xl lg:text-2xl px-12 md:px-20 lg:px-32 font-medium w-fit transition-all duration-200"
            type="button"
          >
            Hire now!
          </button>
        </Link>
      </div>
      <div className="col-span-5 border-[12px] bg-[#EFF2FF] border-white rounded-[20px] overflow-hidden md:max-lg:mr-10">
        <video
          id="video"
          preload="metadata" // this will load entire video while page loads
          width="auto"
          poster="hero-vidoe-placeholder.png"
          ref={videoRef}
          loop
          autoPlay
          muted
          playsInline
          className="scale-105"
        >
          <source src="hero-video.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
