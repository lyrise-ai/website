import React, { useState } from 'react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowRight, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import clsx from 'clsx'
import 'react-toastify/dist/ReactToastify.css'
import LogosMarquee from '../src/components/MainLandingPage/LogosMarquee'
import LiveAgentWorkflow from '../src/components/ROIGenerator/LiveAgentWorkflow'
import LastSection from '../src/components/MainLandingPage/LastSection'
import MainHeader from '../src/layout/MainHeader'

// Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  companyName: yup.string().required('Company Name is required'),
  website: yup
    .string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .optional(),
  linkedin: yup.string().url('Please enter a valid LinkedIn URL').optional(),
})

// Sub-component to specific ROI Form fields to reduce complexity
const InputField = ({
  id,
  label,
  register,
  error,
  placeholder,
  type = 'text',
  required = false,
  description = '',
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}{' '}
      {description && (
        <span className="text-gray-400 font-normal">{description}</span>
      )}
      <input
        type={type}
        id={id}
        aria-label={label}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register(id)}
        className={clsx(
          'w-full px-4 py-3 mt-1 rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all outline-none',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white',
        )}
        placeholder={placeholder}
      />
    </label>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
        {error.message}
      </p>
    )}
  </div>
)

const ROIFormFields = ({ register, errors, isSubmitting }) => (
  <div className="space-y-5">
    <InputField
      id="companyName"
      label="Company Name"
      register={register}
      error={errors.companyName}
      placeholder="Acme Corp"
      required
    />

    <InputField
      id="website"
      label="Company Website"
      register={register}
      error={errors.website}
      placeholder="https://acme.com"
      type="url"
      description="(Optional)"
    />

    <InputField
      id="linkedin"
      label="LinkedIn Profile"
      register={register}
      error={errors.linkedin}
      placeholder="https://linkedin.com/in/..."
      type="url"
      description="(Optional)"
    />

    <InputField
      id="email"
      label="Work Email"
      register={register}
      error={errors.email}
      placeholder="name@company.com"
      type="email"
      required
    />

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className={clsx(
        'w-full group flex items-center justify-center py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all transform',
        isSubmitting
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-[#2C2C2C] hover:bg-blue-500 shadow-lg hover:shadow-blue-500/30',
      )}
    >
      {isSubmitting ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Generating Report...
        </>
      ) : (
        <>
          Get My Report{' '}
          <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  </div>
)

const SuccessView = () => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-8"
  >
    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
      <FaCheckCircle className="text-5xl text-green-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-3">
      Report Generating!
    </h2>
    <p className="text-gray-600 text-lg leading-relaxed">
      Thank you for your interest. Check your email in approx.{' '}
      <span className="font-semibold text-gray-900">2 minutes</span> for your
      personalized AI ROI report.
    </p>
  </motion.div>
)

const PageHeader = () => (
  <div className="bg-[#2C2C2C] p-8 text-center">
    <h1 className="text-3xl font-bold text-white mb-2">
      Get Your AI ROI Report
    </h1>
    <p className="text-blue-100 text-lg">
      Discover how much time and money AI can save your business.
    </p>
  </div>
)

export default function ROIReport() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // Watch for changes to update LiveAgentWorkflow
  // We pass the watch function itself to the component

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const payload = {
        Email: data.email,
        'Company Name': data.companyName,
        'Company Website URL': data.website,
        'Company LinkedIn URL': data.linkedin,
      }
      await axios.post('/api/roi-report', payload)
      setIsSuccess(true)
      toast.success('Report request submitted successfully!')
    } catch (error) {
      // console.error('Submission error:', error.message || 'Unknown error');
      toast.error('Failed to submit. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="-mt-3">
      <MainHeader />
      <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center p-4 font-sans text-gray-900 relative overflow-y-auto">
        <Head>
          <title>Get Your AI ROI Report | LyRise</title>
          <meta
            name="description"
            content="Discover how much time and money AI can save your business."
          />
        </Head>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 0.85 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg bg-[#f8f8f8] rounded-2xl shadow-xl overflow-hidden self-center lg:self-start "
          >
            <PageHeader />

            <div className="p-8">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <ROIFormFields
                      register={register}
                      errors={errors}
                      isSubmitting={isSubmitting}
                    />
                  </motion.form>
                ) : (
                  <SuccessView />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Live Agent Workflow Component - Right side on Desktop, Below on Mobile */}
          <div className="w-full max-w-lg lg:max-w-sm lg:mt-24 self-center lg:self-start">
            <LiveAgentWorkflow watch={watch} />
          </div>
        </div>

        <div className="md:w-1/2 w-full mt-12">
          <LogosMarquee />
        </div>
      </div>
      <LastSection />
    </div>
  )
}
