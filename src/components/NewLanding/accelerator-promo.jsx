'use client'

import ArrowButton from '@components/Buttons/ArrowButton'
import Countdown from '@components/Accelerator/countdown'
import GiftIcon from '@assets/icons/giftIcon'
import Link from 'next/link'

export default function AcceleratorPromo() {
  return (
    <div className="max-w-md mx-auto p-6 md:max-w-2xl lg:max-w-5xl xl:max-w-5xl">
      <div className="rounded-3xl border-2 border-rose-500 p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8 font-primary md:flex md:flex-wrap md:justify-between">
        <div className="bg-rose-50 rounded-2xl p-4 flex items-center gap-3 md:w-full lg:w-auto">
          <GiftIcon className="h-16 w-auto text-rose-500" />
          <div>
            <div className="text-rose-500 font-medium text-base md:text-lg font-secondary">
              LyRise Grant
            </div>
            <div className="text-rose-500 text-5xl md:text-6xl font-bold font-secondary">
              $45,000
            </div>
          </div>
        </div>

        <div className="space-y-4 md:w-full lg:w-3/5 xl:w-2/3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            LyRise&apos;s First AI Accelerator for Startups!
          </h1>

          <p className="text-neutral-600 text-lg md:text-xl font-secondary leading-6 md:leading-7">
            If you&apos;re a startup with an AI-driven project, register now and
            be one of our top 5 to win a{' '}
            <span className="font-semibold">$45,000 grant</span> on your next AI
            project with LyRise. We&apos;ll turn your idea into reality with our
            network of top AI & Data Science Experts!
          </p>
        </div>

        <div className="md:w-full lg:w-1/3 xl:w-1/4">
          <Countdown
            timestamp={new Date('2024-11-16').getTime()}
            withoutWrapper
          />
        </div>

        <div className="md:w-full">
          <Link href="/accelerator" className="block">
            <ArrowButton className="mt-5 w-full h-14 md:h-16 text-lg md:text-xl bg-rose-500 hover:bg-rose-600 transition-colors duration-300">
              Join Lyrise AI Accelerator!
            </ArrowButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
