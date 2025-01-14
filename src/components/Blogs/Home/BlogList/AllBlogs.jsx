import React, { useState } from 'react'
import TabsHandler from './TabsHandler'
import ViewBlogsContainer from './ViewBlogsContainer'

function AllBlogs() {
  const [value, setValue] = useState('View all')

  return (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="text-[#101828] text-[28px] md:text-[40px] font-[500]">
        LyRise Blogs
      </h3>
      <div className="flex flex-col gap-8">
        <TabsHandler value={value} setValue={setValue} />
        <ViewBlogsContainer />
      </div>
    </div>
  )
}

export default AllBlogs
