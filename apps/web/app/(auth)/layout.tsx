"use client";

import BackButton from "@/components/ui/BackButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <BackButton/>
      {children}
    </div>
  );
}
