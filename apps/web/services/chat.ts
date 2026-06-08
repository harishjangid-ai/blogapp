import { api } from "@/utils/api"

export const createGroup = async ({ groupName, members }:{ groupName:string, members: string[] }) => {
    const res = await api.post("/create-group", { groupName, members }, {withCredentials: true});
    return res.data;
}