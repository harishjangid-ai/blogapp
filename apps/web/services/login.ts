import { api } from "../utils/api"

export const loginFunction = async ({userName, password}: {userName: string, password: string})=>{
    const response = await api.post("/login", {userName, password});
    return response.data;
}