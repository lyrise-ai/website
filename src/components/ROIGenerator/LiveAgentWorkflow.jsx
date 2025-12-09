import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaGlobe,
  FaRobot,
  FaFilePdf,
  FaCheck,
  FaCircleNotch,
} from 'react-icons/fa'
import clsx from 'clsx'

const getStepUpdate = (step, value) => {
  let status = 'idle'
  let text = 'Waiting for input...'

  if (value && value.length > 0) {
    status = 'active'

    switch (step.id) {
      case 1:
        text = `Identifying business entity ${value}...`
        break
      case 2:
        text = `Queuing deep-scan of ${value}...`
        break
      case 3:
        text = `Extracting employee count & benchmarks...`
        break
      case 4: {
        // Simple email regex for "valid" check visual
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(value)) {
          status = 'done' // Mark as done/ready when valid
          text = `Routing confidential PDF to ${value}...`
        } else {
          text = `Typing email recipient...`
        }
        break
      }
      default:
        text = `Processing...`
    }
  }

  if (step.key === 'email' && step.status === 'done') {
    // keep done
    return { status: step.status, text: step.text, noUpdate: true }
  }
  if (value && value.length > 2 && step.key !== 'email') {
    // Keep active for visual feedback
    status = 'active'
  }

  return { status, text }
}

const LiveAgentWorkflow = ({ watch }) => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      key: 'companyName',
      label: 'Research Agent',
      icon: FaSearch,
      status: 'idle', // idle, active, done
      text: 'Waiting for input...',
    },
    {
      id: 2,
      key: 'website',
      label: 'Web Scraper',
      icon: FaGlobe,
      status: 'idle',
      text: 'Waiting for input...',
    },
    {
      id: 3,
      key: 'linkedin',
      label: 'Data Enrichment',
      icon: FaRobot,
      status: 'idle',
      text: 'Waiting for input...',
    },
    {
      id: 4,
      key: 'email',
      label: 'Report Delivery',
      icon: FaFilePdf,
      status: 'idle',
      text: 'Waiting for input...',
    },
  ])

  const formValues = watch()

  useEffect(() => {
    setSteps((currentSteps) => {
      return currentSteps.map((step) => {
        const value = formValues[step.key]
        const { status, text, noUpdate } = getStepUpdate(step, value)

        if (noUpdate) return step

        // Avoid unnecessary state updates if nothing changed
        if (step.status === status && step.text === text) {
          return step
        }

        return { ...step, status, text }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formValues.companyName,
    formValues.website,
    formValues.linkedin,
    formValues.email,
  ])

  return (
    <div className="w-full max-w-sm bg-[#2C2C2C] border border-gray-600/30 rounded-xl p-6 shadow-2xl overflow-hidden font-mono text-sm relative">
      {/* Glass effect gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center space-x-2 mb-6 border-b border-gray-600/30 pb-4">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-auto text-xs text-gray-400 uppercase tracking-wider font-semibold">
          Live Agent System
        </span>
      </div>

      <div className="space-y-6 relative">
        {steps.map((step, index) => {
          const isActive = step.status === 'active'
          const isDone = step.status === 'done'
          const isIdle = step.status === 'idle'

          return (
            <div
              key={step.id}
              className={clsx(
                'relative flex items-start space-x-4 transition-all duration-300',
                isIdle && 'opacity-40 grayscale',
                (isActive || isDone) && 'opacity-100',
              )}
            >
              {/* Timeline connector */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-gray-600/30" />
              )}

              {/* Icon Bubble */}
              <div
                className={clsx(
                  'relative z-10 flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300',
                  isActive
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : isDone
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-[#1a1a1a] border-gray-600 text-gray-500',
                )}
              >
                {isDone ? (
                  <FaCheck size={10} />
                ) : isActive ? (
                  <step.icon size={10} className="animate-pulse" />
                ) : (
                  <step.icon size={10} />
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={clsx(
                      'font-bold text-xs uppercase tracking-wide',
                      isActive
                        ? 'text-blue-400'
                        : isDone
                        ? 'text-green-400'
                        : 'text-gray-500',
                    )}
                  >
                    {step.label}
                  </h4>
                  {isActive && (
                    <FaCircleNotch className="animate-spin text-blue-400 text-[10px]" />
                  )}
                </div>

                <div className="h-5 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={step.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={clsx(
                        'truncate text-xs',
                        isActive ? 'text-white' : 'text-gray-400',
                      )}
                    >
                      {step.text}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Decorative footer/terminal line */}
      <div className="relative mt-8 pt-4 border-t border-gray-600/30 flex justify-between text-[10px] text-gray-500 font-medium">
        <span>SYS_STATUS: ONLINE</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  )
}

export default LiveAgentWorkflow
