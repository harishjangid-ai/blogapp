"use client";

import { setAuth } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { uploadImage } from "@/services/cloudinary";
import { editUser } from "@/services/userDetails";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  Modal,
  Progress,
  Spin,
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
} from "@ant-design/icons";
import ImagePreview from "./ImagePreview";
import IAvatar from "./IAvatar";

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
  const [imagePreview, setImagePreview] = useState(false);
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((u) => u.auth.user);

  const initialImage =
    sessionStorage.getItem("profileImage") ?? userDetails?.imageUrl ?? "";

  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
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
    setImagePreview(true);
  };

  return (
    <>
      <div className="dark:text-gray-100 relative">
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
          <Form.Item
            label={<span className="dark:text-gray-100">Profile Picture</span>}
          >
            <div className="flex flex-col items-center gap-4">
              <Upload
                showUploadList={false}
                customRequest={handleUpload}
                disabled={uploading}
                accept="image/*"
              >
                <div className="relative cursor-pointer">
                  <IAvatar
                    size={120}
                    src={imageUrl || undefined}
                  />
                  <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-black dark:bg-gray-700 text-white">
                    {uploading ? <LoadingOutlined /> : <CameraOutlined />}
                  </div>
                </div>
              </Upload>

              {imageUrl && (
                <div className="flex gap-3">
                  <Button
                    icon={<EyeOutlined />}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
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
            label={<span className="dark:text-gray-100">Full Name</span>}
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
            <Input
              placeholder="Harish Suthar"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            name="userName"
            label={<span className="dark:text-gray-100">Username</span>}
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
            <Input
              placeholder="harish_suthar"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="dark:text-gray-100">Phone Number</span>}
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
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              onInput={(e: any) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  "",
                );
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isPending || uploading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        open={imagePreview}
        footer={false}
        centered
        onCancel={() => setImagePreview(false)}
      >
        <ImagePreview imageUrl={imageUrl} />
      </Modal>
      <Modal
        open={imagePreview}
        footer={false}
        centered
        onCancel={() => setImagePreview(false)}
      >
        <ImagePreview imageUrl={imageUrl} />
      </Modal>
    </>
  );
};

export default EditProfile;
