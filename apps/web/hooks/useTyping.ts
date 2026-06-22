"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "./useSocket";

export const useTyping = ({
  chatId,
  userId,
}: {
  chatId?: string;
  userId?: string;
}) => {
  const socket = useSocket();

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emitTyping = () => {
    if (!chatId || !userId) return;

    socket.emit("typing", {
      chatId,
      userId,
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        chatId,
        userId,
      });
    }, 1500);
  };

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({
      chatId: incomingChatId,
      userId: typingUserId,
    }: {
      chatId: string;
      userId: string;
    }) => {
      if (incomingChatId !== chatId) return;

      if (typingUserId === userId) return;

      setTypingUsers((prev) => {
        if (prev.includes(typingUserId)) {
          return prev;
        }

        return [...prev, typingUserId];
      });
    };

    const handleStopTyping = ({
      chatId: incomingChatId,
      userId: typingUserId,
    }: {
      chatId: string;
      userId: string;
    }) => {
      if (incomingChatId !== chatId) return;

      setTypingUsers((prev) =>
        prev.filter((id) => id !== typingUserId)
      );
    };

    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
    };
  }, [socket, chatId, userId]);

  return {
    typingUsers,
    emitTyping,
  };
};