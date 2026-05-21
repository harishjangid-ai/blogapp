import { api } from "@/utils/api"

export const fetchUsers = async ()=>{
    const response = await api.get("/users", {withCredentials: true});

    return response.data;
}

export const admins = async ()=>{
    const response = await api.get("/admins", {withCredentials: true});

    return response.data;
}

export const readers = async ()=>{
    const response = await api.get("/readers", {withCredentials: true});

    return response.data;
}

export const writers = async ()=>{
    const response = await api.get("/writers", {withCredentials: true});

    return response.data;
}