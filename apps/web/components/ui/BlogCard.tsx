"use client";
import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getBlogs } from "@/services/blog";
import { BlogProps } from "@/types/blog";
import { LikeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogPreview from "./BlogPreview";

const BlogCard = () => {
  const dispatch = useAppDispatch();
  const prev = useAppSelector((p) => p.p.preview);

  const { data: blog } = useQuery<BlogProps[]>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
  const handlePreview = ({ id }: { id: string }) => {
    dispatch(setPreview({ preview: true, id }));
  };

  const closePreview = () => {
    dispatch(setPreview({ preview: false, id: "" }));
  };
  return (
    <>
      <div
        className={
          prev
            ? "hidden"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        }
      >
        {blog?.map((blog) => (
          <div
            className="p-4 flex flex-col gap-3 border rounded-2xl border-gray-300 hover:shadow duration-75"
            key={blog._id}
          >
            <h1 className="text-xl font-normal">{blog.title}</h1>
            <p className="text-sm text-gray-500 wrap-break-word line-clamp-2">
              {blog.description}
            </p>
            <div className="flex justify-between text-lg text-gray-500">
              <h2 className="font-thin">{blog.writer.fullName}</h2>
              <p className="flex gap-2">
                <LikeOutlined />
                {blog.title.charAt(0)}
              </p>
            </div>
            <button
              className="rounded-2xl border border-gray-500/20 hover:bg-gray-400/20 duration-150 py-2"
              onClick={() => handlePreview({ id: blog._id })}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
      {prev && (
        <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
          <BlogPreview close={closePreview} />
        </div>
      )}
    </>
  );
};

export default BlogCard;
