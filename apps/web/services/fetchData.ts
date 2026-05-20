import { api } from "@/utils/api";

export const fetchRequests = async ()=>{
    const response = await api.get("/pending-requests", {withCredentials: true});
    return response.data;
}

export const approvedReq = async ()=>{
    const response = await api.get("/approved-requests", {withCredentials: true});
    return response.data;
}

export const rejectedReq = async ()=>{
    const response = await api.get("/rejected-requests", {withCredentials: true});
    return response.data;
}
