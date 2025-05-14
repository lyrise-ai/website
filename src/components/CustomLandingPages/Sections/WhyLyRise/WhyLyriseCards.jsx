import React, { useEffect, useState } from 'react'
import styles from '../styles.module.css'
import Image from 'next/legacy/image'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'

function WhyLyriseCards({ card }) {
  const { image, title, description, linkUrl, linkText } = card || {}

  const [cardImage, setCardImage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (card) {
      const loadImage = async () => {
        try {
          setIsLoading(true)
          const imageModule = await import(
            `../../../../assets/pages/why-lyrise/${image.src}`
          )
          setCardImage(imageModule.default)
        } catch (error) {
          console.error(`Failed to load image ${image.src}:`, error)
        } finally {
          setIsLoading(false)
        }
      }
      loadImage()
    }
  }, [image.src])

  return (
    <div className={styles.whyLyriseCard}>
      {/* icon */}
      <div className={styles.icon}>
        {!isLoading && <Image src={cardImage} alt={image.alt} loading="lazy" />}
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-[#ffffff] font-[700] text-[20px] lg:text-[27.24px] font-space-grotesk">
          {title}
        </h4>
        <p className="text-[#ffffff] font-[400] text-[16px] lg:text-[18px] font-poppins">
          {description}
        </p>
      </div>
      {linkText && linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3"
        >
          <p className="text-[#3863FF] font-poppins text-[16px] font-[600]">
            {linkText}
          </p>
          <ArrowRightAltIcon className="transition-transform group-hover:translate-x-1 !size-6 text-[#3863FF]" />
        </a>
      )}
      {/* <div className={styles.icon}>
      <Image src={images[FOLDER_PATH + card.image.src]()} alt={card.image.alt} />
      <p>{card.image.alt}</p>
    </div>  */}
    </div>
  )
}

export default WhyLyriseCards
