"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { BlogProps } from "@/types/blog";
import { usersBlog } from "@/services/blog";
import BlogCard from "../ui/BlogCard";
import Link from "next/link";
import { Empty } from "antd";
import { useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/store/hooks";

const MyBlogs = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blog"],
    queryFn: ({ pageParam = 1 }) =>
      usersBlog({
        page: pageParam,
        limit: 9,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
  });

  const p = useAppSelector((p) => p.p.preview);

  const blogs: BlogProps[] =
    data?.pages.flatMap((page) => page.blogs) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (blogs?.length === 0) {
    return (
      <div className="flex flex-col items-center w-full py-6 px-4">
        <div className="flex flex-col gap-6 w-full max-w-6xl">
          <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 dark:bg-gray-900 dark:border-gray-700">
            <Empty
              description={
                <Link
                  href="/user/create"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Create your first blog
                </Link>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogCard blog={blogs} />

      {p ? null : (
        <div
          ref={loaderRef}
          className="h-10 flex justify-center items-center text-gray-600 dark:text-gray-400"
        >
          {isFetchingNextPage && <p>Loading...</p>}
        </div>
      )}
    </>
  );
};

export default MyBlogs;