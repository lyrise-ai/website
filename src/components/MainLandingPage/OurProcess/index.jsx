import React from 'react'
import { useMediaQuery } from '@mui/material'

const content = {
  title: 'Process Map',
  subtitle: 'when,what and why?',
}

// ROI Visualization Component
const ROIVisualization = () => {
  const percentage = 70 // 4x ROI represented as 80% of the circle
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const maxWidth = useMediaQuery('(max-width: 1024px)')

  return (
    <div className="bg-white rounded-3xl p-4 lg:p-8 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Left side - ROI Circle */}
        <div className="relative">
          <div className="mb-2">
            <span className="text-gray-600 font-medium text-lg">ROI</span>
          </div>
          <div className="relative w-40 lg:w-60 h-40 lg:h-60">
            {/* Background circle */}
            <svg
              className="w-40 lg:w-56 h-40 lg:h-56 transform "
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#c2c2c2"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#000000"
                strokeWidth="16"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                // strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 -top-3 -left-3 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">4x</span>
            </div>
          </div>
        </div>

        {/* Right side - Money breakdown */}
        <div className="flex flex-col gap-6 ml-8">
          {/* Money Saved */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600 font-medium">Money Saved</span>
            </div>
            <span className="text-2xl lg:text-3xl font-bold text-gray-800">
              $500,000
            </span>
          </div>

          {/* Expenses */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">Expenses</span>
            </div>
            <span className="text-2xl lg:text-3xl font-bold text-gray-800">
              $100,000
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function OurProcess() {
  const { title, subtitle } = content
  return (
    <section>
      <div className="w-full flex flex-col gap-5 md:gap-7 text-white py-10 px-0 font-outfit">
        {/* Header Section */}
        <div className="flex flex-col gap-3 xl:mx-[11vw] px-5 xl:px-0">
          <div className="flex flex-col gap-1">
            {/* title */}
            <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] lg:w-[30vw] leading-[120%]">
              {title}
            </h3>
            <p className="text-[#999999] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] lg:w-[30vw] leading-[100%]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 w-full xl:px-[11vw] px-5">
          <div className="flex flex-col gap-4">
            <p className="text-[#3f3f3f] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] leading-[110%]">
              We show you how to improve your process with clear outputs: more
              time freed up, more money generated, or your custom KPIs.
            </p>
            <p className="text-[#3f3f3f] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] leading-[110%]">
              This is presented in a simple{' '}
              <b className="text-[#2C2C2C]">ROI report</b>, demonstrating
              data-driven potential for increased productivity that could range
              from <b className="text-[#2C2C2C]">2-5x</b> through AI &
              automation.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-[#3f3f3f] font-outfit font-[700] text-[16px] md:text-[20px] lg:text-[24px] leading-[110%]">
                Includes:
              </p>
              <p className="text-[#3f3f3f] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] leading-[110%]">
                2-week workshop with stakeholders BPMN-based process map
                Time/cost/role tagging Throughput + cost analysis ROI calculator
              </p>
              <p className="text-[#3f3f3f] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] leading-[110%]">
                AI + Automation Roadmap (2–5x profit potential)
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[#999999] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] lg:w-[30vw] leading-[100%]">
              Here&apos;s your ROI for the first year:
            </p>
            <ROIVisualization />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurProcess
