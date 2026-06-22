import { api } from "../utils/api"

export const signUpFunction = async ({ userName, password, phone, fullName }: { userName: string; password: string; phone: string; fullName: string })=>{
    const response = await api.post("/signup", { userName, password, phone, fullName });
    return response.data;
}