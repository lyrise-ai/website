import React, { useRef } from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import { motion, useScroll, useTransform } from 'framer-motion'
import WhyLyriseCards from './WhyLyriseCards'

function WhyLyRise() {
  const { getContent } = useSectionsContent()
  const section6Content = getContent('Section6')
  const { title, subtitle, text, cards } = section6Content || {}

  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ['60%', '-15%'])
  return (
    <>
      {section6Content && (
        <section
          id={'Section6'}
          ref={targetRef}
          className="relative lg:h-[300vh] bg-transparent mb-[10vh] lg:mb-0"
        >
          <div className="lg:sticky top-0 flex flex-col gap-[30px] lg:h-screen items-center lg:overflow-hidden">
            <div className="w-full flex flex-col xl:items-end justify-end gap-5 relative z-2 xl:mb-[-5vh] 3xl:mb-[-5vh] mt-[10vh] 3xl:mt-[20vh] px-[50px]">
              <div className="flex gap-3 font-space-grotesk text-[18px] lg:text-[24px] text-white xl:w-[40vw]">
                <span className="text-[#094BF6]">{'['}</span>
                <span>{subtitle}</span>
                <span className="text-[#094BF6]">{']'}</span>
              </div>
              <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#F7F9FF] font-space-grotesk font-[700] text-[32px] lg:text-[50px] xl:w-[40vw] leading-[100%]">
                {title}
              </h3>
              <p className="text-[#F7F9FF] font-[400] text-[20px] text-left xl:w-[40vw] font-poppins">
                {text}
              </p>
            </div>
            <motion.div
              style={{ x }}
              className="hidden xl:flex  gap-6 relative z-10 px-[50px]"
            >
              {cards.map((card) => (
                <WhyLyriseCards key={card.id} card={card} />
              ))}
            </motion.div>
            <div className="xl:hidden flex flex-col gap-10">
              {cards.map((card) => (
                <WhyLyriseCards key={card.id} card={card} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default WhyLyRise
