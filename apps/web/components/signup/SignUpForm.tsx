"use client";

import { signUpFunction } from "@/services/signUp";
import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignUpFormProps {
  userName: string;
  password: string;
  phone: string;
  fullName: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: signUpFunction,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Sign Up Failed",
        });
      }

      notification.success({
        message: data.message || "Sign Up Successful",
      });

      form.resetFields();
      router.push("/login");
    },
    onError: (error: any) => {
      notification.error({
        message: "Sign Up Failed",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong",
      });
    },
  });

  const handleSignUp = (values: SignUpFormProps) => {
    mutation.mutate({
      fullName: values.fullName,
      userName: values.userName,
      phone: values.phone,
      password: values.password,
    });
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex w-75 flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
        >
          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Full Name
              </span>
            }
            name="fullName"
            rules={[
              {
                required: true,
                message: "Full Name is required",
              },
              {
                pattern: /^[A-Z][a-z]+ [A-Z][a-z]+$/,
                message: "Enter name like 'Harish Suthar'",
              },
            ]}
          >
            <Input
              placeholder="Harish Suthar"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                User Name
              </span>
            }
            name="userName"
            rules={[
              {
                required: true,
                message: "Username is required",
              },
              {
                pattern: /^[a-z0-9_]+$/,
                message:
                  "Only lowercase letters and underscore (_) allowed",
              },
            ]}
          >
            <Input
              placeholder="harish_suthar"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Phone
              </span>
            }
            name="phone"
            rules={[
              {
                required: true,
                message: "Phone number is required",
              },
              {
                pattern: /^[6-9]\d{9}$/,
                message:
                  "Phone number must be 10 digits and start with 6-9",
              },
            ]}
          >
            <Input
              placeholder="9876543210"
              maxLength={10}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Password
              </span>
            }
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+=\-{}[\]:;"'<>,./\\|~`]).{8,}$/,
                message:
                  "Min 8 chars, 1 uppercase, 1 lowercase, 1 number and 1 special character required",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={mutation.isPending}
          >
            Sign Up
          </Button>
        </Form>

        <p className="text-center text-sm font-thin text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUpForm;