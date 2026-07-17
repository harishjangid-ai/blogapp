"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, message, notification, Upload, Modal } from "antd";
import { SendOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import CreateBlogAI from "../ui/CreateBlogAI";
import { useMutation } from "@tanstack/react-query";
import { createNewBlog } from "@/services/blog";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setBlog } from "@/redux/features/blogSlice";
import { useRouter } from "next/navigation";
import LexicalEditor from "@/components/lexical/LexicalEditor";
import { uploadImage } from "@/services/cloudinary";
import ImagePreview from "../ui/ImagePreview";

const CreateBlog = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<boolean>(false)
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["blog"],
    mutationFn: createNewBlog,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "Failed");
      }

      notification.success({
        message: data.message || "Blog Published Successfully",
      });

      dispatch(setBlog({ blog: null }));
      setImageUrl("");
      setFileList([]);
      form.resetFields();
      router.push("/user/my-blogs");
    },
  });

  const formData = useAppSelector((state) => state.blog.blog);

  const createBlog = (values: any) => {
    const title = values.title?.trim();

    if (!title) {
      return message.error("Please enter blog title");
    }

    if (!values.description) {
      return message.error("Please enter blog content");
    }

    mutation.mutate({
      title,
      description: values.description,
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

      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: data.secure_url,
        },
      ]);

      onSuccess?.(data);
    } catch (error) {
      onError?.(error);
      message.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeFormData = () => {
    dispatch(setBlog({ blog: null }));
    setImageUrl("");
    setFileList([]);
    form.resetFields();
  };

  useEffect(() => {
    if (!formData) return;

    form.setFieldsValue({
      title: formData.title,
      description: formData.description,
    });
  }, [formData, form]);

  return (
    <>
      <div className="max-h-screen flex flex-col items-start px-6">
      <div className="mb-6">
        <h1 className="text-2xl text-black">Blog Editor</h1>
        <p className="text-lg text-gray-500">Create your content below</p>
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <Form form={form} layout="vertical" onFinish={createBlog}>
            <Form.Item
              label={<span className="text-lg font-semibold">Blog Title</span>}
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter blog title",
                },
              ]}
            >
              <Input size="large" placeholder="Enter your blog title..." />
            </Form.Item>

            <Form.Item label="Blog Image">
              <Upload
                customRequest={handleUpload}
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                disabled={uploading}
                onRemove={() => {
                  setFileList([]);
                  setImageUrl("");
                }}
                onPreview={(file) => {
                  setImagePreview(true)
                }}
              >
                {fileList.length === 0 && (
                  <div className="flex flex-col items-center justify-center">
                    {uploading ? (
                      <>
                        <LoadingOutlined style={{ fontSize: 24 }} />
                        <div className="mt-2">Uploading...</div>
                      </>
                    ) : (
                      <>
                        <PlusOutlined />
                        <div className="mt-2">Upload</div>
                      </>
                    )}
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label={
                <span className="text-lg font-semibold">Blog Content</span>
              }
              name="description"
              valuePropName="value"
              rules={[
                {
                  required: true,
                  message: "Please enter blog content",
                },
              ]}
            >
              <LexicalEditor />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                size="large"
                className="rounded-xl bg-green-600! p-2 font-medium hover:bg-green-700!"
                loading={mutation.isPending}
              >
                Publish Blog
              </Button>
            </div>
          </Form>
        </div>

        <CreateBlogAI removeFormData={removeFormData} />
      </div>
    </div>
    <Modal open={imagePreview} onCancel={()=> setImagePreview(false)} footer={false} >
      <ImagePreview imageUrl={imageUrl}/>
    </Modal>
    </>
  );
};

export default CreateBlog;
