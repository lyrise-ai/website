import Image from 'next/image'
import React from 'react'
import StaticImage from '../../../assets/staticImages/blogCardImage.png'
import ArticleStatistics from './ArticleStatistics'
import TitleBox from './TitleBox'
import AuthorBox from './AuthorBox'
import Link from 'next/link'

function BlogCard({ id }) {
  return (
    <div className="flex flex-col gap-6 rounded-[16px] shadow-[0px_0px_12px_2px_#094BF626] bg-white font-secondary pb-8">
      <Link href={`/blogs/${id}`}>
        <div>
          <Image
            src={StaticImage}
            alt="blogCard"
            className="rounded-t-[16px] w-full"
          />
        </div>
      </Link>
      <div className="px-6 md:px-5 lg:px-4 xl:px-3  flex flex-col gap-3 items-start justify-center">
        <ArticleStatistics />
        <Link href={`/blogs/${id}`} className="w-full">
          <TitleBox id={id} />
        </Link>
        <p className="text-[16px] text-[#667085] font-400] max-w-[440px] leading-[19.2px] mb-1">
          How do you create compelling presentations that wow your colleagues
          and impress your managers?
        </p>
        <AuthorBox />
      </div>
    </div>
  )
}

export default BlogCard
