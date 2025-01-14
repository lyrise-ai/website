import React from 'react'
import ArticleStatistics from './ArticleStatistics'
import TitleBox from './TitleBox'
import AuthorBox from './AuthorBox'
import Image from 'next/image'
import StaticImage from '../../../../assets/staticImages/StaticImage1.png'

function BlogHeader() {
  return (
    <div className="!font-secondary flex align-center justify-between gap-4 md:gap-0 bg-white rounded-2xl  mt-3">
      <div className="ps-5 md:ps-10 flex flex-col gap-4 items-start justify-center">
        <ArticleStatistics />
        <TitleBox />
        <p className="text-[16px] text-[#667085] font-400] max-w-[440px]">
          Linear helps streamline software projects, sprints, tasks, and bug
          tracking. Here’s how to get started.
        </p>
        {/* <AuthorBox /> */}
      </div>
      <div>
        <Image src={StaticImage} alt="banner" />
      </div>
    </div>
  )
}

export default BlogHeader
