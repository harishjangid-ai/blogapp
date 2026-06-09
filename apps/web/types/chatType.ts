export interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    userName: string;
  };
  message: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewMessage {
  senderId: string | undefined;
  receiverId: string | undefined;
  message: string | undefined;
}
