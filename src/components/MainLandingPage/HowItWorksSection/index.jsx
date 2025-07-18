import React, { useContext, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HowItWorksCard from './HowItWorksCard'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material'

const content = {
  title: 'How It Works',
  text: 'Our process is simple, and it starts with understanding your business.',
  subtext: 'Here’s how we make it happen:',
  steps: [
    {
      title: 'Step 1',
      subtitle: 'Map Your Current Process',
      description:
        'We’ll model your existing business processes, assigning time durations, mapping roles, systems, and costs.',
    },
    {
      title: 'Step 2',
      subtitle: 'Identify Opportunities',
      description:
        'Using data-driven insights, we’ll show how improvements will save time, increase revenue, and hit your KPIs—plus, a simple ROI calculator will demonstrate a potential 3x profit boost.',
    },
    {
      title: 'Step 3',
      subtitle: 'Implement with AI Agents',
      description:
        'We integrate powerful AI agents into your operations, streamlining finance, HR, sales, legal, and more to boost efficiency and profitability.',
    },
  ],
}

function HowItWorksSection() {
  const maxWidth768 = useMediaQuery('(max-width: 768px)')
  const { title, text, steps, subtext } = content || {}

  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-80%'])

  return (
    <>
      <div className={`bg-transparent `}>
        <section
          id={'Section3'}
          ref={targetRef}
          className="relative lg:h-[350vh] xl:h-[300vh] bg-transparent mb-[10vh] md:mb-[5vh] lg:mb-[0vh] xl:mb-0 md:mt-[-15vh]"
        >
          <div
            className={`lg:sticky lg:section1-bg top-0 flex flex-col gap-[20px] md:gap-[30px] lg:h-screen lg:overflow-hidden ${
              maxWidth768 ? '' : styles.bg
            }`}
          >
            <div className="w-full flex flex-col items-start justify-end gap-2 md:gap-3 relative z-2 lg:mb-[-10vh] mt-[10vh] lg:mt-[20vh] px-[10vw]">
              <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] lg:w-[30vw]">
                {title}
              </h3>
              <p className="text-[#20273B] font-[400] text-[18px] md:text-[20px] text-left lg:w-[30vw] font-outfit">
                {text}
              </p>
              <p className="text-[#20273B] font-[400] text-[18px] md:text-[20px] text-left lg:w-[30vw] font-outfit">
                {subtext}
              </p>
            </div>

            {/* Apply motion to Y-axis for vertical scroll effect */}
            <motion.div
              style={{ y }}
              className="hidden lg:flex flex-col gap-10 items-end relative left-[80px] z-10 px-[10vw]  "
            >
              {steps?.map((step) => (
                <HowItWorksCard step={step} />
              ))}
            </motion.div>

            <div className="lg:hidden flex flex-col gap-10">
              {steps?.map((step) => (
                <HowItWorksCard step={step} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HowItWorksSection
