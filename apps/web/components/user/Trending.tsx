"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BlogProps } from "@/types/blog";
import { trendingBlogs } from "@/services/blog";
import BlogCard from "../ui/BlogCard";
import { useEffect, useRef } from "react";

const Trending = () => {
  const id = useAppSelector((i) => i.auth.user?._id);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["blog"],
      queryFn: trendingBlogs,
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    });
  const blogs: BlogProps[] = data?.pages.flatMap((page) => page.blogs) || [];
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
  const prev = useAppSelector((p) => p.p.preview);
  return (
    <>
      <div className={prev ? "hidden" : "px-6 py-2"}>
        <h1 className="text-2xl font-semibold">Trending Blogs</h1>
      </div>
      <BlogCard blog={blogs} />
    </>
  );
};

export default Trending;
