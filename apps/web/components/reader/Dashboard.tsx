"use client";
import React from "react";
import ReaderHeader from "../ui/ReaderHeader";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import BlogCard from "../ui/BlogCard";
import { useAppSelector } from "@/redux/store/hooks";

const Dashboard = () => {
  const prev = useAppSelector((p) => p.p.preview);

  return (
    <div className="px-6">
      <main className={prev ? "hidden" : "flex flex-col gap-2"}>
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
        </div>
      </main>
      <BlogCard />
    </div>
  );
};

export default Dashboard;
