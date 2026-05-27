"use client";

import { useAppSelector } from "@/redux/store/hooks";
import UsersBlog from "../ui/UsersBlog";

const MyBlogs = () => {
  const id = useAppSelector((i)=> i.auth.user?._id);
  return (
    <div className="flex flex-col w-full items-center px-6 py-2">
      <UsersBlog id={id} isMyBlog={true} />
    </div>
  )
}

export default MyBlogs;