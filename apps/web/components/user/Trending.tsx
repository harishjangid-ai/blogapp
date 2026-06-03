"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { BlogProps } from "@/types/blog";
import { trendingBlogs } from "@/services/blog";
import BlogCard from "../ui/BlogCard";
import Link from "next/link";
import { Empty } from "antd";

const Trending = () => {
  const id = useAppSelector((i) => i.auth.user?._id);
  const { data: blog } = useQuery<BlogProps[]>({
    queryKey: ["blog"],
    queryFn: trendingBlogs,
  });

  const prev = useAppSelector((p) => p.p.preview);

  return (
    <>
      <div className={prev ? "hidden" : "px-6 py-2"}>
        <h1 className="text-2xl font-semibold">Trending Blogs</h1>
      </div>
      <BlogCard blog={blog} />
    </>
  );
};

export default Trending;
