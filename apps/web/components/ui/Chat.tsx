"use client";

import { DeleteOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, message, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../types/chatType";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/redux/store/hooks";
import { useSocket } from "../../hooks/useSocket";
import { joinChat, registerUser } from "../../services/socketMethods";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyChat } from "@/services/chat";
import { useTyping } from "@/hooks/useTyping";
import { Check, CheckCheck } from "lucide-react";
import ReadOnlyChatEditor from "../chat-lexical/ReadOnlyChatEditor";
import ChatEditor, { ChatEditorRef } from "../chat-lexical/ChatEditor";
const Chat = ({
  chatId,
  receiverId,
}: {
  chatId: string | undefined;
  receiverId: string | undefined;
}) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [newMessage, setNewMessage] = useState<any>(null);
  const editorRef = useRef<ChatEditorRef>(null);
  const queryClient = useQueryClient();
  const { typingUsers, emitTyping } = useTyping({
    chatId,
    userId,
  });

  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
  } | null>(null);

  const handleRightClick = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();

    setMenu({
      x: e.clientX,
      y: e.clientY,
      messageId,
    });
  };

  const socketRef = useSocket();
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  const { data: chat } = useQuery<Message[]>({
    queryKey: ["my-chat"],
    queryFn: () => getMyChat({ chatId }),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["my-chat"] });
  }, [chatId]);
  useEffect(() => {
    const closeMenu = () => setMenu(null);

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

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
  useEffect(() => {
    if (!socketRef) return;

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData(
        ["my-chat"],
        (oldData: Message[] | undefined) => {
          if (!oldData) return [];

          return oldData.filter((msg) => msg._id !== messageId);
        },
      );
    };

    socketRef.on("message_deleted", handleMessageDeleted);

    return () => {
      socketRef.off("message_deleted", handleMessageDeleted);
    };
  }, []);
  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const hasText = newMessage?.root?.children?.some(
      (node: any) => node.children?.length > 0,
    );

    if (!hasText) {
      return message.error("Please type message");
    }

    if (chatId) {
      socketRef.emit("send_message", {
        chatId,
        senderId: userId,
        message: newMessage,
        receiverId,
      });
    } else {
      socketRef.emit("send_message", {
        receiverId,
        senderId: userId,
        message: newMessage,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["my-chat"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    editorRef.current?.clear();
    setNewMessage(null);
  };

  useEffect(() => {
    if (!socketRef.connected || !userId) return;

    registerUser({
      socket: socketRef,
      userId,
    });
  }, [userId]);

  useEffect(() => {
    if (!socketRef) return;
    const handleReceiveMessage = (msg: Message) => {
      if (chatId && msg.chatId !== chatId) return;

      socketRef.emit("mark_read", {
        chatId,
        userId,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["my-chat"] });
    };

    socketRef.on("receive_message", handleReceiveMessage);

    return () => {
      socketRef.off("receive_message", handleReceiveMessage);
    };
  }, [chatId]);

  useEffect(() => {
    if (!socketRef) return;

    const handleChatCreated = (newChatId: string) => {
      joinChat({
        socket: socketRef,
        chatId: newChatId,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    socketRef.on("chat_created", handleChatCreated);
    const handleRead = () => {
      queryClient.invalidateQueries({
        queryKey: ["my-chat"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    };

    socketRef.on("messages_read", handleRead);

    return () => {
      socketRef.off("messages_read", handleRead);
      socketRef.off("chat_created", handleChatCreated);
    };
  }, []);

  useEffect(() => {
    setNewMessage(null);
    if (!chatId || !userId) return;

    socketRef.emit("mark_read", {
      chatId,
      userId,
    });
  }, [chatId, userId]);

  useEffect(() => {
    if (!chatId) return;

    joinChat({
      socket: socketRef,
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

  const HandleDeleteMsg = ({ msgId }: { msgId: string }) => {
    socketRef.emit("delete_message", {
      senderId: userId,
      messageId: msgId,
    });
  };

 return (
  <div className="flex h-full flex-col justify-between rounded-s-2xl bg-white dark:bg-gray-900 p-4">
    {chat?.length ? (
      <div className="h-[55vh] md:h-[65vh] lg:h-[75vh]">
        <Virtuoso
          ref={virtuosoRef}
          data={chat}
          className="h-full"
          followOutput={false}
          itemContent={(_, data) => (
            <div
              className={`mb-1 flex flex-col ${
                data.sender._id === userId ? "items-end" : "items-start"
              }`}
            >
              <div
                onContextMenu={
                  data.sender._id === userId
                    ? (e) => handleRightClick(e, data._id)
                    : () => {
                        console.log("u can't do anything");
                      }
                }
                className={`flex max-w-[85%] items-start gap-3 rounded-2xl border px-3 py-2 shadow-sm sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%] ${
                  data.sender._id === userId
                    ? "border-blue-300/50 bg-blue-300/30 dark:border-blue-900 dark:bg-blue-900/20"
                    : "border-gray-300/50 bg-gray-300/30 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="flex flex-shrink-0 items-center justify-center">
                  {data.sender.image === "" ? (
                    <h1 className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300/30 dark:bg-gray-700 text-xs font-semibold text-black dark:text-gray-100 sm:h-9 sm:w-9 sm:text-sm">
                      {data.sender.fullName
                        .split(" ")
                        .map((w) => w[0].toUpperCase())
                        .join("")}
                    </h1>
                  ) : (
                    <Avatar
                      className="dark:ring-1 dark:ring-gray-700"
                      src={data.sender.image || undefined}
                      icon={data.sender.image && <UserOutlined />}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="min-w-0 overflow-hidden text-sm dark:text-gray-100 sm:text-base">
                    <ReadOnlyChatEditor value={data.message} />
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] font-thin text-gray-600 dark:text-gray-400">
                      {formatTime(data.createdAt)}
                    </span>

                    <Tooltip
                      title={
                        data.readBy.length ? (
                          <div className="flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
                            {data.readBy.map((user) => (
                              <div
                                key={user._id}
                                className="rounded px-2 py-1 text-xs text-gray-100"
                              >
                                {user.fullName}
                              </div>
                            ))}
                          </div>
                        ) : (
                          "Sent"
                        )
                      }
                      style={{ maxWidth: 250 }}
                    >
                      <span
                        className={
                          data.sender._id === userId
                            ? "inline-flex cursor-pointer text-gray-700 dark:text-gray-300"
                            : "hidden"
                        }
                      >
                        {data.readed >= (data.participantCount || 0) ? (
                          <CheckCheck size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[8px] text-gray-600 dark:text-gray-400">
                  {data.sender._id === userId ? "you" : data.sender.userName}
                </p>
              </div>
            </div>
          )}
          components={{ Footer: () => <div className="h-10"></div> }}
        />

        {menu && (
          <div
            className="fixed z-50"
            style={{
              left: menu.x,
              top: menu.y,
            }}
          >
            <button
              onClick={() => {
                HandleDeleteMsg({ msgId: menu.messageId });
                setMenu(null);
              }}
              className="flex w-full gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-left text-red-500 shadow-lg hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <DeleteOutlined /> Delete
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-xl text-gray-700 dark:text-gray-300">
          Start your conversation...
        </h2>
      </div>
    )}

    {typingUsers.length !== 0 && (
      <div className="mb-1 flex flex-col items-start">
        <div className="flex max-w-[49%] items-center gap-4 rounded-md border border-gray-300/50 dark:border-gray-700 bg-gray-300/30 dark:bg-gray-800 px-1">
          <div>
            <h2 className="text-md text-gray-700 dark:text-gray-300">...</h2>
          </div>
        </div>
      </div>
    )}

    <Form className="flex gap-2" onSubmitCapture={sendMessage}>
      <div className="flex-1">
        <ChatEditor
          ref={editorRef}
          onSend={sendMessage}
          onChange={(value) => {
            setNewMessage(value);
            emitTyping();
          }}
        />
      </div>

      <Button
        htmlType="submit"
        icon={<SendOutlined />}
        disabled={
          !newMessage?.root?.children?.some(
            (node: any) => node.children?.length > 0
          )
        }
        className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
      />
    </Form>
  </div>
);
};

export default Chat;
