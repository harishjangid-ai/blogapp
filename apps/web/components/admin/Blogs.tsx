"use client";

import Card from "../ui/Card";
import { FileTextOutlined } from "@ant-design/icons";
import BlogTable from "../ui/BlogTable";
import { useAppSelector } from "@/redux/store/hooks";

const Blogs = () => {
  const preview = useAppSelector((p)=> p.p.preview)
  return (
    <main className="flex flex-col gap-4 px-6">
      <div className={preview? "hidden" : "flex flex-col items-start mt-3"}>
        <h1 className="text-2xl font-semibold">
          <FileTextOutlined className="text-green-600!" /> Blogs Management
        </h1>
        <p className="text-base font-thin text-gray-600/40">
          Share your knowledge and insights with our community
        </p>
      </div>
      <div className={preview ? "hidden" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
        <Card title="Total Blogs" css="text-black" total={5} />
        <Card title="Total Views" css="text-blue-500" total={8} />
        <Card title="Total Likes" css="text-red-500" total={7} />
      </div>
      <BlogTable />
    </main>
  );
};

export default Blogs;
