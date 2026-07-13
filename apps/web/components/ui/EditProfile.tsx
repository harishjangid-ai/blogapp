"use client";

import { setAuth } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { uploadImage } from "@/services/cloudinary";
import { editUser } from "@/services/userDetails";
import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Form,
  Input,
  Upload,
  message,
  notification,
} from "antd";
import { useState } from "react";
import {
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface FormProps {
  fullName: string;
  userName: string;
  phone: string;
}

const fullNameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
const userNameRegex = /^[a-zA-Z0-9_]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

const EditProfile = ({ close }: { close: () => void }) => {
  const [form] = Form.useForm<FormProps>();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((u) => u.auth.user);

  const initialImage =
    sessionStorage.getItem("profileImage") ?? userDetails?.imageUrl ?? "";

  const [imageUrl, setImageUrl] = useState<string | null>(
    initialImage || null,
  );
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Something went wrong",
        });
      }

      sessionStorage.setItem("profileImage", data.user.image ?? "");

      dispatch(
        setAuth({
          isAuth: true,
          user: {
            ...userDetails,
            fullName: data.user.fullName,
            userName: data.user.userName,
            phone: data.user.phone,
            imageUrl: data.user.image,
          },
        }),
      );

      notification.success({
        message: data.message || "User updated",
      });

      close();
    },
    onError: (error: any) => {
      notification.error({
        message: error?.message || "Something went wrong",
      });
    },
  });

  const handleEdit = (values: FormProps) => {
    mutation.mutate({
      fullName: values.fullName.trim(),
      userName: values.userName.trim(),
      phone: values.phone.trim(),
      imageUrl,
    });
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;

    try {
      setUploading(true);

      const data = await uploadImage(file, (percent: number) => {
        onProgress?.({ percent });
      });

      setImageUrl(data.secure_url);
      sessionStorage.setItem("profileImage", data.secure_url);

      onSuccess?.(data);
    } catch (error) {
      onError?.(error);
      message.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setImageUrl(null);
    sessionStorage.setItem("profileImage", "");
  };

  const handlePreview = () => {
    if (!imageUrl) return;
    window.open(imageUrl, "_blank");
  };

  return (
    <div>
      <Form<FormProps>
        form={form}
        layout="vertical"
        onFinish={handleEdit}
        initialValues={{
          fullName: userDetails?.fullName,
          userName: userDetails?.userName,
          phone: userDetails?.phone,
        }}
      >
        <Form.Item label="Profile Picture">
          <div className="flex flex-col items-center gap-4">
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
                />
                <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                  {uploading ? <LoadingOutlined /> : <CameraOutlined />}
                </div>
              </div>
            </Upload>

            {imageUrl && (
              <div className="flex gap-3">
                <Button
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                >
                  Preview
                </Button>

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            {
              required: true,
              message: "Full name is required",
            },
            {
              pattern: fullNameRegex,
              message:
                "Enter first and last name with capital first letters (Example: Harish Suthar)",
            },
          ]}
        >
          <Input placeholder="Harish Suthar" />
        </Form.Item>

        <Form.Item
          name="userName"
          label="Username"
          rules={[
            {
              required: true,
              message: "Username is required",
            },
            {
              pattern: userNameRegex,
              message:
                "Username can contain only letters, numbers and underscore (_)",
            },
          ]}
        >
          <Input placeholder="harish_suthar" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Phone number is required",
            },
            {
              pattern: phoneRegex,
              message:
                "Phone number must start with 6-9 and be exactly 10 digits",
            },
          ]}
        >
          <Input
            placeholder="9876543210"
            maxLength={10}
            onInput={(e: any) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={mutation.isPending}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;