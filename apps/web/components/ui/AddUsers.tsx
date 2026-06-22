"use client";

import { addMoreUsers, otherUsers } from "@/services/chat";
import { ReUser } from "@/types/userType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Form, notification } from "antd";
import { useState } from "react";

const AddUsers = ({ chatId, close }: { chatId: string | undefined; close: () => void; }) => {
  const [members, setMembers] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery<ReUser[]>({
    queryKey: ["other-users"],
    queryFn: () => otherUsers({ chatId }),
    enabled: !!chatId,
  });
  const mutation = useMutation({
    mutationFn: addMoreUsers,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          title: data.error || "failed to create group",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["selected-user"] });
      notification.success({
        title: data.message || "Group updated successfully",
      });
      close();
      return;
    },
  });
  const options =
    users?.map((user) => ({
      label: user.fullName,
      value: String(user._id),
    })) || [];
  const handleCreate = () => {
    if (!members) {
      return notification.error({ title: "Please select users" });
    }
    mutation.mutate({
      chatId,
      members,
    });
  };
  return (
    <>
      {users?.length === 0 ? (
        <h1>All Users are already added</h1>
      ) : (
        <div className="flex flex-col gap-2">
          <h2>Select Members</h2>
          <Form.Item>
            <Checkbox.Group
              options={options}
              value={members}
              onChange={(checkedValues) =>
                setMembers(checkedValues as string[])
              }
              className="flex flex-col gap-3"
            />
          </Form.Item>
          <Button
            loading={isLoading}
            disabled={members.length === 0}
            onClick={handleCreate}
          >
            Add
          </Button>
        </div>
      )}
    </>
  );
};

export default AddUsers;
