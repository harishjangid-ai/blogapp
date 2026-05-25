"use client";

import { writersBlog } from "@/services/blog";
import { selWriter } from "@/services/writerRequest";
import { BlogType2 } from "@/types/blog";
import { WritersType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const WriterDetail = ({id} :{ id: string}) => {
    const {data}= useQuery<BlogType2[]>({
        queryKey: [''],
        queryFn: ()=> writersBlog({id})
    })
    const {data: writer} = useQuery<WritersType>({
        queryKey: ['writer'],
        queryFn: ()=> selWriter({id})
    })
  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
          {writer?.fullName
            .split(" ")
            .map((w) => w[0].toUpperCase())
            .join("")}
        </div>
        <div className="">
            <h1>{writer?.fullName}</h1>
            <h2>{writer?.email}</h2>
            <p>{writer?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default WriterDetail;
