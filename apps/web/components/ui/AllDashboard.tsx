"use client";

import { useAppSelector } from "@/redux/store/hooks";
import BlogCard from "./BlogCard";
import { useQuery } from "@tanstack/react-query";
import { BlogProps } from "@/types/blog";
import { getBlogs } from "@/services/blog";

const AllDashboard = () => {
  const prev = useAppSelector((p) => p.p.preview);
  const { data: blog } = useQuery<BlogProps[]>({
    queryKey: ["blog"], 
    queryFn: getBlogs,
  });
  return (
    <div className="px-6">
      <main
        className={prev ? "hidden" : "flex justify-between items-center gap-2"}
      >
        <h1 className="text-2xl font-normal">Latest Articles</h1>
      </main>
      <BlogCard blog={blog}/>
    </div>
  );
};

export default AllDashboard;
