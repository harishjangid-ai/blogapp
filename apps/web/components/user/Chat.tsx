"use client";

import { chatUsers } from "@/services/users";
import { User } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Button, Input } from "antd";
import { useMemo, useState } from "react";
import { PlusOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const Chat = () => {
  const [search, setSearch] = useState<string>("");
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: chatUsers,
  });

  const dispatch = useAppDispatch();
  const chatPreview = useAppSelector(c=>c.chat.chatPreview);


  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users?.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) || u.userName.toLowerCase().includes(q) || u.phone.includes(q),
    );
  }, [users, search]);
  const handleChat = ()=>{
    
  }
  return (
    <div className="flex w-full">
      <div className="w-[20%] min-h-screen bg-gray-200 p-3 flex flex-col gap-5">
        <Button type={"default"} className="w-fit self-end"><PlusOutlined /> New Group</Button>
        <Input placeholder="Search user with name, username, phone....." onChange={(e)=>setSearch(e.target.value)}/>
        <div className="flex flex-col gap-1">
          {filteredUsers?.map((user)=>(
            <div className="border border-gray-400/20 rounded-2xl bg-gray-100 p-2 flex w-full gap-4" key={user._id}>
              <div className="flex justify-center items-center">
                <span className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.fullName.split(" ").map(w=> w[0].toUpperCase()).join("")}
                </span>
              </div>
              <div className="flex flex-col">
                <h1>{user.fullName}</h1>
                <p>@{user.userName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[80%] min-h-screen bg-gray-50 p-3">Chat dashboard </div>
    </div>
  );
};

export default Chat;
