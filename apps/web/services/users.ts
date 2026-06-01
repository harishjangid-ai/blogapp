import { api } from "@/utils/api";

export const fetchUsers = async () => {
  const response = await api.get("/users", { withCredentials: true });

  return response.data;
};

export const deleteUser = async ({ id }: { id: string | undefined }) => {
  const res = await api.delete(`/delete-user/${id}`, {withCredentials: true});
  return res.data;
};


export const chatUsers = async () => {
  const response = await api.get("/chat-users", { withCredentials: true });
  return response.data;
};