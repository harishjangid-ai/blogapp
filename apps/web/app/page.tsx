"use client";

import BlogCard from "@/components/ui/BlogCard";
import DashboardHeader from "@/components/ui/DashboardHeader";
import { useAppSelector } from "@/redux/store/hooks";
import { getBlogs } from "@/services/blog";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function Home() {
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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

  const blogs = data?.pages.flatMap((page) => page.blogs) || [];
  const p = useAppSelector((p) => p.p.preview);

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
    <main className="flex flex-col  justify-between bg-white dark:bg-gray-950">
      
      <BlogCard blog={blogs} />

      {p ? null : (
        <div
          ref={loaderRef}
          className="flex h-10 items-center justify-center"
        >
          {isFetchingNextPage && (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          )}
        </div>
      )}
    </main>
  );
}