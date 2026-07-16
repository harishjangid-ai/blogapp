"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store/hooks";
import { getSelUser } from "@/services/users";
import { SelectedUser } from "@/types/userType";
import {
  deleteGroup,
  exitGroup,
  removeUser,
  switchAdmin,
} from "@/services/chat";
import {
  Avatar,
  Button,
  Modal,
  notification,
  Popconfirm,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
  CrownFilled,
  EditOutlined,
} from "@ant-design/icons";
import AddUsers from "./AddUsers";
import EditGroupDetails from "./EditGroupDetails";
import ImagePreview from "./ImagePreview";

const GroupDetails = ({
  id,
  close,
}: {
  id: string | undefined;
  close: () => void;
}) => {
  const [addUsers, setAddUsers] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [imagePreview, setImagePreview] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user"],
    queryFn: () => getSelUser({ userId: id }),
    enabled: !!id,
  });

  const yourId = useAppSelector((u) => u.auth.user?._id);

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Failed to delete group",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["selected-user"] });

      close();

      notification.success({
        message: data.message || "Deleted",
      });
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: removeUser,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Failed to remove user",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["selected-user"] });

      notification.success({
        message: data.message || "User removed",
      });
    },
    onError: () => {
      notification.error({
        message: "Failed to remove user",
      });
    },
  });

  const exitGroupMutation = useMutation({
    mutationFn: exitGroup,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Failed to exit group",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["selected-user"] });

      close();

      notification.success({
        message: data.message || "Exited group",
      });
    },
    onError: () => {
      notification.error({
        message: "Failed to exit group",
      });
    },
  });

  const switchUserToAdminMutation = useMutation({
    mutationFn: switchAdmin,
    onSuccess: (data) => {
      if (!data.success) {
        return notification.error({
          message: data.error || "Failed to switch admin",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["selected-user"] });

      notification.success({
        message: data.message || "Admin switched",
      });
    },
    onError: () => {
      notification.error({
        message: "Failed to switch admin",
      });
    },
  });

  const handleDeleteGroup = () => {
    deleteGroupMutation.mutate({
      groupId: selectedUser?._id,
    });
  };

  const removeUserFromGroup = ({
    userId,
  }: {
    userId: string | undefined;
  }) => {
    removeUserMutation.mutate({
      chatId: selectedUser?.chat._id,
      userId,
    });
  };

  const handleExitGroup = () => {
    exitGroupMutation.mutate({
      chatId: selectedUser?.chat._id,
    });
  };

  const handleSwitchAdmin = ({
    newAdminId,
  }: {
    newAdminId: string;
  }) => {
    switchUserToAdminMutation.mutate({
      newAdminId,
      groupId: selectedUser?._id,
    });
  };

  return (
    <>
      <div className="rounded-2xl bg-white">
        <div className="flex flex-col items-center border-b pb-6">
          <Avatar
            size={88}
            src={selectedUser?.image || undefined}
            icon={<UserOutlined />}
            className="shadow-lg ring-4 ring-blue-100"
            onClick={selectedUser?.image ? ()=> setImagePreview(true) : ()=> notification.warning({title: "Nothing to see."})}
          />

          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {selectedUser?.groupName}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {selectedUser?.chat.members?.length || 0} Members
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Members</h2>

          {selectedUser?.creator._id === yourId && (
            <div className="flex gap-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditGroup(true)}
              >
                Edit
              </Button>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="rounded-full"
                onClick={() => setAddUsers(true)}
              >
                Add Users
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 max-h-130 space-y-3 overflow-y-auto pr-1">
          {selectedUser?.chat.members?.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              {user.image ? (
                <Avatar
                  size={52}
                  src={user.image}
                  className="ring-2 ring-white shadow"
                />
              ) : (
                <Avatar
                  size={52}
                  className="bg-linear-to-r from-blue-500 to-indigo-600 font-semibold text-white"
                >
                  {user.fullName?.charAt(0).toUpperCase()}
                </Avatar>
              )}

              <div className="flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-gray-800">
                    {user.fullName}
                  </h3>

                  {user._id === yourId && (
                    <Tag color="blue" bordered={false}>
                      You
                    </Tag>
                  )}

                  {selectedUser?.creator._id === user._id && (
                    <Tag
                      color="gold"
                      bordered={false}
                      icon={<CrownFilled />}
                    >
                      Admin
                    </Tag>
                  )}
                </div>
              </div>

              {user._id !== yourId &&
                selectedUser?.creator._id === yourId && (
                  <Button
                    onClick={() =>
                      handleSwitchAdmin({
                        newAdminId: user._id,
                      })
                    }
                  >
                    Make Admin
                  </Button>
                )}

              {selectedUser?.creator._id === yourId &&
                selectedUser?.creator._id !== user._id && (
                  <Popconfirm
                    title="Remove member"
                    description={`Remove ${user.fullName} from this group?`}
                    okText="Remove"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() =>
                      removeUserFromGroup({
                        userId: user._id,
                      })
                    }
                  >
                    <Button
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t pt-5">
          {selectedUser?.creator._id !== yourId && (
            <Popconfirm
              title="Exit group"
              description="Are you sure you want to leave this group?"
              okText="Exit"
              cancelText="Stay"
              okButtonProps={{ danger: true }}
              onConfirm={handleExitGroup}
            >
              <Button danger icon={<LogoutOutlined />}>
                Exit Group
              </Button>
            </Popconfirm>
          )}

          {selectedUser?.creator._id === yourId && (
            <Popconfirm
              title="Delete group"
              description="This action cannot be undone."
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={handleDeleteGroup}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete Group
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      <Modal
        open={addUsers}
        footer={false}
        centered
        onCancel={() => setAddUsers(false)}
      >
        <AddUsers
          chatId={selectedUser?.chat._id}
          close={() => setAddUsers(false)}
        />
      </Modal>

      <Modal
        open={editGroup}
        footer={false}
        centered
        onCancel={() => setEditGroup(false)}
      >
        <EditGroupDetails
          groupId={selectedUser?._id}
          groupName={selectedUser?.groupName}
          image={selectedUser?.image}
          close={() => setEditGroup(false)}
        />
      </Modal>

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

export default GroupDetails;