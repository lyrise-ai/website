import React from 'react'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import Link from 'next/link'

function TitleBox() {
  return (
    <Link href="/blogs/1">
      <div className="flex justify-between items-start max-w-[400px] !font-secondary">
        <h2 className="text-[#101828] text-[28px] md:text-[48px] font-[500] leading-[48px]">
          UX review presentaions
        </h2>
        <ArrowOutwardRoundedIcon sx={{ width: '24px', height: '24px' }} />
      </div>
    </Link>
  )
}

export default TitleBox
