import { LikeOutlined } from "@ant-design/icons";
import React from "react";

const BlogCard = ({
  title,
  description,
  writer,
  likes,
  _id,
}: {
  title: string;
  description: string;
  writer: string;
  likes: number;
  _id: string;
}) => {
  return (
    <div className="p-4 flex flex-col gap-3 border rounded-2xl border-gray-300 hover:shadow duration-75" onClick={() => console.log(_id)}>
      <h1 className="text-xl font-normal">{title}</h1>
      <p className="text-md text-gray-500 font-thin">{description}</p>
      <div className="flex justify-between text-lg text-gray-500">
        <h2 className="font-thin">{writer}</h2>
        <p className="flex gap-2 "><LikeOutlined/>{likes}</p>
      </div>
      <button className="rounded-2xl border border-gray-500/20 hover:bg-gray-400/20 duration-150 py-2">Read More</button>
    </div>
  );
};

export default BlogCard;
