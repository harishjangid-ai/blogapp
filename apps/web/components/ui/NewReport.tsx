"use client";

import { reportBlog } from "@/services/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";

const NewReport = ({
  blogId,
  close,
}: {
  blogId: string;
  close: () => void;
}) => {
  const [reason, setReason] = useState<string>("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: reportBlog,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "Failed");
      }

      message.success(data.message);
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["report-count"] });
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
    <div className="flex flex-col gap-2 dark:text-gray-100">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Report
      </h1>

      <Form onFinish={report}>
        <Form.Item>
          <Input
            value={reason}
            placeholder="Report reason"
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            onChange={(e) => setReason(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            type="default"
            loading={mutation.isPending}
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewReport;