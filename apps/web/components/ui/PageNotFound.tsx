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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-gray-100 px-6">
      <div className="w-full max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="relative flex flex-col items-center px-8 py-16">
            <div className="absolute -top-24 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-40" />
            <div className="absolute -bottom-24 h-64 w-64 rounded-full bg-indigo-100 blur-3xl opacity-40" />

            <div className="relative flex items-center gap-4">
              <span className="text-[110px] font-extrabold leading-none text-blue-600">
                4
              </span>

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-blue-600 bg-white shadow-lg">
                <SearchOutlined className="text-[42px] text-blue-600" />
              </div>

              <span className="text-[110px] font-extrabold leading-none text-blue-600">
                4
              </span>
            </div>

            <Title
              level={2}
              className="mt-10! mb-2! text-center"
            >
              Oops! Page Not Found
            </Title>

            <Paragraph className="max-w-xl text-center text-gray-500 text-base">
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
                className="h-11! rounded-xl! px-7!"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-3 text-sm text-gray-500">
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