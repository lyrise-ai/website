import Layout from '../../src/components/Layout/Layout'
import { useState } from 'react'
import Banner from '../../src/components/Blogs/Home/Banner'
import AllBlogs from '../../src/components/Blogs/Home/BlogList/AllBlogs'

export default function Blogs() {
  return (
    <Layout isRaw>
      <div className="w-full font-primary">
        <main className="relative flex flex-col gap-[80px] pt-5 px-[6%] mx-auto mb-[30vh]">
          <Banner />
          <AllBlogs />
        </main>
      </div>
    </Layout>
  )
}
