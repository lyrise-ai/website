import { useRouter } from 'next/router'
import ArrowButton from '../Buttons/ArrowButton'
import SectionWrapper from './section-wrapper'
import Link from 'next/link'

export default function RegisterBottomSheet({ withHowItWorksLink = false }) {
  const router = useRouter()

  function handleRegister() {
    router.push('/join-accelerator')
  }

  return (
    <div
      style={{
        borderTopRightRadius: '1.5rem',
        borderTopLeftRadius: '1.5rem',
      }}
      className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-xl h-fit z-30 px-4 py-3"
    >
      <SectionWrapper
        title="Lyrise AI Accelerator!"
        className={'text-center !gap-1'}
      >
        <h4 className="text-neutral-500 font-secondary text-base max-w-[75%]">
          Be one of our top 5 to win a{' '}
          <span className="font-semibold">$45,000 grant</span> grant on your
          next AI project built by LyRise.
        </h4>
        <ArrowButton
          showArrow
          onClick={handleRegister}
          className="mt-4 bg-rose-500"
        >
          Register Now
        </ArrowButton>
        {withHowItWorksLink && (
          <Link
            className="underline text-rose-500 font-secondary text-base my-0"
            href="/about-accelerator"
          >
            See how it works?
          </Link>
        )}
      </SectionWrapper>
    </div>
  )
}