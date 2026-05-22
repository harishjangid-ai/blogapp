"use client";
import React from 'react'
import BlogCard from '../ui/BlogCard';

const AllBlogs = () => {
  return (
    <div className='flex flex-col gap-2'>
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-thin">Blogs</h1>
    </div>
      <BlogCard/>
    </div>
  )
}

export default AllBlogs