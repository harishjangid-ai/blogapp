"use client";
import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import CreateBlogAI from "../ui/CreateBlogAI";
import { useMutation } from "@tanstack/react-query";
import { createNewBlog } from "@/services/blog";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setBlog } from "@/redux/features/blogSlice";

const { TextArea } = Input;

const CreateBlog = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationKey: ["blog"],
    mutationFn: createNewBlog,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "failed");
      }
      message.success(data.message || "Blog Published Successfully");
      dispatch(setBlog({ blog: null }));
      form.resetFields();
    },
  });

  const formData = useAppSelector((p) => p.blog.blog);

  const createBlog = (values: any) => {
    const title = values.title.trim();
    const description = values.description;
    if (!title || !description.trim()) {
      return message.error("All fields are required");
    }
    mutation.mutate({
      title,
      description,
    });
  };

  const removeFormData = () => {
    dispatch(setBlog({ blog: null }));
    form.resetFields();
    console.log("Form Data removed seccussefully");
  };

  useEffect(() => {
    if (formData) {
      form.setFieldsValue({
        title: formData.title,
        description: formData.description,
      });
      console.log(formData);
    }
  }, [formData]);

  return (
    <div className="max-h-screen flex flex-col items-start">
      <div className="mb-6">
        <h1 className="text-2xl text-black">Blog Editor</h1>
        <p className="text-lg text-gray-500">Create your content below</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <Form form={form} layout="vertical" onFinish={createBlog}>
            <Form.Item
              label={<span className="font-semibold text-lg">Blog Title</span>}
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter blog title",
                },
              ]}
            >
              <Input
                placeholder="Enter your blog title..."
                size="large"
                className="p-2 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-semibold text-lg">Blog Content</span>
              }
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter blog content",
                },
              ]}
            >
              <TextArea
                rows={8}
                placeholder="Write your blog content here..."
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                size="large"
                className="p-2 rounded-xl bg-green-600! hover:bg-green-700! font-medium"
              >
                Publish Blog
              </Button>
            </div>
          </Form>
        </div>

        <CreateBlogAI removeFormData={removeFormData} />
      </div>
    </div>
  );
};

export default CreateBlog;
