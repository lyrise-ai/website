import Link from 'next/link'

import ArrowButton from '../Buttons/ArrowButton'
import MessageAvatar from './hero/ui/MessageAvatar'

const JD_GENERATOR_URL = ''

export default function JDGenerator() {
  return (
    <section
      className="flex flex-col items-center md:flex-row gap-5 md:gap-8 p-5 md:p-8 bg-white mx-auto md:max-w-6xl mt-12 md:mt-16 rounded-2xl max-md:mx-5"
      style={{
        boxShadow: '0px 9px 18px 0px rgba(0, 34, 158, 0.15)',
      }}
    >
      <div className="flex-1">
        <h2 className="text-3xl lg:text-4xl font-semibold font-primary mb-5">
          Don’t have a Job Description?
        </h2>
        <div className="rounded-lg bg-primary-25 p-3">
          <h4 className="font-secondary text-base md:text-lg font-semibold">
            Generate one now!
          </h4>
          <p className="font-secondary text-sm md:text-base text-neutral-500 mb-2">
            Our AI model can generate a job description for any AI role you’re
            looking to hire.
          </p>
          <Link href={JD_GENERATOR_URL}>
            <ArrowButton showArrow className="!text-base md:!text-lg">
              Book a Demo!
            </ArrowButton>
          </Link>
        </div>
      </div>
      <div className="flex flex-1 items-end gap-5">
        <MessageAvatar type="bot" />
        <JobDescriptionSceleton className="w-full h-auto rounded overflow-hidden" />
      </div>
    </section>
  )
}

function JobDescriptionSceleton({ className }) {
  return (
    <svg
      width="410"
      height="255"
      viewBox="0 0 410 255"
      fill="none"
      className={className}
    >
      <path
        d="M0 7.99999C0 3.58172 3.58172 0 8 0H402C406.418 0 410 3.58172 410 8V291H0V7.99999Z"
        fill="#F7F9FF"
      />
      <rect x="20" y="20" width="370" height="20" fill="#5277FF" />
      <rect x="20" y="48" width="209" height="11" fill="#5277FF" />
      <rect x="20" y="67" width="37" height="12" rx="6" fill="#849FFF" />
      <rect x="61" y="67" width="45" height="12" rx="6" fill="#849FFF" />
      <rect x="110" y="67" width="36" height="12" rx="6" fill="#849FFF" />
      <rect x="150" y="67" width="56" height="12" rx="6" fill="#849FFF" />
      <rect x="210" y="67" width="36" height="12" rx="6" fill="#849FFF" />
      <rect x="250" y="67" width="47" height="12" rx="6" fill="#849FFF" />
      <rect x="20" y="95" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="113" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="131" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="149" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="167" width="119" height="10" fill="#B2C3FF" />
      <rect x="20" y="189" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="207" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="225" width="370" height="10" fill="#B2C3FF" />
      <rect x="20" y="243" width="370" height="10" fill="#B2C3FF" />
    </svg>
  )
}
