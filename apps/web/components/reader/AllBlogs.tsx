"use client";
import React from "react";
import BlogCard from "../ui/BlogCard";
import { useAppSelector } from "@/redux/store/hooks";

const AllBlogs = () => {
  const preview = useAppSelector((p)=> p.p.preview);
  return (
    <div className="flex flex-col gap-2 px-6">
      <div className={preview ? "hidden" : "flex flex-col gap-3"}>
        <h1 className="text-xl font-thin">Blogs</h1>
      </div>
      <BlogCard />
    </div>
  );
};

export default AllBlogs;
