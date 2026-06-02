"use client";

import { useEffect, useState } from "react";
import { registerUser } from "../services/socketMethods";
import { useSocket } from "./useSocket";
import { OnlineUser } from "../types/userType";

export const usePresence = (userId: string | undefined) => {
  const socketRef = useSocket();
  const [onlineUsersList, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!socketRef.current || !userId) return;

    registerUser({
      socket: socketRef.current,
      userId,
    });

    const handleOnlineUsers = (onlineUsers: OnlineUser[]) => {
      setOnlineUsers(onlineUsers);
    };

    const handleStatusChange = ({ userId, status }: OnlineUser) => {
      setOnlineUsers((prev) => {
        const exists = prev.find((u) => u.userId === userId);
        if (exists) {
          return prev.map((u) => u.userId === userId ? { ...u, status } : u );
        }
        return [ ...prev, { userId, status } ];
      });
    };

    socketRef.current.on("get_online_users", handleOnlineUsers);
    socketRef.current.on("user_status_change", handleStatusChange);

    const emitActivity = () => {
      socketRef.current?.emit("activity");
    };

    window.addEventListener("mousemove", emitActivity);
    window.addEventListener("keydown", emitActivity);
    window.addEventListener("click", emitActivity);
    window.addEventListener("scroll", emitActivity);
    window.addEventListener("touchstart", emitActivity);

    const handleVisibility = () => {
      socketRef.current?.emit("visibility", {
        hidden: document.hidden,
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const heartbeat = setInterval(() => {
      socketRef.current?.emit("heartbeat");
    }, 20000);

    return () => {
      clearInterval(heartbeat);

      socketRef.current?.off("get_online_users", handleOnlineUsers);
      socketRef.current?.off("user_status_change", handleStatusChange);

      window.removeEventListener("mousemove", emitActivity);
      window.removeEventListener("keydown", emitActivity);
      window.removeEventListener("click", emitActivity);
      window.removeEventListener("scroll", emitActivity);
      window.removeEventListener("touchstart", emitActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [socketRef.current, userId]);

  const getUserStatus = (userId: string): "online" | "away" | "offline" => {
    return (
      onlineUsersList.find((u) => u.userId === userId)?.status || "offline"
    );
  };

  const getStatusColor = (userId: string) => {
    const status = getUserStatus(userId);
    if (status === "online") {
      return "bg-green-600";
    }
    if (status === "away") {
      return "bg-yellow-500";
    }
    return "bg-red-600";
  };

  return {
    getUserStatus,
    getStatusColor,
  };
};
