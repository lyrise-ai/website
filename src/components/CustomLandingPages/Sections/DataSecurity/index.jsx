import React, { useEffect, useState } from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import styles from '../styles.module.css'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import Image from 'next/legacy/image'

const LYRISEAI_PRODUCT_URL = 'https://lyrai-chat.lyrise.ai'

function DataSecurity() {
  const { getContent } = useSectionsContent()
  const dataSecurityContent = getContent('SECURITY')
  const { title, subtitle, text, cards } = dataSecurityContent
  const [isHovered, setIsHovered] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState([])

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = cards.map(async (card) => {
        try {
          const imageModule = await import(
            `../../../../assets/pages/security/${card.image.src}`
          )
          return imageModule.default
        } catch (error) {
          console.error(`Failed to load image ${card.image.src}:`, error)
          return null
        }
      })
      const loadedImages = await Promise.all(imagePromises)
      setImages(loadedImages.filter(Boolean))
    }
    loadImages()
  }, [])

  return (
    <section id="data-security">
      <div className="w-full flex flex-col gap-12 text-white py-16 mb-12 px-10">
        {/* Header Section */}
        <div className="flex flex-col gap-3 items-center justify-center text-center">
          <div className="flex gap-3 font-space-grotesk text-[18px] md:text-[20px] xl:text-[24px] text-white">
            <span className="text-[#094BF6]">{'['}</span>
            <span>{text}</span>
            <span className="text-[#094BF6]">{']'}</span>
          </div>
          <div className="flex flex-col gap-1">
            {/* title */}
            <h1 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#F7F9FF] font-space-grotesk font-[700]  text-[32px] md:text-[40px] xl:text-[50px] xl:w-[40vw] leading-[120%] ">
              {title}
            </h1>
            {/* subtitle */}
            <p className="text-lg text-gray-300 lg:max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-9 max-w-6xl w-full mx-auto">
          {cards.map((card) => (
            <div
              key={card.index}
              className={`${styles.security_card} ${
                card.index === 1 && !isHovered
                  ? 'xl:scale-[1.1]'
                  : 'xl:hover:scale-[1.1]'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={images[card.index]}
                alt={card.image.alt}
                className="rounded-lg object-cover overflow-hidden"
                height={500}
              />

              <div className="flex flex-col flex-grow gap-4">
                <div className="flex flex-col flex-grow gap-1">
                  <h3 className="text-[24px] font-[700] font-space-grotesk leading-[120%] ">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-[15px] font-[400] font-poppins leading-[120%]">
                    {card.description}
                  </p>
                </div>

                <a
                  href={LYRISEAI_PRODUCT_URL + '/signup'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit group relative text-[14px] flex items-center gap-2 px-4 py-2 h-[36px] rounded-[4px] text-white bg-main transition-colors hover:bg-main/90 cursor-pointer"
                >
                  Get Started
                  <ArrowRightAltIcon className="transition-transform group-hover:translate-x-1 !size-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DataSecurity
