import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";

const BackButton = () => {
  return (
    <>
      <Link
        href={"/"}
        className="border-2 text-gray-600/80 px-4 py-2 bg-gray-400/20 hover:bg-gray-500/20 duration-200 cursor-pointer border-gray-500/20 hover:border-gray-600/20 absolute top-2 left-2 rounded-lg"
      >
        <ArrowLeftOutlined /> Back to home
      </Link>
    </>
  );
};

export default BackButton;
