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
  let text = 'WAITING_FOR_INPUT...'

  if (value && value.length > 0) {
    status = 'active'

    switch (step.id) {
      case 1:
        text = `IDENTIFYING_ENTITY: ${value}`
        break
      case 2:
        text = `QUEUING_DEEP_SCAN: ${value}`
        break
      case 3:
        text = `EXTRACTING_ benchmarks`
        break
      case 4: {
        // Simple email regex for "valid" check visual
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(value)) {
          status = 'done' // Mark as done/ready when valid
          text = `ROUTING_PDF_TO: ${value}`
        } else {
          text = `TYPING_RECIPIENT...`
        }
        break
      }
      default:
        text = `PROCESSING...`
    }
  }

  if (step.key === 'email' && step.status === 'done') {
    // keep done
    return { status: step.status, text: step.text, noUpdate: true }
  }
  if (value && value.length > 2 && step.key !== 'email') {
    // Keep active for visual feedback
    status = 'active'
    text += ' [OK]'
  }

  return { status, text }
}

const LiveAgentWorkflow = ({ watch, isSimulating = false }) => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      key: 'companyName',
      label: 'RESEARCH_AGENT',
      icon: FaSearch,
      status: 'idle', // idle, active, done
      text: 'WAITING_FOR_INPUT...',
    },
    {
      id: 2,
      key: 'website',
      label: 'WEB_SCRAPER',
      icon: FaGlobe,
      status: 'idle',
      text: 'WAITING_FOR_INPUT...',
    },
    {
      id: 3,
      key: 'linkedin',
      label: 'DATA_ENRICHMENT',
      icon: FaRobot,
      status: 'idle',
      text: 'WAITING_FOR_INPUT...',
    },
    {
      id: 4,
      key: 'email',
      label: 'REPORT_DELIVERY',
      icon: FaFilePdf,
      status: 'idle',
      text: 'WAITING_FOR_INPUT...',
    },
  ])

  const formValues = watch()

  useEffect(() => {
    if (isSimulating) {
      setSteps((currentSteps) =>
        currentSteps.map((step) => ({
          ...step,
          status: 'done',
          text: 'INPUT_VERIFIED',
        })),
      )
      return
    }

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
    isSimulating,
  ])

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden font-mono text-sm relative">
      {/* HUD Lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/10" />

      <div className="relative flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="ml-auto text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
          {isSimulating ? 'SYSTEM_ACTIVE' : 'LIVE_AGENT_MONITOR'}
        </span>
      </div>

      <div className="space-y-8 relative pl-2">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-gray-100" />

        {steps.map((step, index) => {
          const isActive = step.status === 'active'
          const isDone = step.status === 'done'
          const isIdle = step.status === 'idle'

          return (
            <div
              key={step.id}
              className={clsx(
                'relative flex items-start space-x-4 transition-all duration-300',
                isIdle && 'opacity-50 grayscale',
                (isActive || isDone) && 'opacity-100',
              )}
            >
              {/* Icon Bubble */}
              <div
                className={clsx(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 bg-white shadow-sm',
                  isActive
                    ? 'border-blue-500 text-blue-500 ring-2 ring-blue-100'
                    : isDone
                    ? 'border-green-500 text-green-500'
                    : 'border-gray-200 text-gray-400',
                )}
              >
                {isDone ? (
                  <FaCheck size={12} />
                ) : isActive ? (
                  <step.icon size={12} className="animate-pulse" />
                ) : (
                  <step.icon size={12} />
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={clsx(
                      'font-bold text-xs uppercase tracking-wider',
                      isActive
                        ? 'text-blue-600'
                        : isDone
                        ? 'text-green-600'
                        : 'text-gray-500',
                    )}
                  >
                    {step.label}
                  </h4>
                  {isActive && (
                    <FaCircleNotch className="animate-spin text-blue-500 text-[10px]" />
                  )}
                </div>

                <div className="h-5 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={step.text}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.2 }}
                      className={clsx(
                        'truncate text-[10px]',
                        isActive ? 'text-gray-800' : 'text-gray-400',
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
      <div className="relative mt-8 pt-4 border-t border-gray-100 flex justify-between text-[10px] text-gray-400 font-mono">
        <span>STATUS: {isSimulating ? 'EXECUTING' : 'IDLE'}</span>
        <span>PING: 14ms</span>
      </div>
    </div>
  )
}

export default LiveAgentWorkflow
