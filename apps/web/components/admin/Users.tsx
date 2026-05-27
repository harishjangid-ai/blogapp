"use client";

import { useQuery } from "@tanstack/react-query";
import UserCard from "../ui/UserCard";
import UserTable from "../ui/UserTable";
import { User } from "@/types/userType";
import { Spin } from "antd";
import { fetchUsers } from "@/services/users";

const Users = () => {
 

  const { data: user, isLoading } = useQuery<User[]>({
    queryKey: ["user"],
    queryFn: fetchUsers,
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
          total={0}
        />
        {/* <UserCard title="Admins" total={0} />
        <UserCard title="users" total={user?.length} /> */}
      </div>
      <UserTable />
    </main>
  );
};

export default Users;
