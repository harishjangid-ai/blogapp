"use client";

import { changePassword } from "@/services/userDetails";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, notification } from "antd";

interface FormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

const ChangePassword = ({close}: {close:()=>void}) => {
  const [form] = Form.useForm<FormProps>();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({ message: data.error || "Something went wrong" });
      }
      notification.success({ message: data.message || "Password changed successfully"});
      form.resetFields();
      close();
    },
    onError: (error: any) => {
      notification.error({
        message: error?.message || "Something went wrong",
      });
    },
  });

  const handleSubmit = (values: FormProps) => {
    mutation.mutate({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div>
      <Form<FormProps> form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[
            {
              required: true,
              message: "Please enter your old password",
            },
          ]}
        >
          <Input.Password placeholder="Enter your old password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          dependencies={["oldPassword"]}
          rules={[
            {
              required: true,
              message: "Please enter new password",
            },
            {
              pattern: passwordRegex,
              message:
                "Password must be at least 8 characters and contain uppercase, lowercase, number and special character",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value !== getFieldValue("oldPassword")) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("New password cannot be same as old password"),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
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

export default ChangePassword;
