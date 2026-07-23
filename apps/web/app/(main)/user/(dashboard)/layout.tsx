import Navbar from "@/components/Navbar";
import DashboardHeader from "@/components/ui/DashboardHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardHeader/>
      {/* <Link href="/user/create" className="flex gap-2 border py-0.5 rounded-md border-gray-500 text-gray-500 px-2"><PlusOutlined /><span className="md:flex hidden">Create Blog</span></Link> */}
      <main className="">
        {children}
      </main>
    </div>
  );
}
