"use client";

import { Empty, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";

interface DataNotFoundProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const DataNotFound = ({
  title,
  description = "There is nothing to display right now.",
  buttonText,
  onButtonClick,
}: DataNotFoundProps) => {
  return (
    <div className="w-full flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center shadow-sm">
        <Empty
          image={
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
                <InboxOutlined className="text-4xl text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          }
          description={
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {title}
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>

              {buttonText && (
                <Button
                  type="primary"
                  className="mt-6"
                  onClick={onButtonClick}
                >
                  {buttonText}
                </Button>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DataNotFound;