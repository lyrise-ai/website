import InfoSection from '../src/components/Accelerator/info-section'
import Layout from '../src/components/Layout/Layout'
import RegisterBottomSheet from '@components/Accelerator/register-bottom-sheet'
import giftIcon from '@assets/gift.svg'
import peopleIcon from '@assets/2people.svg'
import infoIcon from '@assets/info.svg'

import Link from 'next/link'

import CloseIcon from '@assets/icons/closeIcon'

export default function AboutAccelerator() {
  return (
    <Layout isRaw>
      <div className="bg-white w-full">
        <main className="relative flex items-center justify-center flex-col p-3 gap-3 bg-white max-w-7xl mx-auto mb-[30vh]">
          <Link
            href="/accelerator"
            className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
          >
            <CloseIcon className="h-8 w-8" />
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-primary font-bold leading-tight my-0 text-left w-full">
            LyRise AI
            <br />
            Accelerator!
          </h1>
          <div className="space-y-4 md:w-full lg:w-3/5 xl:w-2/3">
            <p className="text-neutral-500 text-lg md:text-xl font-secondary leading-6 md:leading-7">
              A 2-months program to help Seed to Series A startups build AI
              agents/teams. The program offers the tools, expertise, and support
              needed to transform your business operations and customer
              experiences!
            </p>
          </div>
          <HowItWorksSection />
          <PerksSection />
          <WhoCanApplySection />
          <RegisterBottomSheet withHowItWorksLink />
        </main>
      </div>
    </Layout>
  )
}
function HowItWorksSection() {
  return (
    <InfoSection title="How it works!" color="rose" iconSrc={infoIcon}>
      <ol className="font-secondary text-rose-500 !list-decimal w-full ml-1 space-y-2">
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">1.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Register your startup
            </h4>
            <p className="text-sm md:text-base font-normal leading-5">
              Submit your company’s details to showcase your startup and its
              mission.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">2.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Get Community Votes
            </h4>
            <p className="text-sm md:text-base font-normal leading-5">
              Rally your peers and fellow entrepreneurs to vote for your
              startup. Show them why you deserve the top spot!
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">3.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">Be Voted #1</h4>
            <p className="text-sm md:text-base font-normal leading-5">
              The startup with the most votes wins the coveted Golden Ticket and
              access to the accelerator&apos;s full suite of benefits.
            </p>
          </div>
        </li>
      </ol>
    </InfoSection>
  )
}

function PerksSection() {
  return (
    <InfoSection title="Perks" color="rose" iconSrc={giftIcon}>
      <p className="text-rose-500 text-sm md:text-xl leading-5 font-secondary w-full">
        Joining the LyRise Accelerator gives exclusive perks for{' '}
        <strong>all participants</strong>, even if you don&apos;t make it to the
        Top 5:
      </p>
      <ul className="font-secondary text-rose-500 w-full space-y-2">
        <li>
          <div>
            <p className="text-sm md:text-lg">
              <span className="font-bold">50% Discount on any AI project</span>{' '}
              (up to $5,000 per month).
            </p>
          </div>
        </li>
        <li>
          <div>
            <p className="text-sm md:text-lg">
              <span className="font-bold">Free AI Consultation</span> Tailored
              specifically to your industry and use case.
            </p>
          </div>
        </li>
        <li>
          <div>
            <p className="text-sm md:text-lg">
              <span className="font-bold">
                ROI Analysis & Competitive Edge Assessment
              </span>{' '}
              To evaluate the potential impact of your project.
            </p>
          </div>
        </li>
        <li>
          <div>
            <p className="text-sm md:text-lg">
              <span className="font-bold">Complete Project Roadmap</span>{' '}
              Including tech stack, timeline, and detailed cost breakdown.
            </p>
          </div>
        </li>
      </ul>
    </InfoSection>
  )
}

function WhoCanApplySection() {
  return (
    <InfoSection title="Who Can Apply?" color="rose" iconSrc={peopleIcon}>
      <p className="text-rose-500 text-lg md:text-xl leading-5 font-secondary w-full font-bold">
        The LyRise AI Accelerator is open to startups that meet the following
        criteria:
      </p>
      <ul className="font-secondary text-rose-500 w-full list-disc [&>li]:ml-5 space-y-2">
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">Seed to Series A Stage</p>
          <p className="text-base md:text-lg">
            You have achieved product-market fit and are scaling your business.
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">GCC-based Companies</p>
          <p className="text-base md:text-lg">
            Your company is headquartered or mainly operates in one of the GCCs.
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">Operational Capability</p>
          <p className="text-base md:text-lg">
            Your company is equipped to execute AI projects.
          </p>
        </li>
      </ul>
    </InfoSection>
  )
}
