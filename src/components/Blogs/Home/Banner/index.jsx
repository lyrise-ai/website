import Image from 'next/image'
import React from 'react'
import StaticImage from '../../../../assets/staticImages/StaticImage1.png'
import ArticleStatistics from './ArticleStatistics'
import TitleBox from './TitleBox'
import AuthorBox from './AuthorBox'

function Banner() {
  return (
    <div className="!font-secondary flex align-center justify-between gap-4 md:gap-0 bg-white rounded-2xl shadow-[0px_0px_12px_2px_#094BF626] mt-3">
      <div className="ps-5 md:ps-10 flex flex-col gap-4 items-start justify-center">
        <ArticleStatistics />
        <TitleBox />
        <p className="text-[16px] text-[#667085] font-400] max-w-[440px]">
          How do you create compelling presentations that wow your colleagues
          and impress your managers?
        </p>
        <AuthorBox />
      </div>
      <div>
        <Image src={StaticImage} alt="banner" />
      </div>
    </div>
  )
}

export default Banner
