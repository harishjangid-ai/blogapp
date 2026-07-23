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
import { Button, Modal, notification, Popconfirm, Tag } from "antd";
import {
  DeleteOutlined,
  LogoutOutlined,
  PlusOutlined,
  CrownFilled,
  EditOutlined,
} from "@ant-design/icons";
import AddUsers from "./AddUsers";
import EditGroupDetails from "./EditGroupDetails";
import IAvatar from "./IAvatar";

const GroupDetails = ({
  id,
  close,
}: {
  id: string | undefined;
  close: () => void;
}) => {
  const [addUsers, setAddUsers] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
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

  const removeUserFromGroup = ({ userId }: { userId: string | undefined }) => {
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

  const handleSwitchAdmin = ({ newAdminId }: { newAdminId: string }) => {
    switchUserToAdminMutation.mutate({
      newAdminId,
      groupId: selectedUser?._id,
    });
  };
  if (
    selectedUser === undefined ||
    selectedUser === null ||
    selectedUser.chat === undefined
  )
    return null;
  return (
    <>
      <div className="rounded-2xl bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center border-b border-gray-200 dark:border-gray-700 pb-6">
          <IAvatar size={88} src={selectedUser?.image || undefined} />

          <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {selectedUser?.groupName}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedUser?.chat.members?.length || 0} Members
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Members
          </h2>

          {selectedUser?.creator._id === yourId && (
            <div className="flex gap-2">
              <Button
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
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
              className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm transition hover:shadow-md dark:hover:bg-gray-800"
            >
              <IAvatar size={52} src={user.image} />

              <div className="flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-gray-800 dark:text-gray-100">
                    {user.fullName}
                  </h3>

                  {user._id === yourId && (
                    <Tag color="blue" variant="filled">
                      You
                    </Tag>
                  )}

                  {selectedUser?.creator._id === user._id && (
                    <Tag color="gold" variant="filled" icon={<CrownFilled />}>
                      Admin
                    </Tag>
                  )}
                </div>
              </div>

              {user._id !== yourId && selectedUser?.creator._id === yourId && (
                <Button
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
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
                    <Button danger shape="circle" icon={<DeleteOutlined />} />
                  </Popconfirm>
                )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-5">
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
    </>
  );
};

export default GroupDetails;
