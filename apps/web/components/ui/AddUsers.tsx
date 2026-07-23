"use client";

import { addMoreUsers, otherUsers } from "@/services/chat";
import { ReUser } from "@/types/userType";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Checkbox,
  Form,
  Input,
  List,
  Spin,
  notification,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import IAvatar from "./IAvatar";

const AddUsers = ({
  chatId,
  close,
}: {
  chatId: string | undefined;
  close: () => void;
}) => {
  const [members, setMembers] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<ReUser[]>({
    queryKey: ["other-users", chatId],
    queryFn: () => otherUsers({ chatId }),
    enabled: !!chatId,
  });

  const mutation = useMutation({
    mutationFn: addMoreUsers,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Failed to add users",
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["selected-user"],
      });

      notification.success({
        message: data.message || "Users added successfully",
      });

      close();
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) =>
      user.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [users, debouncedSearch]);

  const toggleMember = (id: string) => {
    if (members.includes(id)) {
      setMembers((prev) => prev.filter((item) => item !== id));
    } else {
      setMembers((prev) => [...prev, id]);
    }
  };

  const handleAdd = () => {
    if (members.length === 0) {
      return notification.error({
        message: "Please select users",
      });
    }

    mutation.mutate({
      chatId,
      members,
    });
  };

  if (!isLoading && users?.length === 0) {
    return (
      <div className="py-10 text-center text-base font-medium text-gray-500 dark:text-gray-400">
        All users are already added
      </div>
    );
  }

  return (
    <div className="w-full">
      <Form layout="vertical">
        <Form.Item
          label={
            <span className="text-gray-900 dark:text-gray-100">
              Search Members
            </span>
          }
        >
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-900 dark:text-gray-100">
              Members ({members.length} Selected)
            </span>
          }
          className="mb-2"
        >
          <div className="h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            {isLoading ? (
              <div className="flex h-56 items-center justify-center">
                <Spin />
              </div>
            ) : (
              <List
                dataSource={filteredUsers}
                renderItem={(user) => {
                  const checked = members.includes(String(user._id));

                  return (
                    <List.Item
                      onClick={() => toggleMember(String(user._id))}
                      className="cursor-pointer px-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IAvatar src={user.image || undefined}/>

                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {user.fullName}
                            </p>
                          </div>
                        </div>

                        <Checkbox checked={checked} />
                      </div>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        </Form.Item>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            size="large"
            className="w-full sm:w-auto dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={close}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            size="large"
            className="w-full sm:w-auto"
            loading={mutation.isPending}
            disabled={members.length === 0}
            onClick={handleAdd}
          >
            Add Users
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddUsers;