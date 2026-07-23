"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { useState } from "react";
import { Select } from "antd";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const router = useRouter();

  const [path, setPath] = useState<string>("/user");
  const handleChange = (value: string) => {
    setPath(value);
    router.push(value);
  };

  const p = useAppSelector((p) => p.p.preview);
  return (
    <>
      {p ? null : (
        <div className="px-6 mt-3 flex justify-between">
          <h1 className="text-3xl font-normal text-gray-800 dark:text-gray-200">
            {path == "/user"
              ? "All Blogs"
              : path == "/user/trending-blogs"
                ? "Trending Blogs"
                : path == "/user/my-blogs"
                  ? "My Blogs"
                  : null}
          </h1>

          <Select
            defaultValue={path}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "/user", label: "All Blogs" },
              { value: "/user/trending-blogs", label: "Trending Blogs" },
              { value: "/user/my-blogs", label: "My Blogs" },
            ]}
          />
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
