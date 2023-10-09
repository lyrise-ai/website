import React from 'react'
import Img from '../../Product/Img'
import Image from 'next/image'

function EngineerCard({
  imgSrc,
  title,
  name,
  workedAtImages = [],
  className = '',
}) {
  return (
    <div
      className={` w-[55vw] h-[55vw] md:w-[15vw] md:h-[15vw] border-[12px] p-2 md:p-3 lg:p-5 border-white bg-[#EFF2FF] text-center rounded-[20px] flex flex-col justify-center ${className}`}
    >
      <Img
        className="w-[45%] h-[45%] md:w-1/2 md:h-1/2 mx-auto object-cover border-2 border-white rounded-full overflow-hidden mb-3"
        alt={name}
        src={imgSrc}
      />
      {/* </div> */}
      <div className="font-secondary text-black text-xs md:text-sm">{name}</div>
      <div className="font-secondary text-black text-[0.8rem] md:text-[1rem] font-semibold">
        {title}
      </div>
      {/* Worked at companies (Currently Disabled) */}
      {/* <div className="font-secondary text-black text-xs">
        Previously Worked At:
        <div className="flex gap-3 justify-center">
          {workedAtImages.map((src) => (
            <Img
              key={src}
              src={src}
              alt={src}
              className="w-6 h-6 object-cover mt-2"
            />
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default EngineerCard
