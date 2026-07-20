"use client";

import { setActiveRole, setAuth } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import { loginFunction } from "@/services/login";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button, message, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginFormProps {
  userName: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormProps>({
    userName: "",
    password: "",
  });

  useEffect(() => {
    const getMe = async () => {
      await api.get("/me", { withCredentials: true });
    };
    getMe();
  }, []);

  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: loginFunction,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error);
      }

      notification.success({
        message: data.message || "Login successful",
      });

      dispatch(setAuth({ isAuth: true, user: data.user }));
      dispatch(setActiveRole({ activeRole: data.activeRole }));

      document.cookie = `activeRole=${data.activeRole}; path=/; max-age=604800; SameSite=Lax`;

      router.replace("/");
    },
    onError: (error: any) => {
      message.error(error?.error || error?.message || "login failed");
    },
  });

  const handleLogin = () => {
    const userName = form.userName;
    const password = form.password;

    if (!userName.trim() || !password.trim()) {
      return message.error("All fields are required");
    }

    mutation.mutate({
      userName,
      password,
    });
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex w-75 flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <Form onSubmitCapture={handleLogin}>
          <Form.Item>
            <label className="mb-1 block text-gray-700 dark:text-gray-300">
              Username
            </label>
            <Input
              placeholder="Username"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              value={form.userName}
              onChange={(e) =>
                setForm({ ...form, userName: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item>
            <label className="mb-1 block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Input.Password
              placeholder="Password"
              type="password"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </Form.Item>

          <Button type="primary" className="w-full" htmlType="submit">
            Login
          </Button>
        </Form>

        <p className="text-center text-sm font-thin text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;