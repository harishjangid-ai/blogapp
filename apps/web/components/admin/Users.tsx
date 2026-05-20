"use client";

import UserCard from "../ui/UserCard";
import UserTable from "../ui/UserTable";

const Users = () => {
  return (
    <main className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UserCard title="Total Users" total={7} />
        <UserCard title="Admins" total={1} />
        <UserCard title="Writers" total={5} />
        <UserCard title="Readers" total={1} />
      </div>
      <UserTable />
    </main>
  );
};

export default Users;
