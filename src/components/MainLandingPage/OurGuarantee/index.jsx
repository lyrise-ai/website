import React, { useState } from 'react'
import CircleIcon from '../../../assets/rebranding/circule-selector.svg'
import Image from 'next/legacy/image'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material'
import PlugnHireMobile from '../../../assets/rebranding/plugnhire-logo.svg'

const content = [
  {
    id: 0,
    name: 'Plug into your database',
    benefits: {
      title:
        "Our fine tuned AI matching algorithm for tech roles analyzes data such as domain expertise and industry projects in the portfolio; it's like a dream coming true for tech recruiters!",
      data: [
        'Generate hyper specific tech talent job descriptions',
        'Upload your own job description',
        'ATS/HRIS integration',
        'Connecting with multiple talent pools (Drive - LinkedIn - Recruiter)',
        'Kaggle and Github background checks',
      ],
    },
  },
  {
    id: 1,
    name: 'Plug into our database',
    benefits: {
      title: `Plug into the right AI agent that will perform the task for you to <b>save 200x the time & 10x cost</b>. For example our HR Agent "Plug-N-Hire"`,
      data: [
        'Generate hyper specific tech talent job descriptions',
        'Upload your own job description',
        'Access our talent pool of 3,000 vetted AI engineers',
        'AI will match your job description with the top 10 candidates',
        'Kaggle and Github background checks',
      ],
    },
  },
]

function OurGuarantee() {
  const [selected, setSelected] = useState(0)
  const maxWidth900 = useMediaQuery('(max-width: 900px)')
  const maxWidth600 = useMediaQuery('(max-width: 600px)')

  return (
    <>
      <div className="hidden lg:flex items-center justify-center my-[8vh] mb-5 ">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] leading-[120%]">
              Our Guarantee
            </h3>
            <p className="text-center text-[18px] text-new-black font-outfit">
              Results-Guaranteed or You Don’t Pay
            </p>
          </div>
          <div
            className={`bg-[#ececec] rounded-[20px] px-[10vw] grid grid-cols-[1fr_0.6fr]  w-[80vw]`}
          >
            <div className="flex flex-col ms-0  mt-[10vh] border-r pr-[1vw] mr-[6vw]">
              <div className="flex flex-col gap-3">
                <p className="text-[24px] font-[400] text-[#2C2C2C] mb-2 font-outfit leading-[120%]">
                  If we can’t show you how to make $30K/month or 3x your current
                  profits, we won’t work with you.
                </p>
                <h3 className="text-[20px] font-bold text-[#2c2c2c] mb-2 font-outfit leading-[120%]">
                  No upfront costs, no hidden fees—just results.
                </h3>
              </div>

              <a
                href="https://calendly.com/elena-lyrise/30min"
                target={'_blank'}
                rel="noopener noreferrer"
                className="w-fit mt-[5vh] bg-black text-white rounded-full px-8 py-3 text-[16px] font-semibold hover:bg-gray-900 transition-colors duration-200"
              >
                Start now
              </a>
            </div>
            <div className="flex flex-col justify-center gap-0 rounded-[20px] h-[50vh] mt-[-40px]">
              <h2 className="text-center text-[28px] font-bold text-black mb-2 border-b  pb-2">
                Our Promise
              </h2>
              <ul className="flex flex-col gap-1 mb-4 mt-2">
                <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                  <span className="text-new-black ">&#10003;</span>
                  <span>Transparent Process Mapping</span>
                </li>
                <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                  <span className="text-new-black ">&#10003;</span>
                  <span>Custom AI Solutions Tailored to Your Needs</span>
                </li>
                <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                  <span className="text-new-black ">&#10003;</span>
                  <span>Guaranteed Results</span>
                </li>
                <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                  <span className="text-new-black ">&#10003;</span>
                  <span>Pay Only When You See Profit Improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* mobile view */}
      <div className="lg:hidden flex items-center justify-center flex-col gap-5  mt-[10vh] mb-[10vh] px-[5vw]">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className=" text-center md:text-[32px] text-[24px] leading-[100%] font-semibold text-new-black font-outfit">
            Our Guarantee
          </h1>
          <p className="text-center text-[16px] text-new-black font-outfit">
            Results-Guaranteed or You Don’t Pay
          </p>
        </div>
        <div className="flex items-center justify-center flex-col sm:flex-row gap-2 bg-[#ececec] rounded-[20px] p-2  pt-5 w-full px-10">
          <div className="flex flex-col ms-0  w-[50vw] border-r pr-[5vw] mr-[5vw]">
            <div className="flex flex-col gap-3">
              <p className="text-[20px] font-[400] text-[#2C2C2C] mb-2 font-outfit leading-[120%] ">
                If we can’t show you how to make $30K/month or 3x your current
                profits, we won’t work with you.
              </p>
              <h3 className="text-[18px] font-bold text-[#2c2c2c] mb-2 font-outfit leading-[120%] ">
                No upfront costs, no hidden fees—just results.
              </h3>
            </div>

            <a
              href="https://calendly.com/elena-lyrise/30min"
              target={'_blank'}
              rel="noopener noreferrer"
              className="w-fit mt-[5vh] bg-black text-white rounded-full px-8 py-3 text-[16px] font-semibold hover:bg-gray-900 transition-colors duration-200 text-center"
            >
              Start now
            </a>
          </div>

          <div className="flex flex-col justify-center gap-0 rounded-[20px] max-w-[420px] h-[50vh] mt-[-40px] ">
            <h2 className="text-center text-[28px] font-bold text-black mb-2 border-b  pb-2">
              Our Promise
            </h2>
            <ul className="flex flex-col gap-1 mb-4 mt-2">
              <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                <span className="text-new-black ">&#10003;</span>
                <span>Transparent Process Mapping</span>
              </li>
              <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                <span className="text-new-black ">&#10003;</span>
                <span>Custom AI Solutions Tailored to Your Needs</span>
              </li>
              <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                <span className="text-new-black ">&#10003;</span>
                <span>Guaranteed Results</span>
              </li>
              <li className="flex items-start gap-2 text-[16px] text-new-black font-outfit">
                <span className="text-new-black ">&#10003;</span>
                <span>Pay Only When You See Profit Improvement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default OurGuarantee
