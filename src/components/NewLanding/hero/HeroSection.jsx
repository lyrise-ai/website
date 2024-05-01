import React from 'react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    // note: overflow was hidden here
    <div className="flex flex-col md:grid grid-cols-9 w-full px-10x relative m-auto md:mb-20 md:max-w-[90rem] gap-10 py-3 md:py-20 max-md:px-5">
      <div className="col-span-4 flex flex-col max-md:text-center md:ml-10 max-md:items-center">
        <h1 className="text-3xl lg:text-7xl font-semibold mb-6 font-primary max-sm:mt-10">
          Build AI Teams Faster
        </h1>
        <h3 className="pr-5 mb-6 text-neutral-600 font-secondary max-md:text-sm font-semibold lg:font-primary">
          A recruitment toold to instantly match with your required candidate.
          Database curated from a pool of pre-vetted, top notch profiles. AI has
          many perks, we are just unlocking a door to them for you.
        </h3>
        <Link href="/lyriseAI-beta">
          <button
            className="bg-primary hover:bg-blue-700 py-2 font-secondary rounded-lg text-white text-lg px-12 md:px-32 font-semibold w-fit transition-all duration-200"
            type="button"
          >
            Join Our Beta!
          </button>
        </Link>
      </div>
      <div className="col-span-5 border-[12px] bg-[#EFF2FF] border-white rounded-[20px] overflow-hidden">
        <video
          id="video"
          preload="metadata" // this will load entire video while page loads
          width="auto"
          poster="hero-vidoe-placeholder.png"
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
