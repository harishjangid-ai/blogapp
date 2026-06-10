import { api } from "@/utils/api";

export const createGroup = async ({ groupName, members }: { groupName: string; members: string[] }) => {
  const res = await api.post("/create-group",{ groupName, members },{ withCredentials: true },);
  return res.data;
};

export const getMyChat = async ({ chatId }: { chatId: string | undefined }) => {
  if (!chatId) {
    return [];
  }
  const res = await api.get(`/my-chat/${chatId}`, { withCredentials: true });
  return res.data;
};

export const deleteGroup = async ({ groupId }: { groupId: string | undefined; }) => {
  const res = await api.post("/delete-group",{ groupId },{ withCredentials: true },);
  return res.data;
};

export const removeUser = async ({ chatId, userId }: { chatId: string | undefined; userId: string | undefined }) => {
  const res = await api.post("/remove-user",{ chatId, userId },{ withCredentials: true },);
  return res.data;
};

export const exitGroup = async ({ chatId}: { chatId: string | undefined}) => {
  const res = await api.post("/exit-group",{ chatId},{ withCredentials: true },);
  return res.data;
};

export const otherUsers = async ({ chatId}: { chatId: string | undefined}) => {
  const res = await api.post("/more-users",{ chatId },{ withCredentials: true },);
  return res.data;
};

export const addMoreUsers = async ({ chatId, members }: { chatId: string | undefined; members: string[]; }) => {
  const res = await api.post("/add-users",{ chatId, members },{ withCredentials: true },);
  return res.data;
};