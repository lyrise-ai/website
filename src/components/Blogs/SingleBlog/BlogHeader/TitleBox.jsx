import React from 'react'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import Link from 'next/link'

function TitleBox() {
  return (
    <Link href="/blogs/1">
      <div className="flex justify-between items-start max-w-[400px] !font-secondary">
        <h2 className="text-[#101828] text-[32px] sm:text-[20px] md:text-[28px] lg:text-[40px] xl:text-[48px] font-[600] sm:font-[500] leading-[38px] sm:leading-[20px] md:leading-[28px] lg:leading-[40px] xl:leading-[48px]">
          UX review presentaions
        </h2>
        <ArrowOutwardRoundedIcon
          sx={{
            width: '24px',
            height: '24px',
            display: { xs: 'none', sm: 'block' },
          }}
        />
      </div>
    </Link>
  )
}

export default TitleBox
