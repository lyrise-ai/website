import InfoSection from '../src/components/Accelerator/info-section'
import Layout from '../src/components/Layout/Layout'
import RegisterBottomSheet from '@components/Accelerator/register-bottom-sheet'
import bookIcon from '@assets/book.svg'
import Link from 'next/link'

import CloseIcon from '@assets/icons/closeIcon'

export default function AboutAccelerator() {
  return (
    <Layout isRaw>
      <div className="bg-white w-full">
        <main className="relative flex items-center justify-center flex-col p-3 gap-3 bg-white max-w-7xl mx-auto mb-[30vh]">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight my-0 text-left w-full">
            LyRise AI
            <br />
            Accelerator!
          </h1>

          <div className="space-y-4 md:w-full lg:w-3/5 xl:w-2/3">
            <p className="text-neutral-500 text-lg md:text-xl font-secondary leading-6 md:leading-7">
              Be one of our top 5 to win a{' '}
              <span className="font-semibold">$45,000 grant</span> grant on your
              next AI project built by LyRise.
            </p>
          </div>

          <Link
            href="/accelerator"
            className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
          >
            <CloseIcon className="h-8 w-8" />
          </Link>
          <HowItWorksSection />
          <PerksSection />
          <RegisterBottomSheet />
        </main>
      </div>
    </Layout>
  )
}
function HowItWorksSection() {
  return (
    <InfoSection title="How it works!" color="rose" iconSrc={bookIcon}>
      <ol className="font-secondary text-rose-500 !list-decimal mt-2 w-full">
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">1.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Register your startup
            </h4>
            <p className="text-lg md:text-xl font-normal leading-5">
              Submit your application and invite your network to vote for your
              startup.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">2.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Post on Social Media
            </h4>
            <p className="text-lg md:text-xl font-normal leading-5">
              Share your startup&apos;s journey and tag LyRise. The post with
              the most likes will receive a wildcard entry into the top 5.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">3.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Join the Voting Leaderboard
            </h4>
            <p className="text-lg md:text-xl font-normal leading-5">
              Compete to be one of the top 5 companies on our leaderboard to be
              selected for our AI Accelerator.
            </p>
          </div>
        </li>
      </ol>
    </InfoSection>
  )
}

function PerksSection() {
  return (
    <InfoSection title="Perks" color="rose" iconSrc={bookIcon}>
      <p className="text-rose-500 text-lg md:text-xl leading-5 font-secondary mt-2 w-full">
        Joining the LyRise Accelerator gives exclusive perks for{' '}
        <strong>all participants</strong>, even if you don't make it to the Top
        5:
      </p>
      <ul className="font-secondary text-rose-500 w-full">
        <li>
          <div>
            <p className="text-lg md:text-xl">
              <span className="font-bold">50% Discount on any AI project</span>{' '}
              (up to $5,000 per month).
            </p>
          </div>
        </li>
        <li>
          <div>
            <p className="text-lg md:text-xl">
              <span className="font-bold">Free AI Consultation</span> Tailored
              specifically to your industry and use case.
            </p>
          </div>
        </li>
        <li>
          <div>
            <p className="text-lg md:text-xl">
              <span className="font-bold">
                ROI Analysis & Competitive Edge Assessment
              </span>{' '}
              To evaluate the potential impact of your project.
            </p>
          </div>
        </li>
        <li>
          <div>
            <p className="text-lg md:text-xl">
              <span className="font-bold">Complete Project Roadmap</span>{' '}
              Including tech stack, timeline, and detailed cost breakdown.
            </p>
          </div>
        </li>
      </ul>
    </InfoSection>
  )
}
