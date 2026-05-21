"use client";
import React from "react";
import BecomeWriterHeader from "../ui/BecomeWriterHeader";
import BeWriterForm from "../ui/BeWriterForm";

const BecomeWriter = () => {
  return (
    <main className="flex flex-col gap-2 items-center">
      <BecomeWriterHeader />
      <BeWriterForm/>
    </main>
  );
};

export default BecomeWriter;
