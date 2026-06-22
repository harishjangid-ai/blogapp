"use client";

import BlogCard from "@/components/ui/BlogCard";
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <main className="flex flex-col items-center justify-between">
      <BlogCard blog={blogs} />

      <div ref={loaderRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <p>Loading...</p>}
      </div>
    </main>
  );
}
