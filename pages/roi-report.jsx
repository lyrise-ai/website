import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaArrowRight, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import clsx from 'clsx'
import 'react-toastify/dist/ReactToastify.css'

import LogosMarquee from '../src/components/MainLandingPage/LogosMarquee'

// Webhook URL constant

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

export default function ROIReport() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

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
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center p-4 font-sans text-gray-900 relative overflow-hidden">
      <Image
        src="/assets/Logos/hand-straight-right-humanoid.svg"
        alt="Decorative Hand"
        width={384}
        height={384}
        className="hidden xl:block fixed left-0 -translate-x-1/4 top-1/2 -translate-y-1/2 h-96 w-auto pointer-events-none opacity-50 scale-75"
      />
      <Image
        src="/assets/Logos/hand-straight-left-humanoid.svg"
        alt="Decorative Hand"
        width={384}
        height={384}
        className="hidden xl:block fixed right-0 translate-x-1/4 top-1/2 -translate-y-1/2 h-96 w-auto pointer-events-none opacity-50 scale-75"
      />

      <Head>
        <title>Get Your Free AI ROI Report | LyRise</title>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-[#f8f8f8] rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-[#2C2C2C] p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Get Your Free AI ROI Report
          </h1>
          <p className="text-blue-100 text-lg">
            Discover how much time and money AI can save your business.
          </p>
        </div>

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
                className="space-y-5"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Work Email <span className="text-red-500">*</span>
                    <input
                      type="email"
                      id="email"
                      aria-label="Work Email"
                      {...register('email')}
                      className={clsx(
                        'w-full px-4 py-3 mt-1 rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all outline-none',
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white',
                      )}
                      placeholder="name@company.com"
                    />
                  </label>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Company Name Field */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name <span className="text-red-500">*</span>
                    <input
                      type="text"
                      id="companyName"
                      aria-label="Company Name"
                      {...register('companyName')}
                      className={clsx(
                        'w-full px-4 py-3 mt-1 rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all outline-none',
                        errors.companyName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white',
                      )}
                      placeholder="Acme Corp"
                    />
                  </label>
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Website URL Field */}
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Website{' '}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                    <input
                      type="url"
                      id="website"
                      aria-label="Company Website"
                      {...register('website')}
                      className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition-all outline-none bg-white"
                      placeholder="https://acme.com"
                    />
                  </label>
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                {/* LinkedIn URL Field */}
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    LinkedIn Profile{' '}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                    <input
                      type="url"
                      id="linkedin"
                      aria-label="LinkedIn Profile"
                      {...register('linkedin')}
                      className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition-all outline-none bg-white"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </label>
                  {errors.linkedin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.linkedin.message}
                    </p>
                  )}
                </div>

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
              </motion.form>
            ) : (
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
                  <span className="font-semibold text-gray-900">2 minutes</span>{' '}
                  for your personalized AI ROI report.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="md:w-1/2 w-full mt-12">
        <LogosMarquee />
      </div>
    </div>
  )
}
