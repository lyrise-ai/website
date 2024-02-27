import axios from 'axios'
import { useState } from 'react'
import LyRiseLogo from '../src/assets/LyRiseLogo.png'
import Image from 'next/image'

const SHEET_BEST_API =
  'https://sheet.best/api/sheets/055403a5-9b68-4668-b56a-6ab32974ae75'

export default function LyriseAIBeta() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [jobTitle, setJobTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      'First Name': firstName,
      'Last Name': lastName,
      'Email Address': email,
      'Company Website': companyWebsite,
      'Job Title': jobTitle,
    }

    axios
      .post(SHEET_BEST_API, data)
      .then((res) => {
        alert('Thank you for signing up! We will reach out to you soon.')
        console.log(res)
        setFirstName('')
        setLastName('')
        setEmail('')
        setCompanyWebsite('')
        setJobTitle('')
        window.location.href = '/'
      })
      .catch((err) => {
        alert('An error occurred. Please try again later.')
        console.log(err)
      })
  }

  return (
    <div className="h-screen relative flex flex-col">
      {/* navbar */}
      <div className="bg-white border-b-2 border-[#D0D5DD] w-full h-16 z-20 items-center justify-center flex">
        <a href="/" className="flex">
          <Image src={LyRiseLogo} width={100} height={100 / 3} />
        </a>
      </div>
      {/* background */}
      <div className="absolute w-screen h-screen -z-1 scale-105 top-0 left-0 new-landing-container blur-lg"></div>

      <div className="flex items-center justify-center flex-1">
        {/* form  */}
        <form
          className="z-10 rounded-xl p-10 bg-[#F7F9FF] flex flex-col gap-4 w-[90%] max-w-2xl"
          onSubmit={handleSubmit}
        >
          <div>
            <h1 className="text-3xl font-semibold text-left mb-5 relative">
              Pre-sign up to try LyRiseAI{' '}
              <sup className="text-xs rounded-lg bg-cyan-100 text-cyan-600 px-1 py-0.5 ml-1 font-normal h-fit absolute top-0">
                Beta
              </sup>
            </h1>
          </div>
          <div className="grid gap-5 flex-1 grid-cols-2">
            <FormInput
              label="First Name"
              type="text"
              placeholder="Jack"
              required
              value={firstName}
              setValue={setFirstName}
            />
            <FormInput
              label="Last Name"
              type="text"
              placeholder="Cooper"
              required
              value={lastName}
              setValue={setLastName}
            />
          </div>
          <FormInput
            label="Email"
            type="email"
            placeholder="jack@company.com"
            required
            value={email}
            setValue={setEmail}
          />
          <FormInput
            label="Company Website (Optional)"
            type="text"
            placeholder="https://company.com"
            value={companyWebsite}
            setValue={setCompanyWebsite}
          />
          <FormInput
            label="Job Title"
            type="text"
            placeholder="Data Scientist"
            value={jobTitle}
            setValue={setJobTitle}
            required
          />
          <div className="mt-2">
            <button
              className="bg-primary py-2 font-secondary rounded-lg text-white text-xl px-4 mr-5"
              type="submit"
            >
              Join the waitlist!
            </button>
            <a
              href="javascript:history.back()"
              className="flex-1 bg-white py-2 font-secondary rounded-lg text-primary text-xl px-4 border border-primary"
            >
              Back
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormInput({
  label,
  type,
  placeholder,
  required = false,
  value,
  setValue,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={label}
        className="text-base font-secondary text-neutral-900"
      >
        {label}
      </label>
      <input
        type={type}
        id={label}
        placeholder={placeholder}
        className="rounded-lg border border-[#D1DBFF] p-3 font-secondary text-lg"
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        pattern={
          type === 'email' ? '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$' : undefined
        }
      />
    </div>
  )
}
