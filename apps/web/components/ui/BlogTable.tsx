"use client";
import { formatDateTime } from "@/hooks/formatDate";
import { deleteBlog, getBlogs, viewBlog } from "@/services/blog";
import { BlogProps } from "@/types/blog";
import {
  DeleteOutlined,
  EyeOutlined,
  LikeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button, Input, Popconfirm } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import BlogPreview from "./BlogPreview";
import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getPreviewText } from "@/hooks/DescriptionHelper";
import { useDebounce } from "@/hooks/useDebounce";
import DataNotFound from "./DataNotFound";
import IAvatar from "./IAvatar";

const BlogTable = () => {
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  const preview = useAppSelector((p) => p.p.preview);
  const debouncedSearch = useDebounce(search, 500);

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

  const dispatch = useAppDispatch();

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

  const filteredBlog = useMemo<BlogProps[]>(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.user.fullName.toLowerCase().includes(q),
    );
  }, [debouncedSearch, blogs]);

  const handleDeleteBlog = ({ blogId }: { blogId: string }) => {
    deleteBlog({ blogId });
    queryClient.invalidateQueries({ queryKey: ["blog"] });
  };

  if (blogs.length === 0) {
    return (
      <DataNotFound
        title="No blogs found."
        description="Try adjusting your search or filter to find what you're looking for."
      />
    );
  }

  return (
    <>
      <div
        className={
          preview
            ? "hidden"
            : "flex flex-col rounded-2xl border border-gray-400/50 dark:border-gray-700 py-2 px-3 bg-white/50 dark:bg-gray-900"
        }
      >
        <h3 className="text-xl font-thin text-gray-900 dark:text-gray-100">
          All Blogs
        </h3>

        <Input
          placeholder="Search by title or writer's name..."
          className="w-75! dark:bg-gray-800! dark:border-gray-600! dark:text-white! dark:placeholder:text-gray-400!"
          value={search}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z0-9_ ]/g, "");
            setSearch(value);
          }}
        />
        <div className="w-full p-4">
          <div className="hidden overflow-x-auto rounded-xl bg-white dark:bg-gray-900 shadow-md md:flex">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Blog Title
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Author
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Published
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Stats
                  </th>
                  <th className="p-4 text-right font-semibold text-gray-600 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBlog?.map((data) => (
                  <tr
                    key={data._id}
                    className="border-b border-gray-200 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <td className="w-[50%] p-4">
                      <div className="flex items-start gap-3">
                        <IAvatar size={40} src={data.user.image || undefined} />

                        <div className="flex flex-col overflow-hidden">
                          <div className="truncate font-medium text-gray-800 dark:text-gray-100">
                            {data.title}
                          </div>

                          <p className="wrap-break-word line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {getPreviewText(data.description)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="w-[15%] whitespace-nowrap p-4 text-sm text-gray-700 dark:text-gray-300">
                      {data.user.fullName}
                    </td>

                    <td className="w-[15%] p-4">
                      <span className="whitespace-nowrap rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300">
                        {formatDateTime(data.createdAt)}
                      </span>
                    </td>

                    <td className="w-[10%] whitespace-nowrap p-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex gap-2">
                        <span className="flex gap-1">
                          <LikeOutlined />
                          {data.likeCount}
                        </span>
                        <span className="flex gap-1">
                          <EyeOutlined />
                          {data.views}
                        </span>
                      </div>
                    </td>

                    <td className="w-[10%] p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="rounded-md border-gray-500 px-3 py-1 text-sm text-black! hover:bg-gray-600/10! hover:text-gray-600! dark:border-gray-600! dark:bg-gray-800 dark:text-gray-100! dark:hover:bg-gray-700!"
                          icon={<EyeOutlined />}
                          type="default"
                          onClick={() => handlePreview({ id: data._id })}
                        >
                          Preview
                        </Button>

                        <Popconfirm
                          cancelText="cancel"
                          okText="Yes, delete it!"
                          title="Are you sure to delete this blog?"
                          onConfirm={() =>
                            handleDeleteBlog({ blogId: data._id })
                          }
                        >
                          <Button
                            className="rounded-md border-red-500! px-3 py-1 text-sm text-red-500! hover:bg-red-600/10! hover:text-red-600! dark:hover:bg-red-900/20!"
                            type="default"
                            icon={<DeleteOutlined />}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            {filteredBlog?.map((data) => (
              <div
                className="mt-4 space-y-3 rounded-xl bg-white dark:bg-gray-900 p-4 shadow md:hidden"
                key={data._id}
              >
                <div className="flex items-center gap-3">
                  <IAvatar size={40} src={data.user.image || undefined} />

                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {data.title}
                    </div>

                    <div className="wrap-break-word line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {getPreviewText(data.description)}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Author:
                    </span>{" "}
                    {data.user.fullName}
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Published:
                    </span>{" "}
                    {formatDateTime(data.createdAt)}
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Stats:
                    </span>{" "}
                    2023-01-01
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="rounded-md border-gray-500 px-3 py-1 text-sm text-black! hover:bg-gray-600/10! hover:text-gray-600! dark:border-gray-600! dark:bg-gray-800 dark:text-gray-100! dark:hover:bg-gray-700!"
                    icon={<EyeOutlined />}
                    type="default"
                    onClick={() => handlePreview({ id: data._id })}
                  >
                    Preview
                  </Button>

                  <Button
                    className="rounded-md border-red-500! px-3 py-1 text-sm text-red-500! hover:bg-red-600/10! hover:text-red-600! dark:hover:bg-red-900/20!"
                    type="default"
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            <div
              ref={loaderRef}
              className="flex h-10 items-center justify-center"
            >
              {isFetchingNextPage && (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              )}
            </div>

            {filteredBlog?.length === 0 && (
              <DataNotFound
                title="No blogs found."
                description="Try adjusting your search or filter to find what you're looking for."
              />
            )}
          </div>
        </div>
      </div>
      {preview && (
        <div className="flex justify-center w-full min-h-[calc(100vh-60px)]">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default BlogTable;
