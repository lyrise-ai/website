import { useState, useEffect } from 'react'
import ArrowButton from '@components/Buttons/ArrowButton'
import Countdown from '@components/Accelerator/countdown'
import GiftIcon from '@assets/icons/giftIcon'
import CloseIcon from '@assets/icons/closeIcon'
import Link from 'next/link'
import Image from 'next/image'

import xIconSrc from '@assets/x.svg'
import bannerSrc from '@assets/top-winners-banner.png'

export default function AcceleratorPromo() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 1800)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center fade-in-out ">
      <div className="max-w-md lg:max-w-lg lg:max-h-full overflow-y-scroll mx-auto p-6">
        <div className="rounded-xl border-2 border-rose-500 p-3 md:p-8 lg:p-10 space-y-3 bg-primary-25 md:space-y-8 font-primary md:flex md:flex-wrap md:justify-between relative">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight my-0">
            LyRise AI
            <br />
            Accelerator!
          </h1>

          <div className="space-y-2 md:w-full lg:w-3/5 xl:w-2/3">
            <p className="text-neutral-500 text-lg md:text-xl font-secondary leading-5 md:leading-7">
              LyRise offers each of our top 5 voted startups:
              <ul className="font-bold list-disc pl-3">
                <li>• 2 months of AI development</li>
                <li>• cloud storage</li>
                <li>• 30% off future projects!</li>
              </ul>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-2 -top-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
          >
            <CloseIcon className="h-8 w-8" />
          </button>

          {/* <div className="bg-rose-50 rounded-2xl p-4 flex items-center gap-3 md:w-full lg:w-auto">
            <GiftIcon className="h-16 w-auto text-rose-500" />
            <div>
              <div className="text-rose-500 font-medium text-base md:text-lg font-secondary">
                LyRise Grant
              </div>
              <div className="text-rose-500 text-5xl md:text-6xl font-bold font-secondary">
                $45,000
              </div>
            </div>
          </div> */}

          <Image src={bannerSrc} alt="Top Winners Banner" />

          <div className="w-full">
            <Countdown
              timestamp={new Date('2024-11-16').getTime()}
              withoutWrapper
            />
          </div>

          <div className="md:w-full">
            <Link href="/accelerator" className="block">
              <ArrowButton className="mt-5 w-full h-14 md:h-16 text-xl md:text-xl !font-medium bg-rose-500 hover:bg-rose-600 transition-colors duration-300">
                Join Lyrise AI Accelerator!
              </ArrowButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}