"use client";

import { createGroup } from "@/services/chat";
import { usr } from "@/services/users";
import { User } from "@/types/userType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Form, Input, notification } from "antd";
import { useState } from "react";

const CreateGroup = ({ close }: { close: () => void }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const queryClient = useQueryClient(); 

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["group-users"],
    queryFn: usr,
  });

  const mutation = useMutation({
    mutationFn: createGroup,
    onSuccess: (data)=>{
      if(!data.success){
        return notification.error({title: data.error || "failed to create group"})
      }
      queryClient.invalidateQueries({queryKey: ['users']});
      notification.success({title: data.message || "Group created succefully"});
      close();
      return 
    }
  })

  const options =
    users?.map((user) => ({
      label: user.fullName,
      value: String(user._id),
    })) || [];

  const handleCreate = () => {
    if(!groupName){
      return notification.error({title: "Group name is required"})
    }
    if(!members){
      return notification.error({title: "Please select users"})
    }
    mutation.mutate({
      groupName,
      members
    })
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
