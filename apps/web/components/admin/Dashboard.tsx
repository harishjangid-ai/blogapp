"use client";

import AdminCard from "@/components/ui/AdminCard";
import {
  EyeOutlined,
  FileTextOutlined,
  HighlightOutlined,
  RiseOutlined,
  UserAddOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import AdminCard2 from "../ui/AdminCard2";

const Dashboard = () => {
  return (
    <main className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard
          title="Total Users"
          total={100}
          icon={
            <UserOutlined className="bg-blue-400/30 text-blue-600! p-2.5 text-xl rounded-lg" />
          }
        />
        <AdminCard
          title="Total Blogs"
          total={50}
          icon={
            <FileTextOutlined className="bg-green-400/30 text-green-600! p-2.5 text-xl rounded-lg" />
          }
        />
        <AdminCard
          title="Writers"
          total={200}
          icon={
            <HighlightOutlined className="bg-purple-400/30 text-purple-600! p-2.5 text-xl rounded-lg" />
          }
        />
        <AdminCard
          title="Readers"
          total={100}
          icon={
            <EyeOutlined className="bg-orange-400/30 text-orange-600! p-2.5 text-xl rounded-lg" />
          }
        />
        <AdminCard
          title="Reports"
          total={50}
          icon={
            <WarningOutlined className="bg-red-400/30 text-red-600! p-2.5 text-xl rounded-lg" />
          }
        />
        <AdminCard
          title="Comments"
          total={200}
          icon={
            <UserAddOutlined className="bg-yellow-400/30 text-yellow-600! p-2.5 text-xl rounded-lg" />
          }
        />
      </div>
      <div className="flex md:flex-row flex-col gap-3">
        <AdminCard2 title="Platform Growth" icon={<RiseOutlined className="text-green-500!"/>} />
        <AdminCard2 title="Pending Writer Requests" icon={<UserAddOutlined className="text-orange-500!"/>} />
      </div>
    </main>
  );
};

export default Dashboard;
