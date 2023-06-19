import React from 'react'
import CustomizedAccordions from '../AISection/Accordion'
import accordionData from './accordionData'
import styles from './styles.module.css'

const FAQSection = () => {
  return (
    <div style={{ backgroundColor: '#F1F5F8', padding: '80px 0' }}>
      <div
        className="container"
        id="FAQ"
        ref={() => {
          // if (node) console.log('FAQ', node)
          const currentLocation = window.location.href
          const hasFAQAcnhor = currentLocation.includes('#FAQ')
          if (hasFAQAcnhor) {
            const anchorFAQ = document.getElementById('FAQ')
            if (anchorFAQ) {
              anchorFAQ.scrollIntoView({ behavior: 'smooth' })
            }
          }
        }}
      >
        <div className={styles.accordion__container}>
          <h3 className={styles.FAQ__heading}>Frequently asked questions</h3>
          <CustomizedAccordions AccordionData={accordionData} align="right" />
        </div>
      </div>
    </div>
  )
}

export default FAQSection
