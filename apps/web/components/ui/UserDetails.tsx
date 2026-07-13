"use client";
import { getSelUser } from "@/services/users";
import { SelectedUser } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserDetails = ({ id }: { id: string | undefined }) => {
  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user"],
    queryFn: () => getSelUser({ userId: id }),
    enabled: !!id,
  });
  return (
    <div>
      <div className="flex flex-col gap-2">
        
        {selectedUser?.image === "" ? (
          <UserOutlined />
        ) : (
          <Avatar size={96} src={selectedUser?.image || undefined} icon={selectedUser?.image && <UserOutlined />} />
          )}
        <h1 className="text-xl">Name: {selectedUser?.fullName}</h1>
        <h2>User Name: {selectedUser?.userName}</h2>
        <h2>Contact Info: {selectedUser?.phone}</h2>
      </div>
    </div>
  );
};

export default UserDetails;
