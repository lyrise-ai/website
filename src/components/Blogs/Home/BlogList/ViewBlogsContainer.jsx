import React from 'react'
import BlogCard from '../../BlogCard'

function ViewBlogsContainer() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {Array.from({ length: 7 }).map((_, index) => (
        <BlogCard key={index} id={index} />
      ))}
    </div>
  )
}

export default ViewBlogsContainer
