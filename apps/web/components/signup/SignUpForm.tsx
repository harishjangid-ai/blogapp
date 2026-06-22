"use client";

import { signUpFunction } from "@/services/signUp";
import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignUpFormProps {
  userName: string;
  password: string;
  phone: string;
  fullName: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const [form, setForm] = useState<SignUpFormProps>({
    userName: "",
    password: "",
    fullName: "",
    phone: "",
  });

  const mutation = useMutation({
    mutationFn: signUpFunction,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({ title: data.error || "Sign Up Failed" });
      }
      notification.success({ title: data.message || "Sign Up Successful", });
      router.push("/login");
    },
    onError: (error: any) => {
      notification.error({ title: "Sign Up Failed", message: error?.error || error?.message || "Sign up failed" });
    },
  });

  const handleSignUp = () => {
    const userName = form.userName;
    const password = form.password;
    const phone = form.phone;
    const fullName = form.fullName.trim();
    if (!userName.trim() || !password.trim() || !fullName || !phone.trim()) {
      return notification.error({ title: "All fields are required" });
    }
    

    mutation.mutate({
      userName,
      password,
      fullName,
      phone,
    });
  };

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="w-75 flex flex-col gap-2">
        <Form onSubmitCapture={handleSignUp}>
          <Form.Item>
            <label>Full Name</label>
            <Input
              placeholder="Fullname"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <label>User Name</label>
            <Input
              placeholder="Username"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <label>Phone</label>
            <Input
              placeholder="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
            Sign Up
          </Button>
        </Form>
        <p className="text-center font-thin text-sm">Already have an account? <Link href={"/login"} className="text-blue-500">Login</Link></p>
      </div>
    </main>
  );
};

export default SignUpForm;
