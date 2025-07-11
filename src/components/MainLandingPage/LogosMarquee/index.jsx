import React, { useState, useEffect, useContext } from 'react'
import styles from './styles.module.css'
import Image from 'next/legacy/image'
import MarqueeWrapper from '../../CustomLandingPages/Sections/LogosMarquee/MarqueeWrapper'
import { useMediaQuery } from '@mui/material'

function LogosMarquee() {
  const maxWidth768 = useMediaQuery('(max-width: 768px)')
  const logoNumbers = 9
  const [logos, setLogos] = useState([])

  useEffect(() => {
    const loadLogos = async () => {
      const loadedLogos = []

      for (let i = 1; i <= logoNumbers; i++) {
        try {
          // Dynamic import for each logo
          const logoModule = await import(
            `../../../assets/rebranding/logos/logo_section_${i}.svg`
          )
          loadedLogos.push({
            src: logoModule.default,
            alt: `Logo ${i}`,
          })
        } catch (error) {
          console.error(`Failed to load logo ${i}:`, error)
        }
      }

      setLogos(loadedLogos)
    }

    loadLogos()
  }, [logoNumbers])

  return (
    <>
      <div
        id="Section4"
        className={styles.logo_section}
        style={{ marginTop: '10vh' }}
      >
        <h1 className=" text-center md:text-[32px] text-[24px] leading-[100%] font-semibold text-new-black font-outfit md:mb-[10vh] mb-[2vh]">
          People We Worked With
        </h1>
        <MarqueeWrapper>
          <div className="flex items-center gap-[20px] pe-[20px] md:gap-[50px] md:pe-[50px]">
            {logos.map((logo, index) => (
              <div className="flex items-center justify-center  md:px-10 px-5 py-2 bg-[#2C2C2C5C] rounded-[8px] hover:scale-105 transition-all duration-300 cursor-pointer">
                <Image
                  key={`logo-${index + 1}`}
                  src={logo.src}
                  alt={logo.alt}
                  width={maxWidth768 ? 80 : 120}
                  height={maxWidth768 ? 40 : 60}
                />
              </div>
            ))}
          </div>
        </MarqueeWrapper>
      </div>
    </>
  )
}

export default LogosMarquee
