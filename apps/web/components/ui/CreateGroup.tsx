"use client";

import { createGroup } from "@/services/chat";
import { uploadImage } from "@/services/cloudinary";
import { usr } from "@/services/users";
import { User } from "@/types/userType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  List,
  Checkbox,
  message,
  notification,
  Upload,
  Spin,
} from "antd";
import { useMemo, useState } from "react";
import {
  CameraOutlined,
  LoadingOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDebounce } from "@/hooks/useDebounce";

const CreateGroup = ({ close }: { close: () => void }) => {
  const [groupName, setGroupName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["group-users"],
    queryFn: usr,
  });

  const mutation = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Failed to create group",
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      notification.success({
        message: data.message || "Group created successfully",
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

  const handleCreate = () => {
    if (!groupName.trim()) {
      return notification.error({
        message: "Group name is required",
      });
    }

    if (members.length === 0) {
      return notification.error({
        message: "Please select members",
      });
    }

    mutation.mutate({
      groupName,
      imageUrl,
      members,
    });
  };

  const handleCancel = () => {
    setGroupName("");
    setImageUrl("");
    setMembers([]);
    setSearch("");
    close();
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;

    try {
      setUploading(true);

      const data = await uploadImage(file, (percent: number) => {
        onProgress?.({ percent });
      });

      setImageUrl(data.secure_url);

      sessionStorage.setItem("groupIcon", data.secure_url);

      onSuccess?.(data);
    } catch (error) {
      onError?.(error);
      message.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggleMember = (id: string) => {
    if (members.includes(id)) {
      setMembers((prev) => prev.filter((item) => item !== id));
    } else {
      setMembers((prev) => [...prev, id]);
    }
  };

  return (
    <div className="w-full">
      <Form layout="vertical">
        <div className="mb-8 flex justify-center">
          <Upload
            showUploadList={false}
            customRequest={handleUpload}
            disabled={uploading}
            accept="image/*"
          >
            <div className="relative cursor-pointer">
              <Avatar
                size={120}
                src={imageUrl || undefined}
                icon={!imageUrl && <UserOutlined />}
                className="border-4 border-gray-200 shadow-md"
              />

              <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                {uploading ? <LoadingOutlined /> : <CameraOutlined />}
              </div>
            </div>
          </Upload>
        </div>

        <Form.Item label="Group Name" required>
          <Input
            size="large"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Form.Item>

        

        <Form.Item label="Search Members">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={`Members (${members.length} Selected)`}
          className="mb-2"
        >
          <div className="h-56 overflow-y-auto rounded-lg border bg-white">
            {isLoading ? (
              <div className="flex h-72 items-center justify-center">
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
                      className="cursor-pointer px-4 transition hover:bg-gray-50"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.image || undefined}
                            icon={<UserOutlined />}
                          />

                          <div>
                            <p className="font-medium">{user.fullName}</p>
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
            className="w-full sm:w-auto"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            size="large"
            className="w-full sm:w-auto"
            loading={mutation.isPending}
            disabled={!groupName || members.length === 0}
            onClick={handleCreate}
          >
            Create Group
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateGroup;