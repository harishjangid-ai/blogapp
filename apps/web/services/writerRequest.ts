import { api } from "@/utils/api";

export const writerRequest = async ({
  dateOfBirth,
  email,
  contentType,
  profession,
  description,
}: {
  dateOfBirth: string;
  email: string;
  contentType: string;
  profession: string;
  description: string;
}) => {
  const res = await api.post(
    "/new-req",
    {
      dateOfBirth,
      email,
      contentType,
      profession,
      description,
    },
    { withCredentials: true },
  );

  return res.data;
};

export const handleRequest = async ({
  status,
  userId,
  role,
  reqId,
}: {
  status: string;
  userId: string;
  role: string;
  reqId: string;
}) => {
  const res = await api.put("/request-update", { status, userId, role, reqId });
  return res.data;
};

export const allwriters = async ()=>{
  const res = await api.get("/all-writer", {withCredentials: true});
  return res.data;
}