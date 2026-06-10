"use client";
import { useAppSelector } from "@/redux/store/hooks";
import { getSelUser } from "@/services/users";
import { SelectedUser } from "@/types/userType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, notification, Popconfirm } from "antd";
import { DeleteOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { deleteGroup, exitGroup, removeUser } from "@/services/chat";
import { useState } from "react";
import AddUsers from "./AddUsers";
const GroupDetails = ({
  id,
  close,
}: {
  id: string | undefined;
  close: () => void;
}) => {
  const [addUsers, setAddUsers] = useState<boolean>(false)
  const queryClient = useQueryClient();
  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user"],
    queryFn: () => getSelUser({ userId: id }),
    enabled: !!id,
  });
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
      return notification.success({ message: data.message || "Deleted" });
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
      return notification.success({ message: data.message || "User removed" });
    },
    onError: (error) => {
      notification.error({ message: "Failed to remove user" });
      console.log(error);
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
      return notification.success({ message: data.message || "Exited group" });
    },
    onError: (error) => {
      notification.error({ message: "Failed to exit group" });
      console.log(error);
    },
  });
  const handleDeleteGroup = () => {
    deleteGroupMutation.mutate({ groupId: selectedUser?._id });
  };
  const removeUserFromGroup = ({ userId }: { userId: string | undefined }) => {
    removeUserMutation.mutate({ chatId: selectedUser?.chat._id, userId });
  };
  const hanndleExitGroup = () => {
    exitGroupMutation.mutate({ chatId: selectedUser?.chat._id });
  };
  const handleAddUsers = ()=>{
    setAddUsers(true);
  }
  const yourId = useAppSelector((u) => u.auth.user?._id);
  return (
    <>
      <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl">{selectedUser?.groupName}</h1>
        <div className="flex w-full justify-between">
          <h2>Members</h2>
          <Button className="border hover:border-blue-500! border-blue-400! hover:text-blue-500! text-blue-400!" onClick={handleAddUsers}>
            Add Users <PlusOutlined />
          </Button>
        </div>
        <div className="flex flex-col gap-2 border rounded-xl p-2">
          {selectedUser?.chat.members?.map((user) => (
            <div
              className="w-full p-1 rounded-lg flex items-center gap-2 bg-gray-100 hover:bg-gray-200 duration-300"
              key={user._id}
            >
              <div className="flex w-full p-1 rounded-lg items-center gap-2">
                <p className="bg-gray-300/30 px-3 text-black py-1 rounded-full text-xl relative">
                  {user.fullName?.charAt(0).toUpperCase()}
                </p>
                <div className="flex flex-col">
                  <h2 className="font-light flex">
                    {user.fullName}
                    <span className={yourId === user._id ? "flex" : "hidden"}>
                      (you)
                    </span>
                  </h2>
                  <span
                    className={
                      selectedUser?.creator._id === user._id ? "flex" : "hidden"
                    }
                  >
                    (admin)
                  </span>
                </div>
              </div>
              <div
                className={
                  selectedUser?.creator._id === yourId &&
                  selectedUser?.creator._id !== user._id
                    ? "flex"
                    : "hidden"
                }
              >
                <Popconfirm
                  title="Remove member"
                  description={`Remove ${user.fullName} from this group?`}
                  okText="Remove"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => removeUserFromGroup({ userId: user._id })}
                >
                  <Button
                    className="border hover:border-red-500! border-red-400! hover:text-red-500! text-red-400!"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-between">
          <Popconfirm
            title="Exit group"
            description="Are you sure you want to leave this group?"
            okText="Exit"
            cancelText="Stay"
            okButtonProps={{ danger: true }}
            onConfirm={hanndleExitGroup}
          >
            <Button className="border hover:border-red-500! border-red-400! hover:text-red-500! text-red-400!">
              Exit <LogoutOutlined />
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Delete group"
            description="This action cannot be undone. Delete this group permanently?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={handleDeleteGroup}
          >
            <Button
              className={
                selectedUser?.creator._id === yourId
                  ? "border hover:border-red-500! border-red-400! hover:text-red-500! text-red-400!"
                  : "hidden!"
              }
            >
              Delete Group <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
    {addUsers && (
      <Modal open={addUsers} onCancel={()=>setAddUsers(false)} footer={false}>
        <AddUsers chatId={selectedUser?.chat._id} close={()=> setAddUsers(false)}/>
      </Modal>
    )}
    </>
  );
};
export default GroupDetails;
