"use client";

import Link from "next/link";
import { Button, Typography } from "antd";
import {
  ArrowLeftOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const PageNotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-6">
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
          <div className="relative flex flex-col items-center px-8 py-16">
            <div className="absolute -top-24 h-64 w-64 rounded-full bg-blue-100 dark:bg-blue-900 blur-3xl opacity-40" />
            <div className="absolute -bottom-24 h-64 w-64 rounded-full bg-indigo-100 dark:bg-indigo-900 blur-3xl opacity-40" />

            <div className="relative flex items-center gap-4">
              <span className="text-[110px] font-extrabold leading-none text-blue-600 dark:text-blue-400">
                4
              </span>

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-900 shadow-lg">
                <SearchOutlined className="text-[42px] text-blue-600 dark:text-blue-400" />
              </div>

              <span className="text-[110px] font-extrabold leading-none text-blue-600 dark:text-blue-400">
                4
              </span>
            </div>

            <Title
              level={2}
              className="mt-10! mb-2! text-center dark:!text-gray-100"
            >
              Oops! Page Not Found
            </Title>

            <Paragraph className="max-w-xl text-center text-base text-gray-500 dark:text-gray-400">
              The page you are looking for doesn't exist, may have been moved,
              or the URL might be incorrect.
            </Paragraph>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/user">
                <Button
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  className="h-11! rounded-xl! px-7!"
                >
                  Go to Dashboard
                </Button>
              </Link>

              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                className="h-11! rounded-xl! px-7! dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
              <SearchOutlined />
              <span>Error Code: 404 • Resource Not Found</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;