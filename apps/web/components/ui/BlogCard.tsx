"use client";

import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { BlogProps } from "@/types/blog";
import { DeleteOutlined, EyeOutlined, LikeOutlined, FileTextOutlined } from "@ant-design/icons";
import BlogPreview from "./BlogPreview";
import { Button, notification, Popconfirm } from "antd";
import { deleteBlog, viewBlog } from "@/services/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPreviewText } from "@/hooks/DescriptionHelper";
import DataNotFound from "./DataNotFound";

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
      notification.success({
        message: "Blog deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
    },
  });

  const id = useAppSelector((i) => i.auth.user?._id);

  const handleDeleteBlog = ({ blogId }: { blogId: string }) => {
    deleteMutation.mutate({ blogId });
  };
  if (!blog || blog.length === 0) {
    return (
      <DataNotFound
        title="No Blogs Found"
        description="There are currently no blogs to display."
      
      />
    )
  }
  return (
    <>
      <div
        className={
          prev
            ? "hidden"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6 py-2"
        }
      >
        {blog?.map((blog) => (
          <div
            key={blog._id}
            className="p-4 flex flex-col gap-3 border rounded-2xl border-gray-300 bg-white hover:shadow-lg hover:-translate-y-1 duration-300 justify-between"
          >
            <div className="mb-4">
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-60 object-cover rounded-xl border"
                />
              ) : (
                <div className="w-full h-60 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-gray-300 bg-white flex items-center justify-center text-2xl text-gray-500">
                    <FileTextOutlined />
                  </div>

                  <h3 className="mt-4 text-base font-medium text-gray-700 line-clamp-2 text-center px-5">
                    {blog.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    Article Preview
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-start gap-3">
              <h1 className="text-xl font-medium line-clamp-2">
                {blog.title}
              </h1>

              <Popconfirm
                title="Are you sure to delete this blog?"
                onConfirm={() => handleDeleteBlog({ blogId: blog._id })}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={
                    id === blog.user._id
                      ? "text-red-500! border-red-500! shrink-0"
                      : "hidden!"
                  }
                  disabled={id !== blog.user._id}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </div>

            <p className="text-sm text-gray-500 leading-6 line-clamp-3">
              {getPreviewText(blog.description)}
            </p>

            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex justify-between items-center border-t pt-3 text-gray-500">
                <h2 className="font-thin">{blog.user.fullName}</h2>

                <div className="flex gap-3">
                  <p
                    className={`${
                      blog.isLiked ? "text-red-500!" : "text-gray-500!"
                    } flex items-center gap-1`}
                  >
                    <LikeOutlined />
                    {blog.likeCount || 0}
                  </p>

                  <p className="flex items-center gap-1">
                    <EyeOutlined />
                    {blog.views || 0}
                  </p>
                </div>
              </div>

              <button
                className="rounded-2xl border border-gray-500/20 hover:bg-gray-100 duration-200 py-2"
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