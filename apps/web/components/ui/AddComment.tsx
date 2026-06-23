"use client";

import { Button, Form, Input, Mentions, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/redux/store/hooks";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogComments, commentReplies, commentReply, newComment } from "@/services/blog";
import { CommentType, ReplyType } from "@/types/blog";
import { formatTime } from "@/hooks/formatTime";
import { formatDateTime } from "@/hooks/formatDate";
import { User } from "@/types/userType";
import { usr } from "@/services/users";

const AddComment = ({ user }: { user: string | undefined }) => {
  const [commentText, setCommentText] = useState<string>("");
  const [commentId, setCommentId] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [reply, setReply] = useState<boolean>(false);
  const blogId = useAppSelector((i) => i.p.id);
  const queryClient = useQueryClient();
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["comments", blogId],
    queryFn: ({ pageParam = 1 }) =>
      blogComments({
        page: pageParam,
        limit: 10,
        blogId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
  });

  const comments: CommentType[] = data?.pages.flatMap((page) => page.comments) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usr,
  });
  const { data: replies } = useQuery<ReplyType[]>({
    queryKey: ["replies", commentId],
    queryFn: () => commentReplies({ commentId }),
    enabled: !!commentId,
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
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      queryClient.invalidateQueries({ queryKey: ["count"] });
      return notification.success({ title: data.message || "Comment added" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: commentReply,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          title: data.error || "Failed to add comment",
        });
      }
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["count"] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      return notification.success({ title: data.message || "Replied" });
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

  const handleReply = (e: any) => {
    if (!replyText || !commentId) {
      return notification.error({ title: "Please write a reply" });
    }
    replyMutation.mutate({
      commentId,
      reply: replyText,
    });
  };
  const commentRep = ({ commentId }: { commentId: string }) => {
    setReply(true);
    setCommentId(commentId);
  };
  return (
    <div className="flex flex-col mt-2 mb-2 gap-2">
      <Form className="flex gap-2" onFinish={handleComment}>
        <Mentions
          value={commentText}
          onChange={setCommentText}
          placeholder="Comment"
          options={
            users?.map((u) => ({
              value: u.userName,
              label: u.fullName,
            })) ?? []
          }
        />
        <Button
          disabled={!commentText.trim()}
          htmlType="submit"
          icon={<SendOutlined />}
        />
      </Form>
      <div className="h-[50vh] overflow-y-auto">
        {comments.map((data) => (
          <div key={data._id}>
            <div className="border p-1 flex w-full gap-2 rounded-2xl mb-2">
              <h1 className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                {data.userId.fullName
                  .split(" ")
                  .map((w) => w[0].toUpperCase())
                  .join("")}
              </h1>
              <div className="flex w-full justify-between gap-1">
                <div className="flex flex-col items-start">
                  <p className="text-xs text-gray-400 flex">
                    <span>{data.userId.fullName}</span>{" "}
                    <span
                      className={
                        data.userId._id === user ? "flex text-xs" : "hidden"
                      }
                    >
                      (Author)
                    </span>
                  </p>
                  <p>{data.comment}</p>
                  <button
                    className="text-xs"
                    onClick={
                      reply
                        ? () => setReply(false)
                        : () => commentRep({ commentId: data._id })
                    }
                  >
                    Reply
                  </button>
                  {reply && (
                    <div
                      className={
                        commentId !== data._id
                          ? "hidden"
                          : "flex flex-col gap-2 "
                      }
                    >
                      <Form className={"flex gap-2"} onFinish={handleReply}>
                        <Input
                          placeholder="reply"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <Button
                          disabled={!replyText.trim()}
                          htmlType="submit"
                          icon={<SendOutlined />}
                        />
                      </Form>
                      {replies?.map((rep) => (
                        <div className="border p-1 flex w-full gap-2 rounded-2xl mb-2">
                          <h1 className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {rep.userId.fullName
                              .split(" ")
                              .map((w) => w[0].toUpperCase())
                              .join("")}
                          </h1>
                          <div className="flex w-full justify-between gap-1">
                            <div className="flex flex-col items-start">
                              <p className="text-sm text-gray-400 flex">
                                <span>{rep.userId.fullName}</span>{" "}
                                <span
                                  className={
                                    rep.userId._id === user
                                      ? "flex text-xs"
                                      : "hidden"
                                  }
                                >
                                  (Author)
                                </span>
                              </p>
                              <p>{rep.reply}</p>
                            </div>
                            <div className="">
                              <h2 className="flex items-center text-sm text-gray-500">
                                {formatDateTime(rep.createdAt)}
                                <span className="text-xs text-gray-400">
                                  ({formatTime(rep.createdAt)})
                                </span>
                              </h2>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="">
                  <h2 className="flex items-center text-sm text-gray-500">
                    {formatDateTime(data.createdAt)}
                    <span className="text-xs text-gray-400">
                      ({formatTime(data.createdAt)})
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={loaderRef} className="h-10 flex justify-center items-center">
          {isFetchingNextPage && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default AddComment;
