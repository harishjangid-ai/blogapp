"use client";

import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { writersBlog } from "@/services/blog";
import { selWriter } from "@/services/writerRequest";
import { BlogType2 } from "@/types/blog";
import { WritersType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Affix, Button } from "antd";
import BlogPreview from "./BlogPreview";
import WritersBlog from "./WritersBlog";

const WriterDetail = ({ id, close }: { id: string; close: () => void }) => {

  const { data: writer } = useQuery<WritersType>({
    queryKey: ["writer", id],
    queryFn: () => selWriter({ id }),
  });

  const prev = useAppSelector((p) => p.p.preview);

  return (
    <>
      <div className={prev ? "hidden" : "flex flex-col gap-5 w-full items-center"}>
        <div className="max-w-5xl w-full flex flex-col gap-3">
          <Affix offsetTop={55}>
            <Button
              className="text-gray-500! border! border-gray-500! hover:text-black! mb-3"
              onClick={close}
            >
              ← Back to Home
            </Button>
          </Affix>

          <div className="flex gap-2 items-center">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
              {writer?.fullName
                .split(" ")
                .map((w) => w[0].toUpperCase())
                .join("")}
            </div>
            <div className="text-gray-500 flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="text-xl leading-none text-black">
                  {writer?.fullName}
                </p>
                <p className="text-sm leading-none">{writer?.email}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-lg leading-none text-black">
                  {writer?.profession} | {writer?.contentType}
                </p>
                <p className="text-sm leading-none">{writer?.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 flex flex-col w-full items-center py-2 min-h-[calc(100vh-205px)] gap-3">
          <div className="flex w-full max-w-5xl">
            <h2 className="text-xl">Articles by {writer?.fullName}</h2>
          </div>
          <WritersBlog id={id} isMyBlog={false}/>
        </div>
      </div>
      {prev && (
        <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default WriterDetail;
