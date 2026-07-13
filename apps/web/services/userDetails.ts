import { api } from "@/utils/api";

export const changePassword = async ({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) => {
  const res = await api.post(`/change-password`, { oldPassword, newPassword }, { withCredentials: true });
  return res.data;
};

export const editUser = async ({ userName, fullName, phone, imageUrl }: { userName: string, fullName: string, phone: string; imageUrl: string | null; })=>{
  const res = await api.post(`/edit-user`, { userName, fullName, phone, imageUrl }, { withCredentials: true });
  return res.data;
}