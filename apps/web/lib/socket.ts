import { io } from "socket.io-client";

export const socket = io(process.env.BASE_URL, {
  autoConnect: true,
});