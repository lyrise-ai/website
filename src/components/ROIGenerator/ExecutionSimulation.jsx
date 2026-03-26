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
    description: 'Analysing public business data…',
    stages: ['research'],
  },
  {
    id: 2,
    label: 'Workflow Analysis',
    icon: FaGlobe,
    description: 'Modelling financial assumptions…',
    stages: ['modeler', 'calculator'],
  },
  {
    id: 3,
    label: 'Data Enrichment',
    icon: FaRobot,
    description: 'Benchmarking against industry standards…',
    stages: ['writer'],
  },
  {
    id: 4,
    label: 'Report Generation',
    icon: FaFilePdf,
    description: 'Compiling your personalised insights…',
    stages: ['assemble', 'render'],
  },
]

function stageToStepIndex(stage) {
  for (let i = 0; i < simulationSteps.length; i++) {
    if (simulationSteps[i].stages.includes(stage)) return i
  }
  return -1
}

/**
 * ExecutionSimulation
 *
 * Props:
 *   onComplete   — called when all steps are done
 *   currentStage — optional pipeline stage name from SSE ('research'|'modeler'|…|'done')
 *                  When provided, steps advance based on real pipeline events.
 *                  When absent, falls back to the original timer-based animation.
 */
const ExecutionSimulation = ({ onComplete, currentStage }) => {
  const controlled = currentStage !== undefined
  const [activeStep, setActiveStep] = useState(0)
  const onCompleteRef = React.useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Controlled mode — advance based on real SSE stage events
  useEffect(() => {
    if (!controlled) return undefined

    if (currentStage === 'done') {
      setActiveStep(simulationSteps.length)
      const t = setTimeout(() => onCompleteRef.current?.(), 500)
      return () => clearTimeout(t)
    }

    const idx = stageToStepIndex(currentStage)
    if (idx >= 0) setActiveStep(idx)
    return undefined
  }, [currentStage, controlled])

  // Timer-based fallback (original behaviour when no currentStage prop)
  useEffect(() => {
    if (controlled) return undefined

    if (activeStep < simulationSteps.length) {
      const timer = setTimeout(() => setActiveStep((prev) => prev + 1), 2000)
      return () => clearTimeout(timer)
    }
    const t = setTimeout(() => onCompleteRef.current?.(), 500)
    return () => clearTimeout(t)
  }, [activeStep, controlled])

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden font-sans text-sm">
      <div className="relative z-10 w-full max-w-lg space-y-6">
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold text-gray-900">
            Configuring Your Report
          </h3>
          <p className="text-gray-500 mt-2">
            Please wait while we analyse your business profile.
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
