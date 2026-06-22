import { Socket } from "socket.io-client";

export const registerUser = ({socket, userId}: {socket: Socket | undefined, userId: string | undefined}) => {
  if (!socket || !userId) return;
  socket.emit("register", userId);
};

export const joinChat = ({socket, chatId}: {socket: Socket | null, chatId: string | undefined}) => {
  if (!socket || !chatId) return;
  socket.emit("join_chat", chatId);
};