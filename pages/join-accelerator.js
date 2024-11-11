'use client'

import { useRouter } from 'next/router'
import { useState } from 'react'

import Layout from '@components/Layout/Layout'
import ArrowButton from '@components/Buttons/ArrowButton'
import SocialButton from '@components/Buttons/SocialButton'
import { FormInput, FormSelect, FormPhoneInput } from '@components/Form'
import StepsHeader from '@components/Accelerator/steps-header'
import { registerCompany } from '@services/accelerator.services'
import SectionWrapper from '../src/components/Accelerator/section-wrapper'

import linkedinIcon from '@assets/linkedin.svg'
import instagramIcon from '@assets/instagram.webp'
import xIcon from '@assets/x.svg'
import Link from 'next/link'

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
      await registerCompany({
        name: formData.companyName,
        website: formData.companyWebsite,
        ai_project_title: formData.aiProjectTitle,
        ai_project_details: formData.aiProjectDetails,
        funding_stage: formData.fundingStage,
        contact_full_name: formData.fullName,
        contact_email: formData.workEmail,
        contact_number: formData.phoneNumber,
      })
      setCurrentStep(3)
      // router.push('/accelerator')
    } catch (error) {
      console.error('Submission error:', error)
      alert("Couldn't register your company, please try again.")
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
              onChange={handleInputChange}
              maxLength={10}
              required
            />
            <div>
              <div className="flex items-center text-sm font-secondary">
                <input type="checkbox" required className="mr-2 rounded" />
                <span>
                  I agree to the{' '}
                  <Link
                    href="/terms-conditions"
                    className="underline text-primary"
                  >
                    terms and consitions
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="w-full flex flex-col gap-2">
            <SocialButton
              provider="linkedin"
              iconSrc={linkedinIcon}
              onClick={() => {}}
            >
              Share to LinkedIn
            </SocialButton>
            <SocialButton
              provider="instagram"
              iconSrc={instagramIcon}
              onClick={() => {}}
            >
              Share to Instagram
            </SocialButton>
            <SocialButton provider="x" iconSrc={xIcon} onClick={() => {}}>
              Share to X
            </SocialButton>
          </div>
        )
    }
  }

  const getButtonText = () => {
    if (currentStep === 1) return 'Continue'
    if (isSubmitting) return 'Registering...'
    return 'Register'
  }

  const handleFinish = () => {
    router.push('/accelerator')
  }

  return (
    <Layout isRaw>
      <div className="bg-white px-4 py-4 max-w-3xl mx-auto">
        <SectionWrapper className="max-w-md mx-auto min-h-[85vh]">
          <h1 className="text-[2.4rem] font-medium mb-3 font-primary leading-10">
            Register your company info.
          </h1>
          <StepsHeader currentStep={currentStep} />
          <form
            className="mt-auto w-full"
            onSubmit={currentStep === 1 ? handleNext : handleSubmit}
          >
            <h2 className="text-rose-500 font-bold mb-6 font-primary">
              {currentStep === 1
                ? 'Company Info'
                : currentStep === 2
                ? 'Contact Info'
                : 'Share to win!'}
            </h2>
            {renderFormStep()}
            {currentStep !== 3 ? (
              <ArrowButton
                showArrow
                type="submit"
                disabled={isSubmitting}
                className="w-[60%] mt-5 bg-rose-500 hover:bg-rose-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed !rounded-md"
              >
                {getButtonText()}
              </ArrowButton>
            ) : (
              <ArrowButton
                showArrow
                type="button"
                onClick={handleFinish}
                className="w-[60%] mt-5 bg-rose-500 hover:bg-rose-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed !rounded-md"
              >
                Finish
              </ArrowButton>
            )}
          </form>
        </SectionWrapper>
      </div>
    </Layout>
  )
}
