import { io } from "socket.io-client";

export const socket = io("https://blogapp-server-nu.vercel.app", {
  autoConnect: true,
});