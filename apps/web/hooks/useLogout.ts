import { api } from "@/utils/api";

export function useLogout() {
  const logout = async () => {
    const res = await api.post("/logout", { withCredentials: true });
    const data = res.data;
    return data;
  };
  return logout;
}
