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
        <div className="flex flex-col gap-2 dark:text-gray-100">
          {selectedUser?.image === "" ? (
            <UserOutlined className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Avatar
              size={96}
              src={selectedUser?.image || undefined}
              icon={selectedUser?.image && <UserOutlined />}
              className="ring-2 ring-white dark:ring-gray-700"
              onClick={
                selectedUser?.image
                  ? () => setImagePreview(true)
                  : () => notification.warning({ title: "Nothing to see." })
              }
            />
          )}

          <h1 className="text-xl text-gray-900 dark:text-gray-100">
            Name: {selectedUser?.fullName}
          </h1>

          <h2 className="text-gray-700 dark:text-gray-300">
            User Name: {selectedUser?.userName}
          </h2>

          <h2 className="text-gray-700 dark:text-gray-300">
            Contact Info: {selectedUser?.phone}
          </h2>
        </div>
      </div>

      <Modal
        open={imagePreview}
        footer={false}
        centered
        onCancel={() => setImagePreview(false)}
      >
        <ImagePreview imageUrl={selectedUser?.image} />
      </Modal>
    </>
  );
};

export default UserDetails;