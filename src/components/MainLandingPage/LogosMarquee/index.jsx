import React, { useState, useEffect, useContext } from 'react'
import styles from './styles.module.css'
import Image from 'next/legacy/image'
import MarqueeWrapper from '../../CustomLandingPages/Sections/LogosMarquee/MarqueeWrapper'

function LogosMarquee() {
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
        <h1 className=" text-center text-[32px] leading-[100%] font-semibold text-new-black font-outfit mb-[10vh]">
          People We Worked With
        </h1>
        <MarqueeWrapper>
          <div className="flex items-center gap-[20px] pe-[20px] md:gap-[50px] md:pe-[50px]">
            {logos.map((logo, index) => (
              <div className="flex items-center justify-center  px-10 py-2 bg-[#2C2C2C5C] rounded-[8px] hover:scale-105 transition-all duration-300 cursor-pointer">
                <Image
                  key={`logo-${index + 1}`}
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
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
