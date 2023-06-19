import React from 'react'
import Cards from './HiringCards/Cards'
import HiringHeading from './HiringHeading.js/HiringHeading'

const HiringType = () => {
  return (
    <div className="container">
      <HiringHeading />
      <Cards section="HiringTypeSection" />
    </div>
  )
}

export default HiringType
