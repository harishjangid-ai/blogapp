"use client";
import { getSelUser } from "@/services/users";
import { SelectedUser } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Modal, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import ImagePreview from "./ImagePreview";

const UserDetails = ({ id }: { id: string | undefined }) => {
  const [imagePreview, setImagePreview] = useState<boolean>(false);

  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user"],
    queryFn: () => getSelUser({ userId: id }),
    enabled: !!id,
  });
  return (
    <>
      <div>
      <div className="flex flex-col gap-2">
        {selectedUser?.image === "" ? (
          <UserOutlined />
        ) : (
          <Avatar
            size={96}
            src={selectedUser?.image || undefined}
            icon={selectedUser?.image && <UserOutlined />}
            onClick={
              selectedUser?.image
                ? () => setImagePreview(true)
                : () => notification.warning({ title: "Nothing to see." })
            }
          />
        )}
        <h1 className="text-xl">Name: {selectedUser?.fullName}</h1>
        <h2>User Name: {selectedUser?.userName}</h2>
        <h2>Contact Info: {selectedUser?.phone}</h2>
      </div>
    </div>
    <Modal
        open={imagePreview}
        footer={false}
        centered
        onCancel={() => setImagePreview(false)}
      >
        <ImagePreview imageUrl={selectedUser?.image}/>
      </Modal>
    </>
  );
};

export default UserDetails;
