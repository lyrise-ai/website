import React from 'react'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

function TitleBox({ id }) {
  return (
    <div className="flex justify-between items-start w-[95%]">
      <h2 className="text-[#101828] text-[20px] md:text-[22px] lg:text-[24px] xl:text-[20px] font-[500] leading-[24.8px]">
        UX review presentaions
      </h2>
      <ArrowOutwardRoundedIcon sx={{ width: '24px', height: '24px' }} />
    </div>
  )
}

export default TitleBox
