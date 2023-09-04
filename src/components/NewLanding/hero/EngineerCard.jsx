import React from 'react'

import Img from '../../Product/Img'

function EngineerCard({
  imgSrc,
  title,
  name,
  workedAtImages = [],
  className = '',
}) {
  return (
    <div
      className={
        ' w-[15vw] h-[15vw] border-[12px] p-5 border-white bg-[#EFF2FF] flex flex-col items-center justify-center rounded-[20px] ' +
        className
      }
    >
      <div className="w-26 h-26 border-2 border-white rounded-full overflow-hidden mb-3">
        <img className="w-full h-full object-cover" alt={name} src={imgSrc} />
      </div>
      <div className="font-secondary text-black text-sm">{name}</div>
      <div className="font-secondary text-black text-md font-semibold">
        {title}
      </div>
      <div className="font-secondary text-black text-xs">
        Previously Worked At:
        <div className="flex gap-3 justify-center">
          {workedAtImages.map((imgSrc, index) => (
            <Img
              key={index}
              src={imgSrc}
              alt={imgSrc}
              className="w-6 h-6 object-cover mt-2"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EngineerCard
