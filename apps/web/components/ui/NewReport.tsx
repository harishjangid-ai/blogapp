"use client";

import { reportBlog } from "@/services/blog";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";

const NewReport = ({ blogId, close }: { blogId: string; close: () => void }) => {
  const [reason, setReason] = useState<string>("");

  const mutation = useMutation({
    mutationFn: reportBlog,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "Failed");
      }

      message.success(data.message);
      setReason("");
      close();
    },
    onError: (d) => {
      message.error(d.message);
    },
  });

  const report = () => {
    if (!reason.trim()) {
      return message.error("Please enter a valid reason");
    }

    mutation.mutate({ reason, blogId });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1>Report</h1>

      <Form onFinish={report}>
        <Form.Item>
          <Input
            onChange={(e) => setReason(e.target.value)}
            value={reason}
            placeholder="Report reason"
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="default" loading={mutation.isPending}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewReport;
