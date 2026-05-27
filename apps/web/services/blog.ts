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
    const res = await api.get(`/blog/${id}`);
    return res.data;
}

export const usersBlog = async({id}: {id:string | undefined})=>{
    const res = await api.get(`/user-blogs/${id}`)
    return res.data;
}

export const generateWithAi = async({topic, tone}:{topic: string, tone: string})=>{
    const res = await api.post("/create-blog-ai", {topic, tone});
    return res.data
}

export const reportBlog = async ({blogId, reason}: {blogId: string; reason: string})=>{
    const res = await api.post("/new-report", {blogId, reason})
    return res.data
}

export const likeBlog = async ({blogId}: {blogId: string;})=>{
    const res = await api.post("/like", {blogId}, {withCredentials: true})
    return res.data
}

// export const disLikeBlog = async ({blogId, likeId}: {blogId: string; likeId: string})=>{
//     const res = await api.post("/dislike", {blogId, likeId}, {withCredentials: true})
//     return res.data
// }