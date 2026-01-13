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
import ExecutionSimulation from '../src/components/ROIGenerator/ExecutionSimulation'
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
  extraInfo: yup.string().optional(),
})

const InputField = ({
  id,
  label,
  register,
  error,
  placeholder,
  type = 'text',
  required = false,
  description = '',
  rows,
}) => (
  <div className="flex flex-col">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label} {required && <span className="text-blue-600">*</span>}{' '}
      {description && (
        <span className="text-gray-400 font-normal ml-1">{description}</span>
      )}
    </label>
    <div className="relative">
      {type === 'textarea' ? (
        <textarea
          id={id}
          {...register(id)}
          rows={rows || 4}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 resize-none',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/10'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300',
          )}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          {...register(id)}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/10'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300',
          )}
          placeholder={placeholder}
        />
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-500 flex items-center">
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
      id="email"
      label="Work Email"
      register={register}
      error={errors.email}
      placeholder="name@company.com"
      type="email"
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
      id="extraInfo"
      label="Additional Context"
      register={register}
      error={errors.extraInfo}
      placeholder="Tell us about your specific challenges or goals..."
      type="textarea"
      description="(Optional)"
    />
    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className={clsx(
        'w-full group flex items-center justify-center py-4 px-6 rounded-lg text-lg font-semibold transition-all transform mt-6 shadow-md hover:shadow-xl',
        isSubmitting
          ? 'bg-blue-400 text-white cursor-not-allowed'
          : 'bg-[#2C2C2C] text-white hover:bg-black hover:-translate-y-0.5',
      )}
    >
      {isSubmitting ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Processing...
        </>
      ) : (
        <>
          Generate ROI Report
          <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  </div>
)

const Header = () => (
  <div className="mb-8 text-center">
    <h1 className="text-3xl font-bold text-gray-900 mb-3">
      Calculate Your AI ROI
    </h1>
    <p className="text-gray-600 text-lg max-w-sm mx-auto">
      See exactly how much time and resources you can save with LyRise.
    </p>
  </div>
)

export default function ROIReport() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewState, setViewState] = useState('form') // 'form', 'simulating', 'success'

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

  const onSubmit = (data) => {
    setIsSubmitting(true)

    const payload = {
      Email: data.email,
      'Company Name': data.companyName,
      'Company Website URL': data.website,
      'Company LinkedIn URL': data.linkedin,
      extraInfo: data.extraInfo,
    }

    // Fire and forget
    axios
      .post('/api/roi-report', payload)
      .catch((err) => console.error('API Error (background):', err))

    // Immediately start simulation
    setViewState('simulating')
  }

  const handleSimulationComplete = () => {
    setViewState('success')
    setIsSubmitting(false)
    toast.success('Report request submitted successfully!')
  }

  return (
    <div className="rebranding-landing-page -mt-[12px]">
      <MainHeader />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-900 relative overflow-y-auto">
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

        <div className="w-full max-w-lg z-10 transition-all duration-500 ease-in-out">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {viewState === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Header />
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <ROIFormFields
                      register={register}
                      errors={errors}
                      isSubmitting={isSubmitting}
                    />
                  </form>
                </motion.div>
              )}

              {viewState === 'simulating' && (
                <motion.div
                  key="simulation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="py-12"
                >
                  <ExecutionSimulation onComplete={handleSimulationComplete} />
                </motion.div>
              )}

              {viewState === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                    <FaCheckCircle className="text-4xl text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Analysis Complete!
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    A comprehensive ROI report has been compiled and emailed to
                    you.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                    Please check your inbox in 2-3 mins
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="md:w-1/2 w-full mt-12">
          <LogosMarquee />
        </div>
      </div>
      <LastSection />
    </div>
  )
}
