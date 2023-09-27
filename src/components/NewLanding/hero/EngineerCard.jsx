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
      className={` w-[15vw] h-[15vw] border-[12px] p-5 border-white bg-[#EFF2FF] text-center rounded-[20px] max-md:hidden ${className}`}
    >
      {/* <div className="w-26 h-26 border-2 border-white rounded-full overflow-hidden mb-3"> */}
      {/* <Image
        src={imgSrc}
        alt={name}
        // width={'30%'}
        // height={'30%'}
        style={{ borderRadius: '100%', flexGrow: 0 }}
        // layout="fill"
        objectFit="contain"
        // objectPosition="center"
      /> */}
      <Img
        className="w-1/2 h-1/2 mx-auto object-cover border-2 border-white rounded-full overflow-hidden mb-3"
        alt={name}
        src={imgSrc}
      />
      {/* </div> */}
      <div className="font-secondary text-black text-sm">{name}</div>
      <div className="font-secondary text-black text-[1rem] font-semibold">
        {title}
      </div>
      <div className="font-secondary text-black text-xs">
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
      </div>
    </div>
  )
}

export default EngineerCard
