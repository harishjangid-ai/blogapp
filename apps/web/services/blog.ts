import { api } from "@/utils/api";

export const createNewBlog = async ({ title, description }: { title: string; description: string }) => {
  const res = await api.post( "/create-blog", { title, description }, { withCredentials: true } );
  return res.data;
};

export const getBlogs = async ({ page = 1, limit = 10 }: { page?: number; limit?: number; }) => {
  const res = await api.get(`/blogs?page=${page}&limit=${limit}`);
  return res.data;
};

export const selectedBlog = async ({ id }: { id: string }) => {
  const res = await api.get(`/blog/${id}`, { withCredentials: true });
  return res.data;
};

export const usersBlog = async ({ page = 1, limit = 10 }: { page?: number; limit?: number;  }) => {
  const res = await api.get(`/user-blogs?page=${page}&limit=${limit}`, { withCredentials: true });
  return res.data;
};

export const generateWithAi = async ({ topic, tone }: { topic: string; tone: string }) => {
  const res = await api.post("/create-blog-ai", { topic, tone });
  return res.data;
};

export const reportBlog = async ({ blogId, reason }: { blogId: string; reason: string }) => {
  const res = await api.post("/new-report", { blogId, reason }, { withCredentials: true });
  return res.data;
};

export const likeBlog = async ({ blogId }: { blogId: string }) => {
  const res = await api.post("/like", { blogId }, { withCredentials: true });
  return res.data;
};

export const viewBlog = async ({ blogId }: { blogId: string }) => {
  const res = await api.post("/view", { blogId }, { withCredentials: true });
  return res.data;
};

export const deleteBlog = async ({ blogId }: { blogId: string }) => {
  const res = await api.delete(`/delete-blog/${blogId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getReports = async () => {
  const res = await api.get("/get-reports", { withCredentials: true });
  return res.data;
};

export const resolveReport = async ({ reportId, status }: { reportId: string; status: "approved" | "rejected" }) => {
  const res = await api.put("/update-report-status", { reportId, status },{ withCredentials: true });
  return res.data;
};

export const allLikes = async () => {
  const res = await api.get("/likes");
  return res.data;
};

export const newComment = async ({ blogId, comment }: { blogId: string; comment: string }) => {
  const res = await api.post(`/new-comment`, { blogId, comment }, { withCredentials: true });
  return res.data;
};
// { page = 1, limit = 10 }: { page?: number; limit?: number; }
export const blogComments = async ({ blogId, page = 1, limit = 10 }: { blogId: string; page?: number; limit?: number; }) => {
  const res = await api.post(`/blog-comments?page=${page}&limit=${limit}`, { blogId });
  return res.data;
};

export const isBlogReported = async ({ blogId }: { blogId: string }) => {
  const res = await api.post(`/is-reported`, { blogId });
  return res.data;
};
export const trendingBlogs = async () => {
  const res = await api.get("/trending-blogs");
  return res.data;
};

export const commentReply = async ({ commentId, reply }: { commentId: string; reply: string; }) => {
  const res = await api.post(`/reply-comment`,{ commentId, reply },{ withCredentials: true },);
  return res.data;
};

export const commentReplies = async ({ commentId }: { commentId: string; }) => {
  const res = await api.post(`/comment-replies`, { commentId });
  return res.data;
};

export const commentCount = async ({ blogId }: { blogId: string }) => {
  const res = await api.post(`/count`, { blogId });
  return res.data.count;
};

export const apiRes = async()=>{
  const res = await api.get("/blog-count");
  return res.data.count
}