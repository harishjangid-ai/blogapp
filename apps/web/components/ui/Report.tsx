"use client";
import { getReports, resolveReport } from "@/services/blog";
import { ReportProps } from "@/types/blog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import {
  WarningOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EyeOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { formatDateTime } from "@/hooks/formatDate";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setPreview } from "@/redux/features/previewSlice";
import BlogPreview from "./BlogPreview";
import { Empty, message, notification } from "antd";

const Report = ({reports}:{reports: ReportProps[] | undefined}) => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: resolveReport,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error);
      }
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      return notification.success({ title: data.message });
    },
  });

  const prev = useAppSelector((p) => p.p.preview);

  const dispatch = useAppDispatch();

  const handlePreview = ({ id }: { id: string }) => {
    dispatch(setPreview({ preview: true, id }));
  };

  const handleDelete = ({ reportId }: { reportId: string }) => {
    mutation.mutate({
      reportId,
      status: "approved",
    });
  };

  const handleReject = ({ reportId }: { reportId: string }) => {
    mutation.mutate({
      reportId,
      status: "rejected",
    });
  };

  if (reports?.length === 0) {
    return (
      <div className="flex flex-col items-center w-full py-6 px-4 ">
        <div className="flex flex-col gap-6 w-full max-w-6xl">
          <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <Empty description="There are currently no reports to review." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          prev
            ? "hidden"
            : "flex flex-col items-center w-full py-6 px-4 bg-[#f5f5f5] min-h-screen"
        }
      >
        <div className="flex flex-col gap-6 w-full max-w-6xl">
          {reports?.map((report) => (
            <div
              key={report._id}
              className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <WarningOutlined className="text-red-500 text-2xl" />

                      <h2 className="text-2xl font-semibold text-black">
                        {report.blog.title}
                      </h2>
                    </div>

                    <p className="mt-2 text-gray-500">
                      Content moderation required
                    </p>
                  </div>

                  <span className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-full w-fit">
                    {report.reportStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <WarningOutlined />
                      <span>Report Reason</span>
                    </div>

                    <div className="mt-3 inline-flex border border-red-500 text-red-500 rounded-full px-4 py-1 text-sm font-medium">
                      {report.reason}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <UserOutlined />
                      <span>Reported By</span>
                    </div>

                    <p className="mt-3 font-semibold text-lg">
                      {report.reportedBy.fullName}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarOutlined />
                      <span>Report Date</span>
                    </div>

                    <p className="mt-3 font-semibold text-lg">
                      {formatDateTime(report.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6" />
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <FileTextOutlined />
                    <span>Blog Preview</span>
                  </div>

                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-xl font-semibold text-black">
                      {report.blog.title}
                    </h3>

                    <p className="mt-3 text-gray-600 line-clamp-2 wrap-break-word">
                      {report.blog.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <button
                    className="border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                    onClick={() => handlePreview({ id: report.blog._id })}
                  >
                    <EyeOutlined />
                    Preview Blog
                  </button>

                  <button
                    className="border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                    onClick={() => handleReject({ reportId: report._id })}
                  >
                    <StopOutlined />
                    Ignore Report
                  </button>

                  <button
                    className="border border-gray-300 text-red-600 rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-red-50 transition"
                    onClick={() => handleDelete({ reportId: report._id })}
                  >
                    <DeleteOutlined />
                    Delete Blog
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {prev && (
        <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default Report;
