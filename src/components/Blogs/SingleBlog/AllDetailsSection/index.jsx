import React from 'react'
import FixedDetailsSideBar from './FixedDetailsSideBar'
import DetailsSections from '../DetailsSections'

function AllDetailsSection() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[0.5fr_1fr] xl:grid-cols-[0.3fr_1fr] px-5 lg:px-[7%]  lg:gap-[32px] xl:gap-[64px] !font-secondary">
      <FixedDetailsSideBar />
      <DetailsSections />
    </div>
  )
}

export default AllDetailsSection
