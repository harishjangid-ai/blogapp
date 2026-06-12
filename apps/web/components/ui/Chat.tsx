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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyChat } from "@/services/chat";

const Chat = ({
  chatId,
  receiverId,
}: {
  chatId: string | undefined;
  receiverId: string | undefined;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  const socketRef = useSocket();
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  const userId = useAppSelector((state) => state.auth.user?._id);

  const { data: chat } = useQuery<Message[]>({
    queryKey: ["my-chat"],
    queryFn: () => getMyChat({ chatId }),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["my-chat"] });
  }, [chatId]);

  useEffect(() => {
    if (!chat?.length || !virtuosoRef.current) return;

    virtuosoRef.current.scrollToIndex({
      index: chat.length - 1,
      align: "end",
      behavior: "smooth",
    });

    const timer = setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: chat.length - 1,
        align: "end",
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [chat]);

  const sendMessage = (e: any) => {
    e.preventDefault();

    const msg = newMessage.trim();

    if (!msg) {
      return message.error("Please type message");
    }

    if (chatId) {
      socketRef.current?.emit("send_message", {
        chatId,
        senderId: userId,
        message: msg,
      });
    } else {
      socketRef.current?.emit("send_message", {
        receiverId,
        senderId: userId,
        message: msg,
      });
    }

    setNewMessage("");
    queryClient.invalidateQueries({queryKey: ['my-chat']});
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  useEffect(() => {
    if (!socketRef.current?.connected || !userId) return;

    registerUser({
      socket: socketRef.current,
      userId,
    });
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current) return;
    const handleReceiveMessage = (msg: Message) => {
      if (chatId && msg.chatId !== chatId) return;
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["my-chat"] });
    };

    socketRef.current.on("receive_message", handleReceiveMessage);

    return () => {
      socketRef.current?.off("receive_message", handleReceiveMessage);
    };
  }, [chatId]);
  useEffect(() => {
    if (!socketRef.current) return;

    const handleChatCreated = (newChatId: string) => {
      joinChat({
        socket: socketRef.current,
        chatId: newChatId,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    socketRef.current.on("chat_created", handleChatCreated);

    return () => {
      socketRef.current?.off("chat_created", handleChatCreated);
    };
  }, []);

  useEffect(() => {
    if (!chatId) return;

    joinChat({
      socket: socketRef.current,
      chatId,
    });
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
      {chat?.length ? (
        <Virtuoso
          ref={virtuosoRef}
          data={chat}
          style={{ height: "75vh" }}
          followOutput={false}
          itemContent={(_, data) => (
            <div
              className={`flex flex-col ${
                data.sender._id === userId ? "items-end" : "items-start"
              } mb-1`}
            >
              <div
                className={`max-w-[49%] flex border gap-4 items-center px-1 rounded-md ${
                  data.sender._id === userId
                    ? "bg-blue-300/30 border-blue-300/50"
                    : "bg-gray-300/30 border-gray-300/50"
                }`}
              >
                <h1 className="bg-gray-300/30 h-9 w-9 flex items-center justify-center text-black rounded-full text-xl">
                  {data.sender.fullName
                    .split(" ")
                    .map((w) => w[0].toUpperCase())
                    .join("")}
                </h1>
                <div className="">
                  <h2 className="text-md wrap-break-word">{data.message}</h2>

                  <span className="text-[10px] font-thin block text-right">
                    {formatTime(data.createdAt)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[8px]">
                  {data.sender._id === userId ? "you" : data.sender.userName}
                </p>
              </div>
            </div>
          )}
          components={{ Footer: () => <div className="h-10"></div> }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-xl">Start your conversation...</h2>
        </div>
      )}

      <Form className="flex gap-2" onSubmitCapture={sendMessage}>
        <Input
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <Button
          htmlType="submit"
          icon={<SendOutlined />}
          disabled={!newMessage.trim()}
        />
      </Form>
    </div>
  );
};

export default Chat;
