"use client";

import { UserAddOutlined } from "@ant-design/icons";
import ReqCard from "../ui/ReqCard";
import { useQuery } from "@tanstack/react-query";
import { RequestType } from "@/types/requestsType";
import { approvedReq, fetchRequests, rejectedReq } from "@/services/fetchData";
import { Spin } from "antd";

const Requests = () => {
  const {data: pendingReq, isLoading} = useQuery<RequestType[]>({
    queryKey: ['pending-req'],
    queryFn: fetchRequests,
  })

  const {data: approvedRequest} = useQuery<RequestType[]>({
    queryKey: ['approved-req'],
    queryFn: approvedReq,
  })

  const {data: rejectedRequests} = useQuery<RequestType[]>({
    queryKey: ['rejected-req'],
    queryFn: rejectedReq,
  })

  if(isLoading){
    return (<div className="flex items-center justify-center"><Spin/></div>)
  }

  return (
    <main className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-2xl">
          <UserAddOutlined className="text-orange-500!" /> Writer Requests
        </h2>
        <p className="text-sm text-gray-500">
          Review and manage writer onboarding requests
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Pending" total={pendingReq?.length} css="text-orange-500" />
        <Card title="Approved" total={approvedRequest?.length} css="text-green-500" />
        <Card title="Rejected" total={rejectedRequests?.length} css="text-red-500" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl">Pending Requests</h2>
        <ReqCard/>
      </div>
    </main>
  );
};

const Card = ({
  title,
  total,
  css,
}: {
  title: string;
  total: number | undefined;
  css: string;
}) => {
  return (
    <div className="w-full rounded-2xl border border-gray-400/50 py-3 px-4 flex gap-2 justify-center flex-col">
      <h3 className="font-thin">{title}</h3>
      <p className={`${css} text-2xl font-semibold`}>{total}</p>
    </div>
  );
};

export default Requests;
