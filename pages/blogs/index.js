import Layout from '../../src/components/Layout/Layout'
import { useState } from 'react'
import Banner from '../../src/components/Blogs/Home/Banner'
import AllBlogs from '../../src/components/Blogs/Home/BlogList/AllBlogs'

export default function Blogs() {
  return (
    <Layout isRaw>
      <div className="w-full font-primary bg-white sm:bg-transparent">
        <main className="relative flex flex-col gap-[32px] sm:gap-[80px] pt-5 px-[4%] sm:px-[6%] mx-auto pb-[10vh] sm:pb-[20vh] lg:pb-[30vh]">
          <Banner />
          <AllBlogs />
        </main>
      </div>
    </Layout>
  )
}
