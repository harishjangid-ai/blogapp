"use client";
import Navbar from "@/components/Navbar"; 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <main className="px-6 max-h-screen overflow-y-auto mt-8">{children}</main>
    </div>
  );
}
