"use client";

import { formatDateTime } from "@/hooks/formatDate";
import { deleteUser, fetchUsers } from "@/services/users";
import { User } from "@/types/userType";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Input, notification, Pagination, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";

const UserTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loaderRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { data: desktopData } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () =>
      fetchUsers({
        page,
        limit: 10,
        search,
      }),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["users-infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      fetchUsers({
        page: pageParam,
        limit: 10,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
  });

  const desktopUsers: User[] = desktopData?.user || [];

  const mobileUsers: User[] = data?.pages.flatMap((page) => page.user) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const current = loaderRef.current;
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) { observer.unobserve(current)}
    };
  }, [fetchNextPage, hasNextPage]);

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      if (!data.success) {
        notification.error({
          message: data.error || "Failed to delete user",
        });
        return;
      }
      notification.success({
        message: data.message || "Deleted",
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users-infinite"],
      });
    },
    onError: () => {
      notification.error({
        message: "Failed to delete user",
      });
    },
  });

  const handleDeleteUser = ({ id }: { id: string | undefined }) => {
    mutation.mutate({ id });
  };

  return (
    <main className="flex flex-col py-2 px-3 bg-white/50">
      <Input
        placeholder="Search by name or username..."
        className="w-75!"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <h1 className="text-lg">Users <span className="text-sm">({desktopUsers.length || 0})</span></h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl w-full p-3 hidden md:flex flex-col">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-600">User</th>
              <th className="p-3 font-semibold text-gray-600">Phone</th>
              <th className="p-3 font-semibold text-gray-600">Role</th>
              <th className="p-3 font-semibold text-gray-600">Joined Date</th>
              <th className="p-3 font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {desktopUsers.map((data) => (
              <tr
                className="border-b hover:bg-gray-50 transition"
                key={data._id}
              >
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {data.fullName
                      .split(" ")
                      .map((word) => word[0].toUpperCase())
                      .join("")}
                  </div>

                  <div>
                    <div className="font-medium text-gray-800">
                      {data.fullName}
                    </div>

                    <div className="text-xs text-gray-500">
                      @{data.userName}
                    </div>
                  </div>
                </td>

                <td className="p-3 text-gray-700">{data.phone}</td>

                <td className="p-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                    {data.role}
                  </span>
                </td>

                <td className="p-3 text-gray-700">
                  {formatDateTime(data.createdAt)}
                </td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Popconfirm
                      title="Are you sure you want to delete this user?"
                      okText="ok"
                      onConfirm={() => handleDeleteUser({ id: data._id })}
                    >
                      <button
                        disabled={data.role === "admin"}
                        className={`${
                          data.role === "admin"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        } bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm`}
                      >
                        Delete
                      </button>
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-5">
          <Pagination
            current={page}
            pageSize={10}
            total={desktopData?.totalUsers || 0}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </div>

      <div className="md:hidden mt-4 bg-white shadow rounded-xl p-3 space-y-3 flex flex-col">
        {mobileUsers.map((data) => (
          <div
            key={data._id}
            className="mt-4 bg-white shadow rounded-xl p-3 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {data.fullName
                  .split(" ")
                  .map((word) => word[0].toUpperCase())
                  .join("")}
              </div>

              <div>
                <div className="font-medium">{data.fullName}</div>
                <div className="text-xs text-gray-500">@{data.userName}</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <div>
                <span className="font-medium">Role:</span> {data.role}
              </div>

              <div>
                <span className="font-medium">Joined:</span>{" "}
                {formatDateTime(data.createdAt)}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Popconfirm
                title="Are you sure you want to delete this user?"
                okText="ok"
                onConfirm={() => handleDeleteUser({ id: data._id })}
              >
                <button
                  disabled={data.role === "admin"}
                  className={`${
                    data.role === "admin"
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm`}
                >
                  Delete
                </button>
              </Popconfirm>
            </div>
          </div>
        ))}

        <div ref={loaderRef} className="h-10 flex justify-center items-center">
          {isFetchingNextPage && <p>Loading...</p>}
        </div>
      </div>
    </main>
  );
};

export default UserTable;
