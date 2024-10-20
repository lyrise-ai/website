import React, { useState } from 'react'
import { EXPERTS } from './config'
import ExpertCard from './ExpertCard'

import 'swiper/css'

import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMediaQuery } from '@mui/material'

const items = EXPERTS.map((expert) => ({
  id: expert.id,
  content: (
    <ExpertCard
      key={expert.id}
      name={expert.name}
      title={expert.title}
      company={expert.company}
      imgSrc={expert.imgSrc}
      workedAtImages={expert.companiesImgs}
    />
  ),
}))

export default function ExpertNetwork() {
  const above1000 = useMediaQuery('(min-width: 1000px)')

  return (
    // added pading & margins to show the slides box shadow that is overflowing
    <div className="flex flex-col items-center gap-5 w-full max-md:overflow-hidden max-md:my-10 max-md:py-10">
      <div className="text-3xl lg:text-4xl font-semibold text-center font-primary mt-20">
        Our AI Expert Network
      </div>
      <Swiper
        loop={!above1000}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        id="expert-network-swiper"
        centeredSlides={!above1000}
        spaceBetween={above1000 ? 10 : 30}
        slidesPerView={above1000 ? 5 : 1}
        modules={[Navigation, Pagination]}
        className="w-[85vw] md:w-[90%] mx-auto !overflow-visible"
      >
        {items.map((item) => (
          <SwiperSlide className="overflow-visible" key={item.id}>
            {item.content}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
