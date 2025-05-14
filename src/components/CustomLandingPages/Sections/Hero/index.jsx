import React, { useContext } from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import styles from '../styles.module.css'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { scrollToSection } from '../../../../utilities/helpers'
import { PageBuilderContext } from '../../../../context/PageBuilderContext'

const Hero = () => {
  const { siteContent } = useContext(PageBuilderContext)
  const { getContent } = useSectionsContent(siteContent)
  const section1Content = getContent('Section1')
  const section2Content = getContent('Section2')
  const { visible: section2Visible } = section2Content || {}
  const { title, description, btnText, btnUrl } = section1Content || {}
  return (
    <>
      {section1Content && (
        <section
          id="Section1"
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

            {section2Visible && (
              <div
                onClick={() => scrollToSection(btnUrl)}
                className="group w-fit relative md:text-[24px] font-poppins font-[500] flex items-center gap-2 px-5 py-2 cursor-pointer rounded-[4px] text-white bg-[#2957FF] transition-colors hover:bg-main/90"
              >
                {btnText}
                <ArrowRightAltIcon className="transition-transform group-hover:translate-x-1 text-[30px]" />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

export default Hero
