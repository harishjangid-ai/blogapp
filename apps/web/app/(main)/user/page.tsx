"use client";

import BlogCard from "@/components/ui/BlogCard";
import { getBlogs } from "@/services/blog";
import { BlogProps } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: blog } = useQuery<BlogProps[]>({
    queryKey: ["blog"],
    queryFn: getBlogs,
  });
  return (
    <main className="flex flex-col items-center justify-between">
      <BlogCard blog={blog}/>
    </main>
  );
}
