import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaGlobe,
  FaRobot,
  FaFilePdf,
  FaCircleNotch,
} from 'react-icons/fa'
import clsx from 'clsx'

const simulationSteps = [
  {
    id: 1,
    label: 'Initializing Research Agent',
    icon: FaSearch,
    description: 'Connecting to public business regitries...',
  },
  {
    id: 2,
    label: 'Scanning Business Workflows',
    icon: FaGlobe,
    description: 'Analyzing digital footprint & public operational data...',
  },
  {
    id: 3,
    label: 'Enriching Employee Data',
    icon: FaRobot,
    description: 'Cross-referencing industry benchmarks...',
  },
  {
    id: 4,
    label: 'Compiling & Sending Report',
    icon: FaFilePdf,
    description: 'Standardizing data format & generating PDF...',
  },
]

const ExecutionSimulation = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (activeStep < simulationSteps.length) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1)
      }, 2500) // 2.5 seconds per step

      return () => clearTimeout(timer)
    }
    // All steps done
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 500)
    return () => clearTimeout(completeTimer)
  }, [activeStep, onComplete])

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden bg-[#2C2C2C] rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="popLayout" initial={false}>
          {simulationSteps.map((step, index) => {
            // Calculate offset for vertical carousel effect
            // We want the active step to be roughly in the middle (index - activeStep)
            const offset = index - activeStep
            const isActive = index === activeStep

            // Only show steps around the active one to keep it clean (optional, but good for carousels)
            if (offset < -1 || offset > 2) return null

            return (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  y: offset * 80, // Vertical spacing
                  scale: isActive ? 1.1 : 0.9,
                  zIndex: isActive ? 10 : 0,
                  filter: isActive ? 'blur(0px)' : 'blur(2px)',
                }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={clsx(
                  'absolute top-1/2 left-0 right-0 -mt-10 flex items-center p-4 rounded-xl border transition-colors duration-500',
                  isActive
                    ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                    : 'bg-transparent border-transparent',
                )}
              >
                <div
                  className={clsx(
                    'flex items-center justify-center w-12 h-12 rounded-full mr-4 shrink-0 transition-colors duration-500',
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400',
                  )}
                >
                  {isActive ? (
                    <FaCircleNotch className="animate-spin text-xl" />
                  ) : (
                    <step.icon className="text-xl" />
                  )}
                </div>

                <div>
                  <h3
                    className={clsx(
                      'font-bold text-lg transition-colors duration-500',
                      isActive ? 'text-white' : 'text-gray-400',
                    )}
                  >
                    {step.label}
                  </h3>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-blue-200 text-sm mt-1"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Progress Bar at bottom */}
      <div className="absolute bottom-6 left-8 right-8 h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(
              (activeStep / simulationSteps.length) * 100,
              100,
            )}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

export default ExecutionSimulation
