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

export const writersBlog = async({id}: {id:string})=>{
    const res = await api.get(`/writer-blogs/${id}`)
    return res.data;
}