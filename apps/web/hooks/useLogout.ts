"use client"
import { logoutUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import { api } from "@/utils/api";

export function useLogout() {
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });

      dispatch(logoutUser());
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
}