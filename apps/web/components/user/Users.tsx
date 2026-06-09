"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Modal } from "antd";
import Chat from "../ui/Chat";
import { SelectedUser, User } from "../../types/userType";
import { useAppSelector } from "@/redux/store/hooks";
import { usePresence } from "../../hooks/usePresence";
import CreateGroup from "../ui/CreateGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSelUser, getUsers } from "@/services/users";
import GroupDetails from "../ui/GroupDetails";
import UserDetails from "../ui/UserDetails";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const [group, setGroup] = useState<boolean>(false);
  const [groupDetail, setGroupDetail] = useState<boolean>(false)
  const [userDetail, setUserDetail] = useState<boolean>(false)
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const { getUserStatus, getStatusColor } = usePresence(user?._id);

  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user"],
    queryFn: () => getSelUser({ userId }),
    enabled: !!userId,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const handleChatOpen = ({
    id,
    userId,
  }: {
    id: string | undefined;
    userId: string | undefined;
  }) => {
    setUserId(userId);
    setId(id);
    setOpen(true);
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["selected-user"] });
  }, [userId, id]);

  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users;
    return users?.filter(
      (user) =>
        user.fullName.toLowerCase().includes(s) ||
        user.userName.toLowerCase().includes(s),
    );
  }, [search, users]);

  const closeChat = () => {
    setOpen(false);
    setId("");
    setUserId("")
  };

  const openCreateGroup = () => {
    setGroup(true);
  };

  const closeCreateGroup = () => {
    setGroup(false);
  };

  const groupDetails = () => {
    setGroupDetail(true);
    setUserDetail(false);
  };

  const userDetails = () => {
    setUserDetail(true);
    setGroupDetail(false);
  };

  const close = ()=>{
    setGroupDetail(false);
    setOpen(false);
    setId("");
    setUserId("");
  }

  return (
    <>
      <div className="flex w-full gap-2 min-h-[calc(100vh-55px)]">
        <div className="w-full sm:w-[30%] lg:w-[20%] bg-white flex flex-col p-4 gap-5">
          <div className="flex justify-between">
            <h1>Welcome, {user?.fullName}</h1>
            <button
              className="flex gap-1 w-fit self-end text-xs border border-gray-300 rounded bg-gray-400/20 hover:bg-gray-500/20 p-1"
              onClick={openCreateGroup}
            >
              <PlusOutlined />
              <span className=" hidden md:flex">New Group</span>
            </button>
          </div>
          <div className="flex">
            <Input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200!"
            />
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto h-[90%] bg-gray-100 p-2 rounded-lg">
            {filteredUsers?.map((user) => (
              <div
                className={`w-full p-1 rounded-lg flex items-center gap-2 ${userId == user._id ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200 duration-300"}`}
                key={user._id}
                onClick={() =>
                  handleChatOpen({ id: user.chatId, userId: user._id })
                }
                title={getUserStatus(user._id)}
              >
                <p className="bg-gray-300/30 px-3 text-black py-1 rounded-full text-xl relative">
                  {user.isGroup
                    ? user.groupName?.charAt(0).toUpperCase()
                    : user.fullName?.charAt(0).toUpperCase()}
                  <span
                    className={
                      user.isGroup
                        ? "hidden"
                        : `p-1 absolute rounded-full bottom-0.5 right-0.5 ${getStatusColor(
                            user._id,
                          )}`
                    }
                  />
                </p>
                <h2 className="font-light">
                  {user.isGroup ? user.groupName : user.fullName}
                </h2>
              </div>
            ))}
          </div>
        </div>
        {open ? (
          <main
            className="hidden sm:flex sm:flex-col sm:w-[70%] lg:w-[80%] gap-2"
          >
            <nav className="bg-white flex mt-1 rounded-s-2xl px-1 py-1 items-center gap-3 border-b">
              <ArrowLeftOutlined
                className="cursor-pointer hover:bg-gray-300/30 p-2.5 rounded-full text-gray-500/50! duration-200"
                onClick={closeChat}
              />
              <div
                className="flex items-center gap-2 relative cursor-pointer"
                title={
                  selectedUser?.isGroup
                    ? ""
                    : selectedUser?._id
                      ? getUserStatus(selectedUser._id)
                      : "offline"
                }
                onClick={selectedUser?.isGroup ? groupDetails : userDetails}
              >
                <UserOutlined className="bg-gray-300/30 p-2.5 rounded-full text-gray-500/50!" />
                <span
                  className={
                    selectedUser?.isGroup
                      ? "hidden"
                      : `p-1 absolute rounded-full bottom-0.5 left-6.5 ${
                          selectedUser?._id
                            ? getStatusColor(selectedUser._id)
                            : "bg-red-600"
                        }`
                  }
                />
                <h1 className="text-lg">
                  {selectedUser?.isGroup
                    ? selectedUser.groupName
                    : selectedUser?.fullName}{" "}
                  <span
                    className={
                      selectedUser?.isGroup
                        ? "hidden"
                        : "self-end font-thin text-xs"
                    }
                  >
                    ({selectedUser?.userName})
                  </span>
                </h1>
              </div>
            </nav>
            <Chat chatId={id} receiverId={userId} />
          </main>
        ) : (
          <div className="hidden sm:w-[70%] lg:w-[80%] sm:flex items-center justify-center">
            <h2 className="text-lg text-gray-500">
              Select a user to start chatting...
            </h2>
          </div>
        )}
      </div>
      {group && (
        <Modal open={group} footer={false} onCancel={() => setGroup(false)}>
          <CreateGroup close={closeCreateGroup} />
        </Modal>
      )}
      {groupDetail && (
        <Modal open={groupDetail} footer={false} onCancel={() => setGroupDetail(false)}>
          <GroupDetails id={userId} close={close}/>
        </Modal>
      )}
      {userDetail && (
        <Modal open={userDetail} footer={false} onCancel={() => setUserDetail(false)}>
          <UserDetails id={userId}/>
        </Modal>
      )}
    </>
  );
};

export default Users;
