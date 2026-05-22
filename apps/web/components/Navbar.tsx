"use client";

import { useEffect, useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/store/hooks";
import { persistor } from "@/redux/store/store";
import { LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";

const Navbar = () => {
  const logout = useLogout();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  const handleLogout = () => {
    logout();
    persistor.purge();
  };

  const role = useAppSelector((user) => user.auth.user?.role);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-full bg-gray-100 flex justify-center py-2 lg:fixed lg:top-0 lg:left-0 lg:z-50">
      <div className="w-full flex items-center justify-between px-6">
        <div className="nav-brand">
          <h2 className="text-2xl font-bold">Inkflow</h2>
        </div>

        {role === "admin" ? (
          <div className="flex gap-5">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/blogs">Blogs</Link>
            <Link href="/admin/requests">Requests</Link>
            <Link href="/admin/reports">Reports</Link>
          </div>
        ) : role === "reader" ? (
          <div className="flex gap-5">
            <Link href="/reader">Dashboard</Link>
            <Link href="/reader/blogs">Blogs</Link>
            <Link href="/reader/writers">Writers</Link>
            <Link href="/reader/messages">Messages</Link>
            <Link href="/reader/become-writer">
              Become a Writer
            </Link>
          </div>
        ) : role === "writer" ? (
          <div className="flex gap-5">
            <Link href="/writer">Dashboard</Link>
            <Link href="/writer/my-blogs">My Blogs</Link>
            <Link href="/writer/create">Create Blog</Link>
            <Link href="/writer/reports">Reports</Link>
            <Link href="/writer/messages">Messages</Link>
          </div>
        ) : (
          <div className="flex gap-5">
            <Link href="/">Home</Link>
            <Link href="/trending">Trending</Link>
            <Link href="/writers">Writers</Link>
          </div>
        )}

        <div className="flex gap-5">
          <LogoutOutlined
            className="p-2 bg-gray-300/50 rounded-full cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;