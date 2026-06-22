"use client";

import { setAuth } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import { loginFunction } from "@/services/login";
import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button, message, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationFn: loginFunction,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error);
      }
      notification.info({message: data.message || "Logged in successfull"})
      dispatch(setAuth({ isAuth: true, user: data.user }));
      router.push("/");
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
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-75 flex flex-col gap-2">
        <Form onSubmitCapture={handleLogin}>
          <Form.Item>
            <label>Username</label>
            <Input
              placeholder="Username"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <label>Password</label>
            <Input.Password
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Form.Item>

          <Button type="primary" className="w-full" htmlType="submit">
            Login
          </Button>
        </Form>
        <p className="text-center font-thin text-sm">
          Don't have an account?{" "}
          <Link href={"/sign-up"} className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
