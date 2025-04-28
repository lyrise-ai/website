import React, { useState, useEffect } from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import styles from '../styles.module.css'
import MarqueeWrapper from './MarqueeWrapper'
import Image from 'next/legacy/image'

function LogosMarquee() {
  const { getContent } = useSectionsContent()
  const logosMarqueeContent = getContent('LOGO_SECTION')
  const { logoNumbers } = logosMarqueeContent
  const [logos, setLogos] = useState([])

  useEffect(() => {
    const loadLogos = async () => {
      const loadedLogos = []

      for (let i = 1; i <= logoNumbers; i++) {
        try {
          // Dynamic import for each logo
          const logoModule = await import(
            `../../../../assets/pages/logo_section/logo_section_${i}.svg`
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
    <div className={styles.logo_section}>
      <MarqueeWrapper>
        <div className="flex items-center gap-[20px] pe-[20px] md:gap-[50px] md:pe-[50px]">
          {logos.map((logo, index) => (
            <Image
              key={`logo-${index + 1}`}
              src={logo.src}
              className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
              alt={logo.alt}
              width={100}
              height={100}
            />
          ))}
        </div>
      </MarqueeWrapper>
    </div>
  )
}

export default LogosMarquee
