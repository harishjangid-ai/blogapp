"use client";
import Navbar from "@/components/Navbar"; 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <main className="px-6 py-2 max-h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
