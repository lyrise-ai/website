import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaGlobe,
  FaRobot,
  FaFilePdf,
  FaCheckCircle,
} from 'react-icons/fa'
import clsx from 'clsx'

const simulationSteps = [
  {
    id: 1,
    label: 'Market Research',
    icon: FaSearch,
    description: 'Analyzing public business data...',
  },
  {
    id: 2,
    label: 'Workflow Analysis',
    icon: FaGlobe,
    description: 'Scanning digital footprint...',
  },
  {
    id: 3,
    label: 'Data Enrichment',
    icon: FaRobot,
    description: 'Benchmarking against industry standards...',
  },
  {
    id: 4,
    label: 'Report Generation',
    icon: FaFilePdf,
    description: 'Compiling your personalized insights...',
  },
]

const ExecutionSimulation = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0)
  const onCompleteRef = React.useRef(onComplete)

  // Keep ref synced with latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (activeStep < simulationSteps.length) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1)
      }, 2000) // Slightly faster? 2.0 seconds

      return () => clearTimeout(timer)
    }
    // All steps done
    const completeTimer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current()
      }
    }, 500)
    return () => clearTimeout(completeTimer)
  }, [activeStep])

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden font-sans text-sm">
      <div className="relative z-10 w-full max-w-lg space-y-6">
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold text-gray-900">
            Configuring Your Report
          </h3>
          <p className="text-gray-500 mt-2">
            Please wait while we analyze your business profile.
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {simulationSteps.map((step, index) => {
            const isActive = index === activeStep
            const isDone = index < activeStep

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  'flex items-center space-x-4 p-4 rounded-xl transition-all duration-500',
                  isActive
                    ? 'bg-white shadow-lg border border-gray-100 scale-105'
                    : 'opacity-50 grayscale',
                )}
              >
                <div
                  className={clsx(
                    'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : isDone
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400',
                  )}
                >
                  {isDone ? <FaCheckCircle /> : <step.icon />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={clsx(
                        'font-semibold text-lg',
                        isActive ? 'text-gray-900' : 'text-gray-500',
                      )}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full animate-pulse">
                        Processing
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="text-gray-500 mt-1"
                    >
                      {step.description}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ExecutionSimulation
