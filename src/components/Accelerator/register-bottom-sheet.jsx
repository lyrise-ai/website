import { useRouter } from 'next/router'
import ArrowButton from '../Buttons/ArrowButton'
import SectionWrapper from './section-wrapper'

export default function RegisterBottomSheet() {
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
      className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-xl h-fit z-50 px-4 py-3"
    >
      <SectionWrapper
        title="Register your company now!"
        className={'text-center'}
      >
        <h4 className="text-neutral-500 font-secondary text-base max-w-[75%]">
          Register your company for a chance to win 3 months of AI building for
          free!
        </h4>
        <ArrowButton
          showArrow
          onClick={handleRegister}
          className="mt-4 bg-rose-500"
        >
          Register Now
        </ArrowButton>
      </SectionWrapper>
    </div>
  )
}
