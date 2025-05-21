import InfoSection from '../src/components/Accelerator/info-section'
import Layout from '../src/components/Layout/Layout'
import RegisterBottomSheet from '@components/Accelerator/register-bottom-sheet'
import giftIcon from '@assets/gift.svg'
import peopleIcon from '@assets/2people.svg'
import infoIcon from '@assets/info.svg'

import Link from 'next/link'

import CloseIcon from '@assets/icons/closeIcon'
import MainLayout from '../src/layout'

export default function AboutAccelerator() {
  return (
    <MainLayout>
      <div className=" w-full">
        <main className="relative flex items-center justify-center flex-col p-3 gap-3  max-w-7xl mx-auto mb-[30vh]">
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
            <p className="text-neutral-500 text-lg md:text-xl font-secondary leading-6 md:leading-7 text-center">
              The LyRise AI Accelerator is a 1 year partnership that starts with
              a 35K grant covering 2-month scoping and project roadmap program,
              the accelerator is designed to empower visionary startups to build
              transformative AI solutions. With only 10 exclusive seats, the
              program offers the tools, expertise, and support needed to
              revolutionize your business operations and customer experiences.
            </p>
          </div>
          <HowItWorksSection />
          <PerksSection />
          <WhoCanApplySection />
          <RegisterBottomSheet withHowItWorksLink />
        </main>
      </div>
    </MainLayout>
  )
}
function HowItWorksSection() {
  return (
    <InfoSection title="How it works!" color="rose" iconSrc={infoIcon}>
      <ol className="font-secondary text-rose-500 !list-decimal w-full ml-1 space-y-2">
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">1.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">Online Application</h4>
            <p className="text-sm md:text-base font-normal leading-5">
              Complete our application form, detailing your startup, team,
              product, and vision for adopting AI, including your commitment to
              a $100K AI project investment.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">2.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">Initial Review:</h4>
            <p className="text-sm md:text-base font-normal leading-5">
              Our team evaluates applications for alignment with the
              accelerator’s focus and criteria. Selected applicants receive an
              invitation to proceed.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">3.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              AI Strategy Discussion
            </h4>
            <p className="text-sm md:text-base font-normal leading-5">
              Participate in a one-on-one call with our selection team to
              explore your goals, AI readiness, and potential impact.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">4.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Selection Committee Review
            </h4>
            <p className="text-sm md:text-base font-normal leading-5">
              A panel of AI experts and industry leaders evaluates shortlisted
              startups based on innovation, impact, and alignment with program
              objectives.
            </p>
          </div>
        </li>
        <li className="grid grid-cols-12 md:grid-cols-[auto_1fr] gap-4">
          <span className="text-lg md:text-xl font-bold">5.</span>
          <div className="max-md:col-span-11">
            <h4 className="text-lg md:text-xl font-bold">
              Acceptance & Onboarding
            </h4>
            <p className="text-sm md:text-base font-normal leading-5">
              Selected startups receive an official offer, sign a contract for
              $40K in-kind support and a $60K investment, and begin onboarding
              with a tailored AI roadmap.
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
      <ul className="font-secondary text-rose-500 w-full list-disc [&>li]:ml-5 space-y-2">
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">
            Custom AI Agent MVP Delivered in 1 Month
          </p>
          <p className="text-base md:text-lg">
            Includes model training, validation, optimization, and scalability -
            Estimated Value: $15,000
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">
            End-to-End Strategic Consultancy for One Year
          </p>
          <p className="text-base md:text-lg">
            In-person sessions with regular touchpoints and strategic guidance
            throughout the year - Estimated Value: $15,000
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">
            Dedicated Support & Quarterly Performance Reviews
          </p>
          <p className="text-base md:text-lg">
            Ongoing support with in-depth analysis and improvement of AI Agent
            performance - Estimated Value: $5,000
          </p>
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
          <p className="text-lg md:text-xl font-bold">Visionary Leadership</p>
          <p className="text-base md:text-lg">
            Your team is dedicated to driving innovation through AI.
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">Financial Commitment</p>
          <p className="text-base md:text-lg">
            You are prepared to invest $100K in a transformative AI project.
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">Operational Capability</p>
          <p className="text-base md:text-lg">
            Your company is equipped to execute AI projects.
          </p>
        </li>
        <li className="list-disc">
          <p className="text-lg md:text-xl font-bold">
            Global Impact Potential
          </p>
          <p className="text-base md:text-lg">
            You’re solving meaningful problems with significant impact
            potential.
          </p>
        </li>
      </ul>
    </InfoSection>
  )
}
