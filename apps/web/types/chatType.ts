import { ReUser } from "./userType";

export interface Message {
  _id: string;
  sender: ReUser;
  message: string;
  imageUrl: string | null;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  readBy: ReUser[];
  readed: number;
  participantCount: number;
}

export interface NewMessage {
  senderId: string | undefined;
  receiverId: string | undefined;
  message: string | undefined;
}
