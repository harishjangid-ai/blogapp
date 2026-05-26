"use client";

import { allwriters } from "@/services/writerRequest";
import { WritersType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Button, Input } from "antd";
import { LucideUsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import WriterDetail from "../ui/WriterDetail";

const Writers = () => {
  const [search, setSearch] = useState<string>("");
  const [viewProf, setViewProf] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const { data: writer } = useQuery<WritersType[]>({
    queryKey: ["writers"],
    queryFn: allwriters,
  });
  const filteredWriters = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return writer;
    return writer?.filter(
      (w) =>
        w.fullName.toLowerCase().includes(s) ||
        w.contentType.toLowerCase().includes(s) ||
        w.profession.toLowerCase().includes(s),
    );
  }, [search, writer]);
  const close = ()=>{
    setViewProf(false);
    setId("");
  }
  return (
    <>
      <div className={viewProf ? " hidden" : "flex flex-col gap-3 px-6"}>
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-3xl flex items-center gap-3">
            <LucideUsersRound className="text-blue-500" />
            Featured Writers
          </h1>
          <p className="text-xl font-thin text-gray-600/40">
            Discover talented writers and their stories
          </p>
        </div>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search writer by name, content, proffession..."
          className="w-75!"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredWriters?.map((data) => (
            <div
              className="flex flex-col border-2 border-gray-400 rounded-2xl p-6 items-center w-full text-center gap-3 text-gray-500 font-thin"
              key={data._id}
            >
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {data.fullName
                  .split(" ")
                  .map((w) => w[0].toUpperCase())
                  .join("")}
              </div>
              <div>
                <h2 className="text-lg text-black">{data.fullName}</h2>
                <p className="text-sm">{data.email}</p>
              </div>
              <div className="">
                <p>
                  {data.profession} ||{" "}
                  {data.contentType.charAt(0).toUpperCase() +
                    data.contentType.slice(1)}
                </p>
                <p className="text-sm wrap-break-word line-clamp-2">
                  {data.description}
                </p>
              </div>
              <div className="flex w-full">
                <Button
                  className="border! border-gray-500! text-gray-500! w-full hover:bg-gray-400/10! bg-gray-300/10! "
                  type={"default"}
                  onClick={() => {
                    setViewProf(true);
                    setId(data.userId);
                  }}
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {viewProf && (
        <div className="flex justify-center w-full ">
          <WriterDetail id={id} close={close} />
        </div>
      )}
    </>
  );
};

export default Writers;
