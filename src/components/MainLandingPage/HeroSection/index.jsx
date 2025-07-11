import React, { useState } from 'react'
import styles from './styles.module.css'
import { Grow } from '@mui/material'

function HeroSection() {
  return (
    <>
      <section
        className={`hidden md:flex items-center justify-center h-screen w-full ${styles.bg}`}
      >
        <div className="custom-container w-full flex items-center justify-center relative ">
          <div className=" flex flex-col gap-[25px]">
            {/* <PlugnnHireBtn /> */}
            <GetYourAgentBtn />
            {/* <CommingSoonBtn /> */}
          </div>
        </div>
      </section>
      <section
        className={` flex md:hidden items-center justify-center  w-full ${styles.sectionBg}`}
      >
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center justify-start gap-2 md:gap-0">
            <h2 className="font-space-grotesk text-center text-[32px] leading-[100%] font-bold text-new-black ">
              The Platform For
            </h2>
            <h2 className="font-space-grotesk text-center text-[32px] leading-[100%] font-bold text-new-black ">
              SMEs To 3X Profits
            </h2>
          </div>
          <a
            href="https://calendly.com/elena-lyrise/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-[18px] lg:text-[24px] flex items-center justify-center gap-2 p-1 lg:p-2 px-4 lg:px-4 leading-[24px]  rounded-[30px] text-white bg-new-black transition-colors hover:bg-new-black/85 "
          >
            Get Your AI Agent
          </a>
        </div>
      </section>
    </>
  )
}

export default HeroSection

const PlugnnHireBtn = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={` ${styles.floatingBtn0} absolute  rounded-full w-fit p-1 lg:p-2 px-2 lg:px-3 flex flex-row items-center justify-center gap-3 cursor-pointer ${styles.btnGradient0} `}
    >
      <a
        href="https://plugnhire.lyrise.ai"
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full ${styles.btn0} px-5 lg:px-10 py-1 lg:py-2 text-[16px] font-[400]focus:outline-none  text-[#FFFDFA]`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        PlugnHire
      </a>
      {isHovered && (
        <Grow
          in={isHovered}
          style={{ transformOrigin: '0 ' }}
          {...(isHovered ? { timeout: 500 } : {})}
        >
          <div className="">AI Agents for your Recruiting Team</div>
        </Grow>
      )}
    </div>
  )
}

const GetYourAgentBtn = () => {
  return (
    <div
      className={`${styles.floatingBtn1} absolute rounded-full w-fit  p-2 px-3 flex flex-row items-center justify-center gap-3 cursor-pointer ml-[-115px] `}
    >
      <a
        href="https://lyrai-chat.lyrise.ai/signup"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative text-[18px] lg:text-[24px] flex items-center justify-center gap-2 p-1 lg:p-2 px-2 lg:px-4 leading-[24px]  rounded-[30px] text-white bg-new-black transition-colors hover:bg-new-black/85 "
      >
        Get Your AI Agent
      </a>
    </div>
  )
}

const CommingSoonBtn = () => {
  return (
    <div
      className={`${styles.floatingBtn2} absolute  rounded-full w-fit  p-2 px-3 flex flex-row items-center justify-center gap-3 cursor-pointer ${styles.btnGradient2} `}
    >
      <div
        className={`rounded-full ${styles.btn2} px-3 lg:px-5 py-1 lg:py-2 text-[14px] lg:text-[16px] font-[400]focus:outline-none  text-[#FFFDFA]`}
      >
        Comming Soon
      </div>
    </div>
  )
}
