import React from 'react'
import Layout from '../../src/components/Layout/Layout'
import Banner from '../../src/components/Blogs/Home/Banner'
import AllBlogs from '../../src/components/Blogs/Home/BlogList/AllBlogs'
import BlogHeader from '../../src/components/Blogs/SingleBlog/BlogHeader'
import AllDetailsSection from '../../src/components/Blogs/SingleBlog/AllDetailsSection'

function BlogDetails() {
  return (
    <Layout isRaw>
      <div className="w-full font-primary bg-white">
        <main className="relative flex flex-col gap-[32px] sm:gap-[80px] pt-5 px-[0%] sm:px-[6%] mx-auto pb-[10vh] sm:pb-[20vh] lg:pb-[30vh]">
          <BlogHeader />
          <AllDetailsSection />
        </main>
      </div>
    </Layout>
  )
}

export default BlogDetails
