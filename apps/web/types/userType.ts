export interface User {
  _id: string;
  chatId: string;
  fullName: string;
  userName: string;
  groupName: string;
  isGroup: boolean;
  phone: string;
  role: string;
  createdAt: string;
  unreadCount?: number;
}

export interface ReUser {
  _id: string;
  fullName: string;
  userName: string;
  phone: string;
}
export interface SelectedUser {
  _id: string;
  fullName?: string;
  userName?: string;
  phone: string;
  groupName?: string;
  isGroup?: boolean;
  creator: ReUser;
  chat: {
    _id: string;
    members: ReUser[];
  }
}

export interface OnlineUser {
  userId: string;
  status: "online" | "away" | "offline";
}

export interface UserType {
  _id: string;
  fullName: string;
  userName: string;
  phone: string;
  role: string;
  createdAt: string;
}
