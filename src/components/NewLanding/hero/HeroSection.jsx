import React from 'react'
import ItemsVault from './ItemsVault'
import Link from 'next/link'

export default function HeroSection() {
  return (
    // note: overflow was hidden here
    <div className="flex flex-col md:grid grid-cols-3 w-full px-10x relative m-auto mx-10x mb-20">
      <div className="col-span-1 flex flex-col justify-center max-md:text-center md:ml-10 lg:ml-32 max-md:max-w-[80vw] max-md:m-auto max-md:items-center">
        <h1 className="text-3xl lg:text-5xl font-semibold mb-6 font-primary max-sm:mt-10">
          Unlock A.I for your Business
        </h1>
        <h3 className="pr-5 mb-6 text-neutral-600 font-secondary max-md:text-sm max-md:font-semibold lg:font-primary">
          Find the perfect candidate for your team and hire the top AI and data
          talent from a pool of top notch profiles.
        </h3>
        <div className="border-[12px] bg-[#EFF2FF] border-white rounded-[20px] max-md:mr-0 p-4 flex flex-col gap-3 w-fit max-w-[425px]">
          {/* First Landing Page launch content - Deprecated */}
          {/* <div className="font-secondary text-[1.1rem] font-semibold">
            Are you in another industry?
          </div>
          <select className="font-secondary text-sm p-2 text-gray-300 rounded border border-gray-300">
            <option selected disabled>
              Select your industry...
            </option>
            <option>Education</option>
            <option>Marketing & Advertising</option>
            <option>Telecommunications</option>
            <option>Entertainment & media</option>
            <option>Insurance</option>
          </select>
          <a
            className="w-full"
            href="https://meetings.hubspot.com/sales-lyrise"
          >
            <button
              className="bg-blue-500 p-3 py-2 text-[1.2rem] font-secondary text-white font-bold rounded-md w-full"
              type="button"
            >
              Book Free Consultation
            </button>
          </a> */}

          {/* LyriseAI Launch  */}
          <h3 className="text-xl md:text-2xl max-sm:text-center flex font-secondary text-[#1C1C1C] relative">
            We&apos;re Launching LyriseAI
            <sup className="text-xs rounded-lg bg-cyan-100 text-cyan-600 px-1 py-0.5 ml-2 font-normal h-fit absolute top-0 right-0">
              Beta
            </sup>
          </h3>

          <p className="w-full text-base text-left   font-secondary text-[#475467]">
            LyRiseAI is our proprietary chat interface to find AI talents by
            chatting with our LLM!
          </p>

          <button
            className="bg-primary py-2 font-secondary rounded-lg text-white text-lg"
            type="button"
          >
            <Link href="/lyriseAI-beta" className="flex-1">
              Join Our Beta!
            </Link>
          </button>
        </div>
      </div>
      <ItemsVault />
    </div>
  )
}
