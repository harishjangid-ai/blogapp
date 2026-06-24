"use client";

import { setAuth } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { editUser } from "@/services/userDetails";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, notification } from "antd";

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

  const mutation = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Something went wrong",
        });
      }

      notification.success({
        message: data.message || "User updated",
      });
      dispatch(
        setAuth({
          isAuth: true,
          user: {
            ...userDetails,
            fullName: data.user.fullName,
            userName: data.user.userName,
            phone: data.user.phone,
          },
        }),
      );
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
    });
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
              e.target.value = e.target.value.replace(/\D/g, "");
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
