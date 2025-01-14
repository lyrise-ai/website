import React from 'react'
import FixedDetailsSideBar from './FixedDetailsSideBar'
import DetailsSections from '../DetailsSections'

function AllDetailsSection() {
  return (
    <div className="relative grid grid-cols-[0.3fr_1fr] px-[7%] gap-[64px] !font-secondary">
      <FixedDetailsSideBar />
      <DetailsSections />
    </div>
  )
}

export default AllDetailsSection
