'use client'

import { useRouter } from 'next/router'
import { useState } from 'react'

import Layout from '@components/Layout/Layout'
import ArrowButton from '@components/Buttons/ArrowButton'
import { FormInput, FormSelect, FormPhoneInput } from '@components/Form'
import { registerCompany } from '@services/accelerator.services'

export default function CompanyRegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    aiProjectTitle: '',
    aiProjectDetails: '',
    fundingStage: '',
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    countryCode: '+1',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await registerCompany(formData)
      setCurrentStep(3)
      router.push('/accelerator')
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormInput
              label="Company Name"
              type="text"
              name="companyName"
              placeholder="ex : United States"
              value={formData.companyName}
              onChange={handleInputChange}
              maxLength={100}
              pattern="[A-Za-z0-9\s\-\_\.]+"
            />
            <FormInput
              label="Company Website"
              type="url"
              name="companyWebsite"
              placeholder="ex : https://example.com"
              value={formData.companyWebsite}
              onChange={handleInputChange}
              pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
            />
            <FormInput
              label="AI Project title"
              type="text"
              name="aiProjectTitle"
              placeholder="ex : Product Recommendation AI"
              value={formData.aiProjectTitle}
              onChange={handleInputChange}
              maxLength={200}
            />
            <div>
              <label
                htmlFor="aiProjectDetails"
                className="block text-sm mb-1 font-secondary"
              >
                AI Project Details<span className="text-rose-500">*</span>
                <textarea
                  id="aiProjectDetails"
                  name="aiProjectDetails"
                  placeholder="ex : Product recommendation system for e-commerce"
                  value={formData.aiProjectDetails}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                  // focus:ring-2 focus:ring-rose-500
                  className="w-full px-2 py-2 border border-gray-200 rounded-md focus:outline-none"
                />
              </label>
            </div>
            <FormSelect
              label="What is your funding stage?"
              name="fundingStage"
              value={formData.fundingStage}
              onChange={handleInputChange}
              placeholder="ex : Pre-seed, Seed, Series A..."
              options={[
                { value: 'pre-seed', label: 'Pre-seed' },
                { value: 'seed', label: 'Seed' },
                { value: 'series-a', label: 'Series A' },
                { value: 'series-b', label: 'Series B' },
                { value: 'series-c', label: 'Series C' },
                { value: 'series-d', label: 'Series D' },
              ]}
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="ex : John Smith"
              value={formData.fullName}
              onChange={handleInputChange}
              pattern="^[a-zA-Z\s]{2,100}$"
              maxLength={100}
            />
            <FormInput
              label="Work Email"
              type="email"
              name="workEmail"
              placeholder="ex : john@company.com"
              value={formData.workEmail}
              onChange={handleInputChange}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
            <FormPhoneInput
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              placeholder="9023456789"
              value={formData.phoneNumber}
              countryCode={formData.countryCode}
              onChange={handleInputChange}
              maxLength={10}
              required
            />
          </div>
        )
      default:
        return (
          <p className="text-xl font-semibold text-neutral-600 mb-3 font-secondary">
            Your company has been registered.
          </p>
        )
    }
  }

  const getButtonText = () => {
    if (currentStep === 1) return 'Continue'
    if (isSubmitting) return 'Registering...'
    return 'Register'
  }

  return (
    <Layout isRaw>
      <div className="min-h-screen bg-white px-4 py-8 max-w-3xl mx-auto">
        <div className="max-w-md mx-auto">
          <h1 className="text-[2.4rem] font-medium mb-8 font-primary">
            Register your company info.
          </h1>
          <Steps currentStep={currentStep} />
          <form onSubmit={currentStep === 1 ? handleNext : handleSubmit}>
            <h2 className="text-rose-500 font-semibold mb-6">
              {currentStep === 1
                ? 'Company Info'
                : currentStep === 2
                ? 'Contact Info'
                : 'Thank you!'}
            </h2>
            {renderFormStep()}
            {currentStep !== 3 && (
              <ArrowButton
                type="submit"
                disabled={isSubmitting}
                className="w-[60%] mt-5 bg-rose-500 hover:bg-rose-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed !rounded-md"
              >
                {getButtonText()}
              </ArrowButton>
            )}
          </form>
        </div>
      </div>
    </Layout>
  )
}

// Icons
const BuildingIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const UserIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Steps = ({ currentStep }) => (
  <div className="flex justify-center mb-8 relative">
    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-500 -translate-y-1/2" />
    <div className="flex justify-between relative z-10 w-48">
      {[
        { step: 1, Icon: BuildingIcon },
        { step: 2, Icon: UserIcon },
        { step: 3, Icon: CheckIcon },
      ].map(({ step, Icon }) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= step ? 'bg-rose-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Icon />
        </div>
      ))}
    </div>
  </div>
)
