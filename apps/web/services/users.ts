import { api } from "@/utils/api";

export const fetchUsers = async ({ page = 1, limit = 10, search = "", }: { page?: number; limit?: number; search?: string; }) => {
  const response = await api.get(`/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, { withCredentials: true });
  return response.data;
};
export const deleteUser = async ({ id }: { id: string | undefined }) => {
  const res = await api.delete(`/delete-user/${id}`, { withCredentials: true });
  return res.data;
};


export const getSelUser = async ({ userId }: { userId: string | undefined }) => {
  const res = await api.get(`/selected-user/${userId}`);
  return res.data;
};

export const getUserName = async ({ userId }: { userId: string | undefined }) => {
  const res = await api.get(`/selected-user/${userId}`);
  return res.data.fullName;
};

export const getUsers = async () => {
  const res = await api.get("/chat-users", { withCredentials: true });
  return res.data;
};

export const usr = async () => {
  const res = await api.get("/user", { withCredentials: true });
  return res.data;
};

export const getUserCount = async () => {
  const res = await api.get("/user-count", { withCredentials: true });
  return res.data;
}