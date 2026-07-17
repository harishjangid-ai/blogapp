"use client"
import { logoutUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import { api } from "@/utils/api";

export function useLogout() {
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      const res = await api.post("/logout", {}, { withCredentials: true });
      console.log(res.data)
      dispatch(logoutUser());
      return res.data
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
}