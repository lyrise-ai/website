import React, { useContext, useEffect, useState } from 'react'
import styles from './styles.module.css'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import Image from 'next/legacy/image'
import Link from 'next/link'

const LYRISEAI_PRODUCT_URL = 'https://lyrai-chat.lyrise.ai'

const content = {
  title: 'Media & Events',
  subtitle:
    'We believe in being part of the conversation shaping the future of AI.',
  text: 'Check out where we’ve been featured, the stages we’ve spoken on, and the communities we’re engaging with.',
  cards: [
    {
      index: 0,
      image: {
        src: '1.png',
        alt: 'Techstars powered by JP Morgan',
      },
      title: 'Techstars powered by JP Morgan',
      description:
        'LyRise secures a spot in Techstars Accelerator powered by JP Morgan',
      link: 'https://www.techstars.com/newsroom/techstars-atlanta-powered-by-j-p-morgan-announces-inaugural-class-of-2022',
    },
    {
      index: 1,
      image: {
        src: '2.png',
        alt: 'Meta AI Case Study',
      },
      title: 'Meta AI Case Study',
      description:
        'How LyRise uses Meta Llama to match candidates to AI careers',
      link: 'https://ai.meta.com/blog/lyrise-hiring-ai-talent-meta-llama/',
    },
    {
      index: 2,
      image: {
        src: '4.png',
        alt: 'VentureBeat',
      },
      title: 'VentureBeat',
      description: 'LyRise was featured alongside Perplexity, IBM, Walmart',
      link: 'https://venturebeat.com/ai/how-enterprises-are-using-open-source-llms-16-examples/',
    },
    {
      index: 3,
      image: {
        src: '3.png',
        alt: 'Forbes 30U30',
      },
      title: 'Forbes 30U30',
      description: 'Our co-founder was featured on Forbes 30U30',
      link: 'https://www.forbesmiddleeast.com/lists/30-under-30-2021/marc-banoub/',
    },
  ],
}

function MediaEvents() {
  const { title, subtitle, text, cards } = content || {}
  const [isHovered, setIsHovered] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState([])

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = cards.map(async (card) => {
        try {
          const imageModule = await import(
            `../../../assets/rebranding/mediaEvents/${card.image.src}`
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
  }, [cards])

  return (
    <>
      <section id="Section7">
        <div className="w-full flex flex-col gap-12 text-white  mb-[20vh]">
          {/* Header Section */}
          <div className="flex flex-col gap-3 mx-[11vw]">
            <div className="flex flex-col gap-1">
              {/* title */}
              <h1 className="text-[32px] leading-[100%] font-semibold text-new-black font-outfit mb-2">
                {title}
              </h1>
              {/* subtitle */}
              <p className="text-lg text-new-black leading-[120%] ">
                {subtitle}
              </p>
              <p className="text-lg text-new-black leading-[120%]">{text}</p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-9 max-w-6xl w-full mx-[11vw]">
            {cards.map((card) => (
              <Link
                href={card.link}
                target="_blank"
                key={card.index}
                className={`${styles.security_card} ${'xl:hover:scale-[1.1]'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Image
                  src={images[card.index]}
                  alt={card.image.alt}
                  className="rounded-lg object-contain overflow-hidden"
                  height={200}
                  width={200}
                />

                <div className="flex flex-col items-center justify-center gap-2 p-2 text-center">
                  <h3 className="text-[20px] font-[700] font-outfit leading-[120%] ">
                    {card.title}
                  </h3>
                  <p className="text-[15px] font-[400] font-outfit leading-[120%]">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default MediaEvents
