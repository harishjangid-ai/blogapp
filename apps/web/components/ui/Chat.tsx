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

const Chat = ({
  chatId,
  getUsers,
}: {
  chatId: string | undefined;
  getUsers: () => void;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);

  const socketRef = useSocket();
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  const userId = useAppSelector(
    (state) => state.auth.user?._id
  );

  const getMyChat = async () => {
    if (!chatId) {
      setChat([]);
      return;
    }

    const res = await api.get(
      `/my-chat/${chatId}`,
      {
        withCredentials: true,
      }
    );

    const data = res.data;

    setChat(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    getMyChat();
  }, [chatId]);

  useEffect(() => {
    if (!chat.length || !virtuosoRef.current)
      return;

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
      return message.error(
        "Please type message"
      );
    }

    if (!chatId) {
      return message.error(
        "No chat selected"
      );
    }

    socketRef.current?.emit(
      "send_message",
      {
        chatId,
        senderId: userId,
        message: msg,
      }
    );

    setNewMessage("");
    getUsers();
  };

  useEffect(() => {
    if (
      !socketRef.current?.connected ||
      !userId
    )
      return;

    registerUser({
      socket: socketRef.current,
      userId,
    });
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceiveMessage = (
      msg: Message
    ) => {
      if (msg.chatId !== chatId) return;

      setChat((prev) => [...prev, msg]);
      getUsers();
    };

    socketRef.current.on(
      "receive_message",
      handleReceiveMessage
    );

    return () => {
      socketRef.current?.off(
        "receive_message",
        handleReceiveMessage
      );
    };
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    joinChat({
      socket: socketRef.current,
      chatId,
    });
  }, [chatId]);

  const formatTime = (
    isoTime: string | number | Date
  ) => {
    return new Date(
      isoTime
    ).toLocaleTimeString("en-IN", {
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
                data.senderId === userId
                  ? "justify-end"
                  : "justify-start"
              } mb-0.5 gap-2`}
            >
              <div
                className={`max-w-[49%] border gap-4 py-0.5 px-2 rounded-md ${
                  data.senderId === userId
                    ? "bg-blue-300/30 border-blue-300/50"
                    : "bg-gray-300/30 border-gray-300/50"
                }`}
              >
                <h2 className="text-md wrap-break-word">
                  {data.message}
                </h2>

                <span className="text-[10px] font-thin block text-right">
                  {formatTime(
                    data.createdAt
                  )}
                </span>
              </div>
            </div>
          )}
          components={{
            Footer: () => (
              <div className="h-6" />
            ),
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-xl">
            Start your conversation...
          </h2>
        </div>
      )}

      <Form
        className="flex gap-2"
        onSubmitCapture={sendMessage}
      >
        <Input
          placeholder="Message"
          value={newMessage}
          onChange={(e) =>
            setNewMessage(e.target.value)
          }
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