"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { selectedBlog } from "@/services/blog";
import { BlogType } from "@/types/blog";
import { Affix, Button, Spin } from "antd";
import { formatDateTime } from "@/hooks/formatDate";
import { useAppSelector } from "@/redux/store/hooks";
import { FlagOutlined, HeartOutlined, MessageOutlined } from "@ant-design/icons";

const BlogPreview = ({ close }: { close: () => void }) => {
  const id = useAppSelector((i) => i.p.id);
  const { data: blog, isLoading } = useQuery<BlogType>({
    queryKey: ["blog"],
    queryFn: () => selectedBlog({ id }),
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  return (
    <div className="p-6 flex flex-col w-full bg-gray-100 max-w-4xl overflow-y-auto min-h-[calc(100vh-55px)] gap-3">
      <div className="flex max-w-4xl w-full border-b">
        <Affix offsetTop={50}>
          <Button
            className="text-gray-500! border! border-gray-500! hover:text-black! mb-3"
            onClick={close}
          >
            ← Back to Home
          </Button>

        </Affix>
      </div>
      <div className="flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center justify-between border-b pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                {blog?.writerId.fullName
                  .split(" ")
                  .map((w) => w[0].toUpperCase())
                  .join("")}
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  {blog?.writerId.fullName}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatDateTime(blog?.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <button className="flex items-center gap-2 border rounded-lg px-4 py-2 text-red-500 hover:bg-red-50">
                <FlagOutlined size={16} />
                Report
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              {blog?.title}
            </h1>
              <p>{blog?.description}</p>
          </div>

          <div className="border-t mt-10 pt-6 flex gap-4">
            <button className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50">
              <HeartOutlined size={16} />
              289
            </button>

            <button className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50">
              <MessageOutlined size={16} />0 Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
