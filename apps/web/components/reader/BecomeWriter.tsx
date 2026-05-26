"use client";
import React, { useEffect, useState } from "react";
import BecomeWriterHeader from "../ui/BecomeWriterHeader";
import BeWriterForm from "../ui/BeWriterForm";
import { useQuery } from "@tanstack/react-query";
import { checkReq } from "@/services/writerRequest";
import { RequestType } from "@/types/requestsType";

const BecomeWriter = () => {
  const [status, setStatus] = useState<string | undefined>("");
  const [isPending, setisPending] = useState<boolean>(false);
  const { data: request } = useQuery<RequestType>({
    queryKey: ["request"],
    queryFn: checkReq,
  });

  useEffect(() => {
    setStatus(request?.reqStatus);
  }, [request]);
  useEffect(() => {
    if (status === "pending") {
      setisPending(true);
    }
    console.log(status)
  }, [status]);
  return (
    <main className="flex flex-col gap-2 items-center">
      {isPending ? (
        <>
          <h1>Request pending</h1>
        </>
      ) : (
        <>
          <BecomeWriterHeader />
          <BeWriterForm />
        </>
      )}
    </main>
  );
};

export default BecomeWriter;
