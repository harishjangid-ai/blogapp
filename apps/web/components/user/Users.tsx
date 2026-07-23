"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Modal, Avatar } from "antd";
import Chat from "../ui/Chat";
import { SelectedUser, User } from "../../types/userType";
import { useAppSelector } from "@/redux/store/hooks";
import { usePresence } from "../../hooks/usePresence";
import CreateGroup from "../ui/CreateGroup";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSelUser, getUsers } from "@/services/users";
import GroupDetails from "../ui/GroupDetails";
import UserDetails from "../ui/UserDetails";
import { useDebounce } from "@/hooks/useDebounce";
import IAvatar from "../ui/IAvatar";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [group, setGroup] = useState<boolean>(false);
  const [groupDetail, setGroupDetail] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { getUserStatus, getStatusColor } = usePresence(user?._id);

  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user", userId],
    queryFn: () => getSelUser({ userId }),
    enabled: !!userId,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users", debouncedSearch],
      queryFn: ({ pageParam = 1 }) =>
        getUsers({
          page: pageParam,
          limit: 20,
          search: debouncedSearch,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    });

  const users: User[] = data?.pages.flatMap((page) => page.users) || [];
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);
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

  const closeChat = () => {
    setOpen(false);
    setId("");
    setUserId("");
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

  const close = () => {
    setGroupDetail(false);
    setOpen(false);
    setId("");
    setUserId("");
  };

  return (
    <>
      <div className="flex w-full gap-2 h-[calc(100vh-55px)] overflow-hidden">
        <div
          className={`${open ? "hidden md:flex" : "flex"} flex-col w-full md:w-[30%] lg:w-[20%] bg-white p-4 gap-5 h-full overflow-hidden dark:bg-gray-900 dark:border-r dark:border-gray-700`}
        >
          <div className="flex justify-between">
            <h1 className="text-gray-400 dark:text-white">Welcome, {user?.fullName}</h1>
            <button
              className="flex gap-1 w-fit self-end text-xs border border-gray-300 rounded bg-gray-400/20 hover:bg-gray-500/20 p-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={openCreateGroup}
            >
              <PlusOutlined />
              <span className=" hidden md:flex">New Group</span>
            </button>
          </div>
          <div className="flex">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9_ ]/g, "");
                setSearch(value);
              }}
              className="border border-gray-200! dark:bg-gray-800! dark:border-gray-600! dark:text-white! dark:placeholder:text-white!"
            />
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded-lg flex flex-col gap-2 dark:bg-gray-800">
            {users?.map((user) => (
              <div
                className={`w-full p-1 rounded-lg flex items-center gap-2 ${
                  userId == user._id
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200 duration-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
                key={user._id}
                onClick={() =>
                  handleChatOpen({ id: user.chatId, userId: user._id })
                }
              >
                <p className="relative">
                  {!user.image ? (
                    <p className="bg-gray-300/30 px-2 py-1 text-black! rounded-full text-xl relative dark:bg-gray-700 dark:text-gray-200!">
                    {user.isGroup ? (<UsergroupAddOutlined />) : (<UserOutlined />)}
                      </p>
                  ) : (
                    <IAvatar
                      size={34}
                      src={user.image || undefined}
                    />
                  )}
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
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-light text-gray-900 dark:text-gray-100">
                    {user.isGroup ? user.groupName : user.fullName}
                  </h2>

                  {(user.unreadCount ?? 0) > 0 && (
                    <span
                      className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full"
                      title={`${user.unreadCount} unread messages`}
                    >
                      {(user.unreadCount ?? 0) > 9 ? "9+" : user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div
              ref={loaderRef}
              className="h-10 flex justify-center items-center"
            >
              {isFetchingNextPage && <p>Loading...</p>}
            </div>
          </div>
        </div>
        {open ? (
          <main className="flex flex-col w-full md:w-[70%] lg:w-[80%] gap-2 h-full overflow-hidden">
            <nav className="bg-white dark:bg-gray-900 flex mt-1 rounded-s-2xl px-1 py-1 items-center gap-3 border-b border-gray-200 dark:border-gray-700">
              <ArrowLeftOutlined
                className="cursor-pointer hover:bg-gray-300/30 dark:hover:bg-gray-700 p-2.5 rounded-full text-gray-500/50! dark:text-gray-300! duration-200"
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
                {!selectedUser?.image ? (
                  <p className="bg-gray-300/30 px-2 py-1 text-black! rounded-full text-xl relative dark:bg-gray-700 dark:text-gray-200!">
                    {selectedUser?.isGroup ? (<UsergroupAddOutlined />) : (<UserOutlined />)}
                      </p>
                  ) : (
                    <Avatar
                      size={34}
                      src={selectedUser?.image || undefined}
                      icon={selectedUser?.image && <UserOutlined />}
                    />
                  )}
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
                <h1 className="text-lg text-gray-900 dark:text-gray-100">
                  {selectedUser?.isGroup
                    ? selectedUser.groupName
                    : selectedUser?.fullName}{" "}
                  <span
                    className={
                      selectedUser?.isGroup
                        ? "hidden"
                        : "self-end font-thin text-xs text-gray-500 dark:text-gray-400"
                    }
                  >
                    ({selectedUser?.userName})
                  </span>
                </h1>
              </div>
            </nav>
            <div className="flex-1 overflow-hidden">
              <Chat chatId={id} receiverId={userId} />
            </div>
          </main>
        ) : (
          <div className="hidden sm:w-[70%] lg:w-[80%] sm:flex items-center justify-center">
            <h2 className="text-lg text-gray-500 dark:text-gray-400">
              Select a user to start chatting...
            </h2>
          </div>
        )}
      </div>
      {group && (
        <Modal
          open={group}
          footer={null}
          onCancel={() => setGroup(false)}
          centered
          destroyOnClose
          width={440}
          styles={{
            body: {
              padding: "12px",
              maxHeight: "75vh",
              overflow: "hidden",
            },
          }}
        >
          <CreateGroup close={closeCreateGroup} />
        </Modal>
      )}
      {groupDetail && (
        <Modal
          open={groupDetail}
          footer={false}
          onCancel={() => setGroupDetail(false)}
        >
          <GroupDetails id={userId} close={close} />
        </Modal>
      )}
      {userDetail && (
        <Modal
          open={userDetail}
          footer={false}
          onCancel={() => setUserDetail(false)}
        >
          <UserDetails id={userId} />
        </Modal>
      )}
    </>
  );
};

export default Users;
