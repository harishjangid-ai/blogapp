"use client";
import { formatDateTime } from "@/hooks/formatDate";
import { deleteBlog, getBlogs } from "@/services/blog";
import { BlogProps } from "@/types/blog";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Popconfirm } from "antd";
import { useMemo, useState } from "react";
import BlogPreview from "./BlogPreview";
import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const BlogTable = () => {
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  const preview = useAppSelector((p) => p.p.preview);

  const { data } = useQuery<BlogProps[]>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const dispatch = useAppDispatch();

  const handlePreview = ({ id }: { id: string }) => {
    dispatch(setPreview({ preview: true, id }));
  };

  const filteredBlog = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data?.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }, [search, data]);

  const handleDeleteBlog = ({ blogId }: { blogId: string }) => {
    deleteBlog({ blogId });
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
  };

  return (
    <>
      <div
        className={
          preview
            ? "hidden"
            : "flex flex-col border border-gray-400/50 rounded-2xl py-2 px-3 bg-white/50"
        }
      >
        <h3 className="text-xl font-thin">All Blogs</h3>
        <Input
          placeholder="Search by name or email..."
          className="w-75!"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-full p-4">
          <div className="overflow-x-auto bg-white shadow-md rounded-xl hidden md:flex ">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">
                    Blog Title
                  </th>
                  <th className="p-4 font-semibold text-gray-600">Author</th>
                  <th className="p-4 font-semibold text-gray-600">Published</th>
                  <th className="p-4 font-semibold text-gray-600">Stats</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBlog?.map((data) => (
                  <tr
                    key={data._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 w-[50%]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 min-w-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                          {data.user.fullName
                            .split(" ")
                            .map((word) => word[0].toUpperCase())
                            .join("")}
                        </div>

                        <div className="flex flex-col overflow-hidden">
                          <div className="font-medium text-gray-800 truncate">
                            {data.title}
                          </div>

                          <p className="text-sm text-gray-500 wrap-break-word line-clamp-2">
                            {data.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-700 text-sm w-[15%] whitespace-nowrap">
                      {data.user.fullName}
                    </td>

                    <td className="p-4 w-[15%]">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium whitespace-nowrap">
                        {formatDateTime(data.createdAt)}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700 text-sm w-[10%] whitespace-nowrap">
                      {formatDateTime(data.createdAt)}
                    </td>

                    <td className="p-4 w-[10%]">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="text-black! hover:text-gray-600! border-gray-500! hover:bg-gray-600/10! px-3 py-1 rounded-md text-sm"
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
                            className="text-red-500! hover:text-red-600! border-red-500! hover:bg-red-600/10! px-3 py-1 rounded-md text-sm"
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

          <div className="">
            {filteredBlog?.map((data) => (
              <div
                className="md:hidden mt-4 bg-white shadow rounded-xl p-4 space-y-3"
                key={data._id}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {data.user.fullName
                      .split(" ")
                      .map((word) => word[0].toUpperCase())
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium">{data.title}</div>
                    <div className="text-xs text-gray-500">
                      {data.description}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Author:</span>{" "}
                    {data.user.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>{" "}
                    {formatDateTime(data.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Stats:</span> 2023-01-01
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="text-black! hover:text-gray-600! border-gray-500! hover:bg-gray-600/10! px-3 py-1 rounded-md text-sm"
                    icon={<EyeOutlined />}
                    type="default"
                  >
                    Preview
                  </Button>
                  <Button
                    className="text-red-500! hover:text-red-600! border-red-500! hover:bg-red-600/10! px-3 py-1 rounded-md text-sm"
                    type="default"
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {preview && (
        <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default BlogTable;
