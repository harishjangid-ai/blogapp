"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentCount, isBlogReported, likeBlog, selectedBlog } from "@/services/blog";
import { BlogType} from "@/types/blog";
import { Button, Modal, notification, Spin } from "antd";
import { formatDateTime } from "@/hooks/formatDate";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { FlagOutlined, HeartOutlined, MessageOutlined } from "@ant-design/icons";
import { setPreview } from "@/redux/features/previewSlice";
import NewReport from "./NewReport";
import AddComment from "./AddComment";
import { useRouter } from "next/navigation";

const BlogPreview = () => {
  const [report, setReport] = useState<boolean>(false);
  const [comment, setComment] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = useAppSelector((i) => i.p.id);
  const user = useAppSelector((i) => i.auth.isAuth);
  const userId = useAppSelector((i) => i.auth.user?._id);

  const dispatch = useAppDispatch();
  const { data: blog, isLoading } = useQuery<BlogType>({
    queryKey: ["blog", id],
    queryFn: () => selectedBlog({ id }),
    enabled: !!id,
  });

  const {data: count} = useQuery({
    queryKey: ['count'],
    queryFn: ()=> commentCount({blogId: id}),
    enabled: !!id
  })

  const reportMutation = useMutation({
    mutationFn: isBlogReported,
  });

  const mutation = useMutation({
    mutationFn: likeBlog,

    onMutate: async ({ blogId }) => {
      await queryClient.cancelQueries({
        queryKey: ["blog", blogId],
      });

      const previousBlog = queryClient.getQueryData<BlogType>(["blog", blogId]);

      queryClient.setQueryData<BlogType>(["blog", blogId], (old) => {
        if (!old) return old;

        return {
          ...old,
          isLiked: !old.isLiked,
          likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      return { previousBlog, blogId };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousBlog) {
        queryClient.setQueryData(
          ["blog", context.blogId],
          context.previousBlog,
        );
      }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["blog", variables.blogId], (old: any) => ({
        ...old,
        isLiked: data.isLiked,
        likeCount: data.likeCount,
      }));

      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
    },
  });

  const close = () => {
    dispatch(setPreview({ preview: false, id: "" }));
  };

  const handleReport = () => {
    reportMutation.mutate({ blogId: id }, {
      onSuccess: (data) => {
        if (data.success) {
          setReport(true);
          return;
        }
        notification.error({title: "Already reported"})
      }
    });
  };

  const onClose = () => {
    setReport(false);
  };

  const like = () => {
    if (!id || mutation.isPending) return;

    mutation.mutate({
      blogId: id,
    });
  };

  const openComment = () => {
    setComment(!comment);
  };

  const loginRequired = ()=>{
    notification.warning({title: "Login required for any action"});
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-2 flex flex-col w-full bg-gray-100 max-w-4xl overflow-y-auto min-h-[calc(100vh-55px)] gap-3">
        <div className="flex max-w-4xl w-full border-b">
            <Button
              className="text-gray-500! border! border-gray-500! hover:text-black! mb-3"
              onClick={close}
            >
              ← Back to Home
            </Button>
        </div>

        <div className="flex flex-col items-center">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between border-b pb-6 mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                  {blog?.userId.fullName
                    ?.split(" ")
                    ?.map((w) => w[0].toUpperCase())
                    ?.join("")}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {blog?.userId.fullName}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {formatDateTime(blog?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <button
                  disabled={!user || userId === blog?.userId._id}
                  className={`${!user || userId === blog?.userId._id ? "opacity-50 cursor-not-allowed" : "flex items-center gap-2 border rounded-lg px-4 py-2 text-red-500 hover:bg-red-50"}`}
                  onClick={handleReport}
                >
                  <FlagOutlined />
                  Report
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-3">
                {blog?.title}
              </h1>

              <div className="max-h-100 overflow-y-auto mb-3">
                <p className="whitespace-pre-line">
                  {blog?.description}
                </p>
              </div>
            </div>

            <div className="border-t mt-10 pt-6 flex gap-4">
              <button
                disabled={mutation.isPending}
                className={`flex items-center gap-2 border rounded-lg px-4 py-2 ${
                  blog?.isLiked ? "text-red-500 bg-red-50" : "hover:bg-gray-50"
                }`}
                onClick={!user ? loginRequired :like}
              >
                <HeartOutlined />
                {blog?.likeCount ?? 0}
              </button>

              <button
                className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50"
                onClick={!user ? loginRequired : openComment}
              >
                <MessageOutlined /> Comments {" "} <span className="text-sm">({count})</span>
              </button>
            </div>
            {comment && <AddComment user={blog?.userId._id} />}
          </div>
        </div>

        {report && (
          <Modal onCancel={onClose} footer={false} open={report}>
            <NewReport blogId={id} close={onClose} />
          </Modal>
        )}
      </div>
    </>
  );
};

export default BlogPreview;
