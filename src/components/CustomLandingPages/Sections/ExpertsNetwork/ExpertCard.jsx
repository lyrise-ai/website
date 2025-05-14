import React, { useEffect, useState } from 'react'
import styles from '../styles.module.css'
import Image from 'next/legacy/image'

function ExpertCard({ expert }) {
  const { name, title, avatar, companies } = expert || {}

  const [expertImage, setExpertImage] = useState(null)
  const [companyImages, setCompanyImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (expert) {
      const loadImages = async () => {
        try {
          setIsLoading(true)

          // Load expert image
          const expertImageModule = await import(
            `../../../../assets/pages/expert-network/experts/${avatar}`
          )
          setExpertImage(expertImageModule.default)

          // Load all company logos in parallel
          const companyImagePromises = companies.map(async (company) => {
            try {
              const companyImageModule = await import(
                `../../../../assets/pages/expert-network/companies/${company.logo}`
              )
              return {
                id: company.id || company.name,
                src: companyImageModule.default,
                name: company.name,
              }
            } catch (err) {
              console.error(
                `Failed to load company logo for ${company.name}:`,
                err,
              )
              return null
            }
          })

          const loadedCompanyImages = await Promise.all(companyImagePromises)
          setCompanyImages(loadedCompanyImages.filter(Boolean))
        } catch (err) {
          console.error('Error loading images:', err)
        } finally {
          setIsLoading(false)
        }
      }

      loadImages()
    }
  }, [companies, avatar])

  return (
    <li className={styles.expertCard}>
      {!isLoading && (
        <Image
          src={expertImage}
          alt={name}
          title={name}
          width={96}
          height={96}
          loading="lazy"
          className={styles.expertAvatar}
        />
      )}
      <figcaption className={styles.card_info}>
        <div className="flex flex-col text-center items-center justify-center gap-0 text-[18px]">
          <h3>{name}</h3>
          <p className="font-semibold text-center text-[18px]">{title}</p>
        </div>
        <ul className="flex items-center justify-center flex-wrap gap-4 mt-4">
          {companyImages.map((company) => (
            <li key={company.id}>
              <Image
                src={company.src}
                alt={company.name}
                title={company.name}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </figcaption>
    </li>
  )
}

export default ExpertCard
