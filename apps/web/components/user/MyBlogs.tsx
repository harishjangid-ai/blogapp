"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { BlogProps } from "@/types/blog";
import { usersBlog } from "@/services/blog";
import BlogCard from "../ui/BlogCard";

const MyBlogs = () => {
  const id = useAppSelector((i)=> i.auth.user?._id);
  const { data: blog } = useQuery<BlogProps[]>({
      queryKey: ["blogs"],
      queryFn:()=> usersBlog({id}),
    });
  return (
    <BlogCard blog={blog} />
  )
}

export default MyBlogs;