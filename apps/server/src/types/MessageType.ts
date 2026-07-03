import { Socket } from "socket.io";
import { SerializedEditorState } from "lexical";

export interface SocketMessage {
  message: SerializedEditorState;
  receiverId: string;
  senderId: string;
  chatId: string;
}

export interface SocketType extends Socket {
  userId?: string;
}