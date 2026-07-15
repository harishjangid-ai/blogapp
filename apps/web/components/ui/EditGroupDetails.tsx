"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Input, Upload, message } from "antd";
import {
  CameraOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { uploadImage } from "@/services/cloudinary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editGroup } from "@/services/chat";

const EditGroupDetails = ({
  groupId,
  groupName,
  image,
  close,
}: {
  groupId?: string;
  groupName?: string;
  image?: string;
  close: () => void;
}) => {
  const [name, setName] = useState(groupName || "");
  const [imageUrl, setImageUrl] = useState(image || "");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    setName(groupName || "");
    setImageUrl(image || "");
  }, [groupName, image]);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;

    try {
      setUploading(true);

      const data = await uploadImage(file, (percent: number) => {
        onProgress?.({ percent });
      });

      setImageUrl(data.secure_url);

      onSuccess?.(data);
    } catch (error) {
      onError?.(error);
      message.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: editGroup,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "Failed to edit group");
      }
      message.success(data.message || "Group edited successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["selected-user"] });

      close();
    },
  });

  const handleSave = () => {
    mutation.mutate({
      groupId,
      groupName: name,
      imageUrl,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          disabled={uploading}
          accept="image/*"
        >
          <div className="relative cursor-pointer">
            <Avatar
              size={110}
              src={imageUrl || undefined}
              icon={!imageUrl && <UserOutlined />}
              className="border-4 border-gray-200 shadow-lg"
            />

            <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
              {uploading ? <LoadingOutlined /> : <CameraOutlined />}
            </div>
          </div>
        </Upload>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Group Name
        </label>

        <Input
          size="large"
          value={name}
          placeholder="Enter group name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={close}>Cancel</Button>

        <Button type="primary" loading={uploading} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditGroupDetails;
