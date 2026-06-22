"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { BlogProps } from "@/types/blog";
import { usersBlog } from "@/services/blog";
import BlogCard from "../ui/BlogCard";
import Link from "next/link";
import { Empty } from "antd";

const MyBlogs = () => {
  const id = useAppSelector((i) => i.auth.user?._id);
  const { data: blog } = useQuery<BlogProps[]>({
    queryKey: ["blog"],
    queryFn: () => usersBlog({ id }),
  });
  if (blog?.length === 0) {
    return (
      <div className="flex flex-col items-center w-full py-6 px-4 ">
        <div className="flex flex-col gap-6 w-full max-w-6xl">
          <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <Empty
              description={
                <Link href={"/user/create"}>Create your first blog</Link>
              }
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <BlogCard blog={blog} />
    </>
  );
};

export default MyBlogs;
