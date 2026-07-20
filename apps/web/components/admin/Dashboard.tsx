"use client";

import AdminCard from "@/components/ui/AdminCard";
import {
  LikeOutlined,
  FileTextOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getUserCount } from "@/services/users";
import { allLikes, apiRes, reportCount } from "@/services/blog";
import { Likes } from "@/types/blog";

const Dashboard = () => {
  const { data: likes } = useQuery<Likes[]>({
    queryKey: ["admin"],
    queryFn: allLikes,
  });

  const { data: users } = useQuery<number | undefined>({
    queryKey: ["user-count"],
    queryFn: getUserCount,
  });

  const { data: reports } = useQuery<number>({
    queryKey: ["report-count"],
    queryFn: reportCount,
  });

  const { data: blogs } = useQuery<number | undefined>({
    queryKey: ["blog-count"],
    queryFn: apiRes,
  });

  return (
    <main className="flex flex-col gap-2 px-6 py-2 dark:bg-gray-950">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <AdminCard
          title="Total Users"
          total={users || 0}
          icon={
            <UserOutlined className="rounded-lg bg-blue-400/30 p-2.5 text-xl text-blue-600!" />
          }
        />

        <AdminCard
          title="Total Blogs"
          total={blogs}
          icon={
            <FileTextOutlined className="rounded-lg bg-green-400/30 p-2.5 text-xl text-green-600!" />
          }
        />

        <AdminCard
          title="Likes"
          total={likes?.length || 0}
          icon={
            <LikeOutlined className="rounded-lg bg-yellow-400/30 p-2.5 text-xl text-yellow-600!" />
          }
        />

        <AdminCard
          title="Reports"
          total={reports || 0}
          icon={
            <WarningOutlined className="rounded-lg bg-red-400/30 p-2.5 text-xl text-red-600!" />
          }
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row"></div>
    </main>
  );
};

export default Dashboard;