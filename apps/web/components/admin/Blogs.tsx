"use client";

import Card from "../ui/Card";
import { FileTextOutlined } from "@ant-design/icons";
import BlogTable from "../ui/BlogTable";
import { useAppSelector } from "@/redux/store/hooks";
import { allLikes, apiRes, reportCount } from "@/services/blog";
import { useQuery } from "@tanstack/react-query";
import { Likes } from "@/types/blog";

const Blogs = () => {
  const { data: likes } = useQuery<Likes[]>({
    queryKey: ["likes"],
    queryFn: allLikes,
  });

  const { data: blogs } = useQuery<number | undefined>({
    queryKey: ["blog-count"],
    queryFn: apiRes,
  });

  const { data: reports } = useQuery<number>({
    queryKey: ["report-count"],
    queryFn: reportCount,
  });

  const preview = useAppSelector((p) => p.p.preview);

  return (
    <main className="flex flex-col gap-4 px-6 dark:bg-gray-950">
      <div
        className={
          preview ? "hidden" : "mt-3 flex flex-col items-start"
        }
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          <FileTextOutlined className="text-green-600!" /> Blogs Management
        </h1>

        <p className="text-base font-thin text-gray-600/40 dark:text-gray-400">
          Share your knowledge and insights with our community
        </p>
      </div>

      <div
        className={
          preview
            ? "hidden"
            : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        }
      >
        <Card title="Total Blogs" css="text-black dark:text-gray-100" total={blogs} />

        <Card
          title="Total Reports"
          css="text-blue-500"
          total={reports || 0}
        />

        <Card
          title="Total Likes"
          css="text-red-500"
          total={likes?.length || 0}
        />
      </div>

      <BlogTable />
    </main>
  );
};

export default Blogs;