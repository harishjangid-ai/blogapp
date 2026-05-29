import { api } from "@/utils/api"

export const createNewBlog = async({ title, description }: { title: string, description: string }) => {
    const res = await api.post("/create-blog", { title, description }, {withCredentials: true});
    return res.data;
}

export const getBlogs = async()=>{
    const res = await api.get("/blogs");
    return res.data;
}

export const selectedBlog = async({id}: { id: string})=>{
    const res = await api.get(`/blog/${id}` ,{withCredentials: true});
    return res.data;
}

export const usersBlog = async({id}: {id:string | undefined})=>{
    const res = await api.get(`/user-blogs/${id}`, {withCredentials: true})
    return res.data.blogs;
}

export const generateWithAi = async({topic, tone}:{topic: string, tone: string})=>{
    const res = await api.post("/create-blog-ai", {topic, tone});
    return res.data
}

export const reportBlog = async ({blogId, reason}: {blogId: string; reason: string})=>{
    const res = await api.post("/new-report", {blogId, reason}, {withCredentials: true})
    return res.data
}

export const likeBlog = async ({blogId}: {blogId: string;})=>{
    const res = await api.post("/like", {blogId}, {withCredentials: true})
    return res.data
}

export const viewBlog = async ({blogId}: {blogId: string;})=>{
    const res = await api.post("/view", {blogId}, {withCredentials: true})
    return res.data
}

export const deleteBlog = async ({blogId}: {blogId: string})=>{
    const res = await api.delete(`/delete-blog/${blogId}`, {withCredentials: true})
    return res.data
}

export const getReports = async()=>{
    const res = await api.get("/get-reports", {withCredentials: true})
    return res.data
}

export const resolveReport = async({reportId, status}: {reportId: string; status: "approved" | "rejected"})=>{
    const res = await api.put("/update-report-status", {reportId, status}, {withCredentials: true})
    return res.data
}

export const allLikes = async()=>{
    const res = await api.get("/likes")
    return res.data
}