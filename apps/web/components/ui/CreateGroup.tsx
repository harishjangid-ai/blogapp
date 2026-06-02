"use client";

import { chatUsers } from "@/services/users";
import { User } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import React, { useState } from "react";

const CreateGroup = ({ close }: { close: () => void }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: chatUsers,
  });

  const options =
    users?.map((user) => ({
      label: user.fullName,
      value: String(user._id),
    })) || [];

  const handleCreate = () => {
    const payload = {
      groupName,
      members
    };

    console.log(payload);
    close();
  };

  const handleCancel = () => {
    setGroupName("");
    setMembers([]);
    close();
  };

  return (
    <div className="w-full">
      <Form layout="vertical" className="w-full">
        <Form.Item label="Group Name" required>
          <Input
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Form.Item>

        <Divider />

        <Form.Item label="Select Members">
          <Checkbox.Group
            options={options}
            value={members}
            onChange={(checkedValues) => setMembers(checkedValues as string[])}
            className="flex flex-col gap-3"
          />
        </Form.Item>

        <Divider />

        <div className="flex justify-end gap-3">
          <Button size="large" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleCreate}
            loading={isLoading}
            disabled={!groupName || members.length === 0}
          >
            Create Group
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateGroup;
