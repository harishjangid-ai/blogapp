"use client";
import { getReports, resolveReport } from "@/services/blog";
import { ReportProps } from "@/types/blog";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
import { useEffect, useRef } from "react";
import { getPreviewText } from "@/hooks/DescriptionHelper";
import DataNotFound from "./DataNotFound";

const Report = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["reports"],
      queryFn: ({ pageParam = 1 }) =>
        getReports({
          page: pageParam,
          limit: 10,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
      },
    });

  const reports: ReportProps[] =
    data?.pages.flatMap((page) => page.reports) || [];

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: resolveReport,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error);
      }
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report-count"] });
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

  if (reports?.length === 0 || !reports) {
    return (
      <DataNotFound
        title="No Reports Found"
        description="There are currently no reports to review."
      />
    );
  }

  return (
    <>
      <div
        className={
          prev
            ? "hidden"
            : "flex min-h-screen w-full flex-col items-center bg-[#f5f5f5] dark:bg-gray-950 px-4 py-6"
        }
      >
        <div className="flex w-full max-w-6xl flex-col gap-6">
          {reports?.map((report) => (
            <div
              key={report._id}
              className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />

              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <WarningOutlined className="text-2xl text-red-500" />

                      <h2 className="text-2xl font-semibold text-black dark:text-gray-100">
                        {report.blog.title}
                      </h2>
                    </div>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Content moderation required
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white">
                    {report.reportStatus}
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <WarningOutlined />
                      <span>Report Reason</span>
                    </div>

                    <div className="mt-3 inline-flex rounded-full border border-red-500 px-4 py-1 text-sm font-medium text-red-500">
                      {report.reason}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <UserOutlined />
                      <span>Reported By</span>
                    </div>

                    <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {report.reportedBy.fullName}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <CalendarOutlined />
                      <span>Report Date</span>
                    </div>

                    <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatDateTime(report.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

                <div>
                  <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <FileTextOutlined />
                    <span>Blog Preview</span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5">
                    <h3 className="text-xl font-semibold text-black dark:text-gray-100">
                      {report.blog.title}
                    </h3>

                    <p className="wrap-break-word mt-3 line-clamp-2 text-gray-600 dark:text-gray-400">
                      {getPreviewText(report.blog.description)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handlePreview({ id: report.blog._id })}
                  >
                    <EyeOutlined />
                    Preview Blog
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleReject({ reportId: report._id })}
                  >
                    <StopOutlined />
                    Ignore Report
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500 py-3 px-4 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete({ reportId: report._id })}
                  >
                    <DeleteOutlined />
                    Delete Blog
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            ref={loaderRef}
            className="flex h-10 items-center justify-center"
          >
            {isFetchingNextPage && (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            )}
          </div>
        </div>
      </div>

      {prev && (
        <div className="flex min-h-[calc(100vh-60px)] w-full justify-center">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default Report;
