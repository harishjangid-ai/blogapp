"use client";

import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { BlogProps } from "@/types/blog";
import { DeleteOutlined, EyeOutlined, LikeOutlined } from "@ant-design/icons";
import BlogPreview from "./BlogPreview";
import { Button, notification, Popconfirm } from "antd";
import { deleteBlog, viewBlog } from "@/services/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BlogCard = ({ blog }: { blog: BlogProps[] | undefined }) => {
  const dispatch = useAppDispatch();
  const prev = useAppSelector((p) => p.p.preview);
  const queryClient = useQueryClient();

  const viewMutation = useMutation({
    mutationFn: viewBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
    },
  });

  const handlePreview = ({ id }: { id: string }) => {
    dispatch(setPreview({ preview: true, id }));
    viewMutation.mutate({
      blogId: id,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      notification.success({ message: "Blog deleted successfully" });
      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
    }
  });;

  const id = useAppSelector((i) => i.auth.user?._id);
  const handleDeleteBlog = ({ blogId }: { blogId: string }) => {
    deleteMutation.mutate({ blogId });
  };
  return (
    <>
      <div
        className={
          prev
            ? "hidden"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 py-2"
        }
      >
        {blog?.map((blog) => (
          <div
            className="p-4 flex flex-col gap-3 border rounded-2xl border-gray-300 hover:shadow duration-75 justify-between"
            key={blog._id}
          >
            <div className="flex justify-between w-full">
              <h1 className="text-xl font-normal">{blog.title}</h1>
              <Popconfirm
                title="Are you sure to delete this blog?"
                onConfirm={() => handleDeleteBlog({ blogId: blog._id })}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={
                    id === blog.user._id
                      ? "text-red-500! border-red-500!"
                      : "hidden!"
                  }
                  disabled={id !== blog.user._id}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </div>
            <p
              className="text-sm text-gray-500 wrap-break-word line-clamp-2"
              title={blog.description}
            >
              {blog.description}
            </p>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between text-lg text-gray-500">
                <h2 className="font-thin">{blog.user.fullName}</h2>
                <div className="flex gap-2">
                  <p
                    className={`${blog.isLiked ? "text-red-500!" : "text-gray-500!"} flex gap-1`}
                  >
                    <LikeOutlined />
                    {blog.likeCount || 0}
                  </p>
                  <p className="flex gap-1">
                    <EyeOutlined />
                    {blog.views || 0}
                  </p>
                </div>
              </div>
              <button
                className="rounded-2xl border border-gray-500/20 hover:bg-gray-400/20 duration-150 py-2"
                onClick={() => handlePreview({ id: blog._id })}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
      {prev && (
        <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default BlogCard;
