import React from 'react'
import ArticleStatistics from './ArticleStatistics'
import TitleBox from './TitleBox'
import AuthorBox from './AuthorBox'
import Image from 'next/image'
import StaticImage from '../../../../assets/staticImages/StaticImage1.png'

function BlogHeader() {
  return (
    <div className="!font-secondary flex align-center justify-between flex-col-reverse sm:flex-row gap-4 lg:gap-4 bg-white rounded-2xl  mt-3">
      <div className="ps-5 pe-5 sm:pe-0 md:ps-10 flex flex-col gap-4 items-start justify-center">
        <ArticleStatistics />
        <TitleBox />
        <p className="text-[18px] md:text-[16px] text-[#667085] font-[400] max-w-[300px] sm:max-w-[440px] leading-[24.8px] sm:leading-[26.2px]">
          Linear helps streamline software projects, sprints, tasks, and bug
          tracking. Here’s how to get started.
        </p>
        {/* <AuthorBox /> */}
      </div>
      <div>
        <Image src={StaticImage} alt="blog-banner" className="h-full" />
      </div>
    </div>
  )
}

export default BlogHeader
