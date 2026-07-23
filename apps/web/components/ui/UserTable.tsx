"use client";

import { formatDateTime } from "@/hooks/formatDate";
import { deleteUser, fetchUsers, getUserCount } from "@/services/users";
import { User } from "@/types/userType";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Input, notification, Pagination, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useDebounce } from "@/hooks/useDebounce";
import DataNotFound from "./DataNotFound";
import IAvatar from "./IAvatar";

const UserTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const loaderRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { data: desktopData } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: () =>
      fetchUsers({
        page,
        limit: 10,
        search: debouncedSearch,
      }),
  });

  const { data: users } = useQuery<number | undefined>({
    queryKey: ["user-count"],
    queryFn: getUserCount,
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users-infinite", debouncedSearch],
      queryFn: ({ pageParam = 1 }) =>
        fetchUsers({
          page: pageParam,
          limit: 10,
          search: debouncedSearch,
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
      { threshold: 0.5 },
    );

    const current = loaderRef.current;
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) {
        observer.unobserve(current);
      }
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

  if (desktopUsers.length === 0 && mobileUsers.length === 0) {
    return (
      <DataNotFound
        title="No Users Found"
        description="There are currently no users to display."
      />
    );
  }

  return (
    <main className="flex flex-col py-2 px-3 bg-white/50 dark:bg-gray-950">
      <Input
        placeholder="Search by name or username..."
        className="w-75! dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
        value={search}
        onChange={(e) => {
          const value = e.target.value.replace(/[^a-zA-Z0-9_ ]/g, "");
          setSearch(value);
          setPage(1);
        }}
      />

      <h1 className="text-lg text-gray-900 dark:text-gray-100">
        Users <span className="text-sm">({users || 0})</span>
      </h1>

      <div className="hidden w-full flex-col overflow-x-auto rounded-xl bg-white dark:bg-gray-900 p-3 shadow-md md:flex">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <tr>
              <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                User
              </th>
              <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                Phone
              </th>
              <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                Role
              </th>
              <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                Joined Date
              </th>
              <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {desktopUsers.length > 0
              ? desktopUsers.map((data) => (
                  <tr
                    key={data._id}
                    className="border-b border-gray-200 dark:border-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="flex items-center gap-3 p-3">
                      <IAvatar
                          size={40}
                          src={data.image || undefined}
                        />

                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {data.fullName}
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          @{data.userName}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {data.phone}
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300">
                        {data.role}
                      </span>
                    </td>

                    <td className="p-3 text-gray-700 dark:text-gray-300">
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
                            } rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600`}
                          >
                            Delete
                          </button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>

        <div className="mt-5 flex justify-end">
          <Pagination
            current={page}
            pageSize={10}
            total={desktopData?.totalUsers || 0}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col space-y-3 rounded-xl bg-white dark:bg-gray-900 p-3 shadow md:hidden">
        {mobileUsers.map((data) => (
          <div
            key={data._id}
            className="mt-4 space-y-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 shadow"
          >
            <div className="flex items-center gap-3">
              <IAvatar size={40} src={data.image || undefined} />

              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {data.fullName}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  @{data.userName}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Role:
                </span>{" "}
                {data.role}
              </div>

              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Joined:
                </span>{" "}
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
                  } rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600`}
                >
                  Delete
                </button>
              </Popconfirm>
            </div>
          </div>
        ))}

        <div ref={loaderRef} className="flex h-10 items-center justify-center">
          {isFetchingNextPage && (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserTable;
