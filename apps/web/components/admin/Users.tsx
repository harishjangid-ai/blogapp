"use client";

import { useQuery } from "@tanstack/react-query";
import UserCard from "../ui/UserCard";
import UserTable from "../ui/UserTable";
import { admins, readers, writers } from "@/services/users";
import { User } from "@/types/userType";
import { Spin } from "antd";

const Users = () => {
  const { data: admin, isLoading } = useQuery<User[]>({
    queryKey: ["admin"],
    queryFn: admins,
  });

  const { data: writer } = useQuery<User[]>({
    queryKey: ["writer"],
    queryFn: writers,
  });

  const { data: reader } = useQuery<User[]>({
    queryKey: ["reader"],
    queryFn: readers,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  return (
    <main className="flex flex-col gap-2 px-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UserCard
          title="Total Users"
          total={
            (admin?.length || 0) + (writer?.length || 0) + (reader?.length || 0)
          }
        />
        <UserCard title="Admins" total={admin?.length} />
        <UserCard title="Writers" total={writer?.length} />
        <UserCard title="Readers" total={reader?.length} />
      </div>
      <UserTable />
    </main>
  );
};

export default Users;
