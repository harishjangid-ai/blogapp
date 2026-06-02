export interface Message {
  _id: string | undefined;
  senderId: string | undefined;
  chatId: string | undefined;
  message: string | undefined;
  createdAt: string;
}

export interface NewMessage {
  senderId: string | undefined;
  receiverId: string | undefined;
  message: string | undefined;
}