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
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/userType";
import { admins, readers, writers } from "@/services/users";

const Dashboard = () => {
  const {data: admin} = useQuery<User[]>({
    queryKey: ['admin'],
    queryFn: admins
  })

  const {data: writer} = useQuery<User[]>({
    queryKey: ['writer'],
    queryFn: writers
  })
  
  const {data: reader} = useQuery<User[]>({
    queryKey: ['reader'],
    queryFn: readers
  })
  return (
    <main className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard
          title="Total Users"
          total={(admin?.length || 0) + (writer?.length || 0) + (reader?.length || 0)}
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
          total={writer?.length}
          icon={
            <HighlightOutlined className="bg-purple-400/30 text-purple-600! p-2.5 text-xl rounded-lg" />
          }
        />
        <AdminCard
          title="Readers"
          total={reader?.length}
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
