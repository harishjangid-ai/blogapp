"use client";
import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/redux/store/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogComments, newComment } from "@/services/blog";
import { CommentType } from "@/types/blog";
import { formatTime } from "@/hooks/formatTime";
import { formatDateTime } from "@/hooks/formatDate";

const AddComment = () => {
  const [commentText, setCommentText] = useState<string>("");
  const blogId = useAppSelector((i) => i.p.id);
  const queryClient = useQueryClient();
  const { data: comments } = useQuery<CommentType[]>({
    queryKey: ["comments"],
    queryFn: () => blogComments({ blogId }),
  });
  const mutation = useMutation({
    mutationFn: newComment,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          title: data.error || "Failed to add comment",
        });
      }
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      return notification.success({ title: data.message || "Comment added" });
    },
  });
  const handleComment = () => {
    if (!commentText.trim()) {
      return notification.error({ title: "Please write comment" });
    }
    setCommentText("");
    mutation.mutate({
      blogId,
      comment: commentText,
    });
  };
  return (
    <div className="flex flex-col mt-2 mb-2 gap-2">
      <Form className="flex gap-2" onFinish={handleComment}>
        <Input
          placeholder="Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          disabled={!commentText.trim()}
          htmlType={"submit"}
          icon={<SendOutlined />}
        />
      </Form>
      <div className="flex flex-col gap-2">
        {comments?.toReversed().map((data) => (
          <div className="border p-1 flex w-full gap-2 rounded-2xl items-center">
            <h1 className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              {data.userId.fullName
                .split(" ")
                .map((w) => w[0].toUpperCase())
                .join("")}
            </h1>
            <div className="flex w-full justify-between">
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">{data.userId.fullName}</p>
                <p>{data.comment}</p>
              </div>
              <div className="">
                <h2 className="flex items-center text-sm text-gray-500">{formatDateTime(data.createdAt)}<span className="text-xs text-gray-400">({formatTime(data.createdAt)})</span></h2>
              </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddComment;
