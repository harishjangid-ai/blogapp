"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import BlogCard from "./BlogCard";

const AllDasboard = () => {
  const prev = useAppSelector((p) => p.p.preview);
  return (
    <div className="px-6">
      <main
        className={prev ? "hidden" : "flex justify-between items-center gap-2"}
      >
        <h1 className="text-2xl font-normal">Latest Articles</h1>
        <div className="flex gap-2">
          <Link
            href={"/blogs"}
            className="text-blue-500 hover:text-blue-700 duration-300 px-4 py-2 rounded"
          >
            View All <ArrowRightOutlined />{" "}
          </Link>
        </div>
      </main>
      <BlogCard />
    </div>
  );
};

export default AllDasboard;
