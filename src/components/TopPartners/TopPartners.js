import React from 'react'
import Title from '../shared/Title/Title'
import styles from './styles.module.css'
import { maskStyle } from './style'
import PartnersSlider from './PartnersSlider'

function TopPartners() {
  return (
    <div>
      <div className="container" style={{ marginBottom: '24px' }}>
        <Title>LyRise Top Partners</Title>
      </div>
      <div className={styles.mask} style={maskStyle}>
        <div
          style={{
            overflow: 'visible',
          }}
        >
          <PartnersSlider />
        </div>
      </div>
    </div>
  )
}
export default TopPartners
