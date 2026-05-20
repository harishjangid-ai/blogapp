import React from "react";
import ReaderHeader from "../ui/ReaderHeader";
import { ArrowRightOutlined, RiseOutlined } from "@ant-design/icons";
import Link from "next/link";
import BlogCard from "../ui/BlogCard";

const Dashboard = () => {
  return (
    <main className="flex flex-col gap-2">
      <ReaderHeader />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal">Latest Articles</h1>
          <div className="flex gap-2">
            <Link
              href={"/reader/trending"}
              className="text-blue-500 hover:text-blue-700 duration-300 px-4 py-2 rounded"
            >
              View All <ArrowRightOutlined />{" "}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BlogCard
            title="Understanding React Virtualization"
            description="Deep dive into virtual scrolling and windowing techniques for better performance in React applications."
            likes={8}
            _id="dasdas"
            writer="John Doe"
          />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
