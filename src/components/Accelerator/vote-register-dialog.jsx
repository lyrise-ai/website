import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'

import ArrowButton from '@components/Buttons/ArrowButton'
import SocialButton from '@components/Buttons/SocialButton'
import SectionWrapper from './section-wrapper'
import { FormInput } from '../Form'
import { setUserEmail } from '../../services/accelerator.services'
import useWeakAuth from '@hooks/useWeakAuth'

import googleIcon from '@assets/hero/google.png'
import linkedinIcon from '@assets/linkedin.svg'

export default function VoteRegisterDialog({ isOpen, onClose }) {
  const [workEmail, setWorkEmail] = useState('')
  const email = useWeakAuth()

  const handleSignup = () => {
    setUserEmail(workEmail)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="w-full h-full fixed bg-white z-50 top-0 p-3 font-primary">
      <SectionWrapper className="h-full !justify-between">
        <h1 className="text-2xl w-full font-medium font-primary">
          Sign up to vote!
        </h1>

        <div>
          <h2 className="text-xl font-bold mb-4 w-full">
            Sign up with Socials
          </h2>

          <div className="flex flex-col w-full gap-2 pb-5 mb-5 border-b border-neutral-300">
            <SocialButton
              provider="google"
              iconSrc={googleIcon}
              onClick={() => signIn('google')}
            >
              Sign up with Google
            </SocialButton>
            <SocialButton
              provider="linkedin"
              iconSrc={linkedinIcon}
              onClick={() => signIn('linkedin')}
            >
              Sign up with Linkedin
            </SocialButton>
          </div>
          <h2 className="text-xl font-bold mb-4 w-full">Basic Info</h2>
          <FormInput
            label="Work Email"
            type="email"
            name="workEmail"
            placeholder="ex : john@company.com"
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          <div className="w-full">
            <ArrowButton
              type="button"
              onClick={handleSignup}
              className="!w-[60%] mt-5 bg-rose-500 hover:bg-rose-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed !rounded-md"
            >
              Sign Up
            </ArrowButton>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
