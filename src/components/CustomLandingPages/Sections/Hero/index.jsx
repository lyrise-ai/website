import React from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import styles from '../styles.module.css'

const Hero = () => {
  const { getContent } = useSectionsContent()
  const heroContent = getContent('HERO')
  const { title, description } = heroContent
  return (
    <section
      className={`flex items-center justify-center h-[50vh] md:h-[80vh] w-full ${styles.sectionBg}`}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center justify-start gap-2 md:gap-0">
          <h2 className="font-space-grotesk text-center text-[32px] md:text-[64px] font-bold text-white ">
            {title}
          </h2>
          <h3 className="font-poppins text-[18px] text-white text-center md:max-w-[45vw] lg:max-w-[35vw]">
            {description}
          </h3>
        </div>

        {/* <WaitlistModal /> */}
      </div>
    </section>
  )
}

export default Hero
