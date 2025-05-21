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

function PlugnHireSection() {
  const [selected, setSelected] = useState(0)
  const maxWidth900 = useMediaQuery('(max-width: 900px)')
  const maxWidth600 = useMediaQuery('(max-width: 600px)')

  return (
    <>
      <div className="hidden md:flex items-center justify-center mb-[10vh]">
        <div
          className={`${styles.bg} flex justify-center items-center gap-10 flex-row  w-[95vw] lg:w-[80vw] xl:w-[60vw]  `}
        >
          <div className="flex flex-col gap-5 ms-10">
            {content.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 h-[60px] lg:h-[90px] rounded-[20px] p-5 cursor-pointer ${
                  selected === index ? 'bg-new-black' : 'bg-transparent'
                }`}
                onClick={() => setSelected(index)}
              >
                {selected === index && (
                  <Image src={CircleIcon} alt="circle" width={60} height={60} />
                )}
                <h3
                  className={`text-[20px] lg:text-[28px] font-[600] font-outfit whitespace-nowrap ${
                    selected === index ? 'text-white' : 'text-new-black'
                  }`}
                >
                  {item.name}
                </h3>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-0 rounded-[20px] max-w-[420px] h-[50vh]">
            <h2 className="text-center text-[28px] font-bold text-black mb-2">
              Benefits
            </h2>
            <p
              className="text-gray-700 text-[15px] text-center mb-2"
              dangerouslySetInnerHTML={{
                __html: maxWidth900 ? '' : content[selected].benefits.title,
              }}
            />
            <ul className="flex flex-col gap-1 mb-4 mt-2">
              {content[selected].benefits.data.map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-[16px] text-new-black font-outfit"
                >
                  <span className="text-new-black ">&#10003;</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://lyrai-chat.lyrise.ai/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-black text-white rounded-full px-8 py-3 text-[16px] font-semibold hover:bg-gray-900 transition-colors duration-200 mx-auto"
            >
              Start now
            </a>
          </div>
        </div>
      </div>
      {/* mobile view */}
      <div className="flex items-center justify-center flex-col gap-5 md:hidden mt-[10vh] mb-[10vh]">
        <Image src={PlugnHireMobile} alt="plugnhire" width={200} height={50} />
        <div className="flex items-center justify-center flex-col sm:flex-row gap-2 bg-[#ececec] rounded-[20px] p-2 mx-5 pt-5">
          <div className="flex flex-col gap-5 mx-5">
            {content.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center justify-center sm:justify-start gap-2 h-[60px] lg:h-[90px] rounded-[20px] p-5 cursor-pointer  ${
                  selected === i ? 'bg-new-black' : 'bg-[#c4c4c4]'
                }`}
                onClick={() => setSelected(i)}
              >
                {selected === i && (
                  <Image
                    src={CircleIcon}
                    alt="circle"
                    width={maxWidth600 ? 40 : 60}
                    height={60}
                  />
                )}
                <h3
                  className={`text-[16px] md:text-[20px] lg:text-[28px] font-[600] font-outfit whitespace-nowrap ${
                    selected === i ? 'text-white' : 'text-new-black'
                  }`}
                >
                  {item.name}
                </h3>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-0 rounded-[20px] max-w-[420px] h-[50vh]">
            <h2 className="text-center text-[18px] md:text-[20px] lg:text-[28px] font-bold text-black lg:mb-2">
              Benefits
            </h2>
            <p
              className="text-gray-700 text-[15px] text-center lg:mb-2"
              dangerouslySetInnerHTML={{
                __html: maxWidth900 ? '' : content[selected].benefits.title,
              }}
            />
            <ul className="flex flex-col gap-1 lg:mb-4 mt-2">
              {content[selected].benefits.data.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-[16px] text-new-black font-outfit"
                >
                  <span className="text-new-black ">&#10003;</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://lyrai-chat.lyrise.ai/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-black text-white rounded-full px-4 py-2 lg:px-8 lg:py-3 text-[14px] lg:text-[16px] font-semibold hover:bg-gray-900 transition-colors duration-200 mx-auto"
            >
              Start now
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlugnHireSection
