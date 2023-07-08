import React from 'react'

import PartnersSlider from '../TopPartners/PartnersSlider'

export default function Logos() {
  return (
    <div className="mt-10 mb-10">
      <h1 className="md:hidden text-center text-3xl md:text-4xld lg:text-5xl font-primary-500 font-bold capitalize mb-5">
        LyRise Top Parteners
      </h1>
      <div className="relative">
        <div className="drop-sides-fade z-[150] w-full h-full absolute bg-red-500" />
        {/* <div className="flex gap-10 md:gap-20 overflow-x-scroll scroll-smooth pb-5 box-content h-full without-h-scrollbar">
          {[...LogosUrls, ...LogosUrls].map((url, index) => {
            return (
              <img
                key={index}
                src={url}
                className="w-[30%] md:w-[15%] lg:w-[10%] m-auto"
              />
            )
          })}
        </div> */}
        <PartnersSlider />
      </div>
    </div>
  )
}
