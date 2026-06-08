export interface User {
  _id: string;
  chatId?: string;
  fullName?: string;
  userName?: string;
  groupName?: string;
  isGroup?: boolean;
  phone?: string;
  role?: string;
  createdAt?: string;
}

export interface SelectedUser {
  _id: string;
  fullName?: string;
  userName?: string;
  groupName?: string;
  isGroup?: boolean;
}
export interface usersType {
  _id: string;
  fullName: string;
  phone: string;
  userId: string;
  dateOfBirth: string;
  email: string;
  contentType: string;
  profession: string;
  createdAt: string;
  description: string;
}

export interface OnlineUser {
  userId: string;
  status: "online" | "away" | "offline";
};
