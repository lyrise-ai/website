import { useState } from 'react'
import ArrowButton from '@components/Buttons/ArrowButton'
import SectionWrapper from './section-wrapper'
import { FormInput } from '../Form'
import { setUserEmail } from '../../services/accelerator.services'

export default function VoteRegisterDialog({ isOpen, onClose }) {
  const [workEmail, setWorkEmail] = useState('')

  const handleSignup = () => {
    setUserEmail(workEmail)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="w-full h-full fixed bg-white z-50 mt-10 p-3 font-primary">
      <SectionWrapper>
        <h1 className="text-2xl w-full font-medium font-primary">
          Sign up to vote!
        </h1>
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
      </SectionWrapper>
    </div>
  )
}
