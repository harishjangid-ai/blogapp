"use client";

import { useAppSelector } from "@/redux/store/hooks";
import BlogCard from "./BlogCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBlogs } from "@/services/blog";
import { useEffect, useRef } from "react";
import { BlogProps } from "@/types/blog";

const AllDashboard = () => {
  const prev = useAppSelector((p) => p.p.preview);
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blog"],
    queryFn: ({ pageParam = 1 }) =>
      getBlogs({
        page: pageParam,
        limit: 9,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
  });

  const blogs: BlogProps[] =
    data?.pages.flatMap((page) => page.blogs) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="px-6">
      <main
        className={
          prev
            ? "hidden"
            : "flex justify-between items-center gap-2"
        }
      >
        <h1 className="text-2xl font-normal text-gray-900 dark:text-gray-100">
          Latest Articles
        </h1>
      </main>

      <BlogCard blog={blogs} />

      <div
        ref={loaderRef}
        className="h-10 flex justify-center items-center text-gray-600 dark:text-gray-400"
      >
        {isFetchingNextPage && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default AllDashboard;