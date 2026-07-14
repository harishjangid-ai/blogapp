import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="max-h-[100vh-32px] overflow-y-auto lg:mt-13">
        {children}
      </main>
    </div>
  );
}
