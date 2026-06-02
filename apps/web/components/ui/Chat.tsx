"use client";

import { api } from "@/utils/api";
import { SendOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../types/chatType";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/redux/store/hooks";
import { useSocket } from "../../hooks/useSocket";
import { joinChat, registerUser } from "../../services/socketMethods";
const Chat = ({ id, getUsers }: { id: string | undefined, getUsers: () => void }) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string>("");

  const socketRef = useSocket();

  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const userId = useAppSelector((state) => state.auth.user?._id);

  const getMyChat = async () => {
    const res = await api.get(`/my-chat/${id}`, { withCredentials: true });
    const data = res.data;
    setChat(Array.isArray(data) ? data : []);

    if (data.length) {
      setChatId(data[0].chatId);
    }
  };

  useEffect(() => {
    if (!chat.length || !virtuosoRef.current) return;
    virtuosoRef.current?.scrollToIndex({
      index: chat.length - 1,
      align: "end",
      behavior: "smooth",
    });

    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: chat.length - 1,
        align: "end",
        behavior: "smooth",
      });
    }, 100);
  }, [chat]);

  useEffect(() => {
    getMyChat();
  }, [id]);

  const sendMessage = (e: any) => {
    e.preventDefault();

    const msg = newMessage;
    if (!msg) return message.error("Please type message");
    
    socketRef.current?.emit("send_message", {
      message: msg,
      receiverId: id,
      senderId: userId,
    });
    getUsers();
    setNewMessage("");
  };

  useEffect(() => {
    if (!socketRef.current?.connected || !userId) return;
    registerUser({socket: socketRef.current, userId})
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleChatCreated = (newChatId: string) => {
      setChatId(newChatId);
      socketRef.current?.emit("join_chat", newChatId);
    };

    const handleReceiveMessage = (msg: Message) => {
      setChat((prev) => [...prev, msg]);
      getUsers();
    };
    getUsers();
    socketRef.current.on("chat_created", handleChatCreated);
    socketRef.current.on("receive_message", handleReceiveMessage);

    return () => {
      socketRef.current?.off("chat_created", handleChatCreated);
      socketRef.current?.off("receive_message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    joinChat({socket: socketRef.current, chatId})
  }, [chatId]);

  const formatTime = (isoTime: string | number | Date) => {
    return new Date(isoTime).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col justify-between p-4 bg-white h-full rounded-s-2xl">
      {chat.length ? (
        <Virtuoso
          ref={virtuosoRef}
          data={chat}
          style={{ height: "78vh" }}
          followOutput={false}
          itemContent={(_, data) => (
            <div
              className={`flex ${
                data?.senderId === userId ? "justify-end" : "justify-start"
              } mb-0.5 gap-2`}
            >
              <div
                className={`max-w-[49%] border gap-4 py-0.5 px-2 rounded-md ${
                  data?.senderId === userId
                    ? "bg-blue-300/30 border-blue-300/50"
                    : "bg-gray-300/30 border-gray-300/50"
                }`}
              >
                <h2 className="text-md wrap-break-word">{data?.message}</h2>
                <span className="text-[10px] font-thin block text-right">
                  {formatTime(data?.createdAt)}
                </span>
              </div>
            </div>
          )}
          components={{Footer: ()=>(<div className="h-6"></div>)}}
        />
      ) : (
        <div className="flex items-center justify-center">
          <h2 className="text-xl">Start your conversation...</h2>
        </div>
      )}

      <Form className="flex gap-2" onSubmitCapture={sendMessage}>
        <Input
          type="text"
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          htmlType="submit"
          icon={<SendOutlined />}
          disabled={newMessage.trim() === "" ? true : false}
        />
      </Form>
    </div>
  );
};

export default Chat;
