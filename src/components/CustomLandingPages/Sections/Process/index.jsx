import React, { useContext, useRef } from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProcessCard from './ProcessCard'
import { PageBuilderContext } from '../../../../context/PageBuilderContext'

function Process() {
  const { siteContent } = useContext(PageBuilderContext)
  const { getContent } = useSectionsContent(siteContent)
  const section3Content = getContent('Section3')
  const { title, text, steps, subtitle } = section3Content || {}

  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-80%'])

  return (
    <>
      {section3Content && (
        <div className=" bg-transparent ">
          <section
            id={'Section3'}
            ref={targetRef}
            className="relative lg:h-[350vh] xl:h-[300vh] bg-transparent mb-[10vh] md:mb-[5vh] lg:mb-[0vh] xl:mb-0 mt-[10vh]"
          >
            <div className="lg:sticky lg:section1-bg top-0 flex flex-col gap-[20px] md:gap-[30px] lg:h-screen lg:overflow-hidden">
              <div className="w-full flex flex-col items-start justify-end gap-2 md:gap-5 relative z-2 lg:mb-[-10vh] mt-[10vh] px-[10vw]">
                <div className="flex gap-3 font-space-grotesk text-[18px] md:text-[20px] lg:text-[24px] text-white w-[50vw]">
                  <span className="text-[#094BF6]">{'['}</span>
                  <span>{subtitle}</span>
                  <span className="text-[#094BF6]">{']'}</span>
                </div>
                <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#F7F9FF] font-space-grotesk font-[700] text-[32px] md:text-[40px] lg:text-[50px] lg:w-[30vw]">
                  {title}
                </h3>
                <p className="text-[#F7F9FF] font-[400] text-[18px] md:text-[20px] text-left lg:w-[35vw] font-poppins">
                  {text}
                </p>
              </div>

              {/* Apply motion to Y-axis for vertical scroll effect */}
              <motion.div
                style={{ y }}
                className="hidden lg:flex flex-col gap-10 items-end relative left-[80px] z-10 px-[10vw]  "
              >
                {steps?.map((step) => (
                  <ProcessCard step={step} />
                ))}
              </motion.div>

              <div className="lg:hidden flex flex-col gap-10">
                {steps?.map((step) => (
                  <ProcessCard step={step} />
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default Process
