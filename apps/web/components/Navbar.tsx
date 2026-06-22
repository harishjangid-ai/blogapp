"use client";

import { useEffect, useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/store/hooks";
import { persistor } from "@/redux/store/store";
import {
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Drawer } from "antd";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    persistor.purge();
    router.push("/login");
  };

  const role = useAppSelector((user) => user.auth.user?.role);

  if (!mounted) {
    return null;
  }

  const navClass = (path: string) =>
    `px-3 py-1 rounded-md transition-all duration-200 ${
      pathname === path ? "bg-gray-400/20 font-semibold" : "hover:text-blue-500"
    }`;

  const NavItems = () => {
    if (role === "admin") {
      return (
        <>
          <Link
            href="/admin"
            className={navClass("/admin")}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className={navClass("/admin/users")}
            onClick={() => setOpen(false)}
          >
            Users
          </Link>

          <Link
            href="/admin/blogs"
            className={navClass("/admin/blogs")}
            onClick={() => setOpen(false)}
          >
            Blogs
          </Link>

          <Link
            href="/admin/reports"
            className={navClass("/admin/reports")}
            onClick={() => setOpen(false)}
          >
            Reports
          </Link>
        </>
      );
    }

    if (role === "user") {
      return (
        <>
          <Link
            href="/user"
            className={navClass("/user")}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/user/trending-blogs"
            className={navClass("/user/trending-blogs")}
            onClick={() => setOpen(false)}
          >
            Trending Blogs
          </Link>

          <Link
            href="/user/my-blogs"
            className={navClass("/user/my-blogs")}
            onClick={() => setOpen(false)}
          >
            My Blogs
          </Link>

          <Link
            href="/user/create"
            className={navClass("/user/create")}
            onClick={() => setOpen(false)}
          >
            Create Blog
          </Link>

          <Link
            href="/user/messages"
            className={navClass("/user/messages")}
            onClick={() => setOpen(false)}
          >
            Messages
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <nav className="w-full bg-gray-100 flex justify-center py-2 lg:fixed lg:top-0 lg:left-0 lg:z-50">
        <div className="w-full flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {role && (
              <button
                className="md:hidden text-lg"
                onClick={() => setOpen(true)}
              >
                <MenuOutlined />
              </button>
            )}

            <div className="nav-brand">
              <h2 className="text-2xl font-bold">Inkflow</h2>
            </div>
          </div>

          {role === "admin" ? (
            <div className="hidden md:flex gap-5">
              <NavItems />
            </div>
          ) : role === "user" ? (
            <div className="hidden md:flex gap-5">
              <NavItems />
            </div>
          ) : null}

          <div className={!role ? "hidden" : "flex gap-5"}>
            <LogoutOutlined
              className="p-2 bg-gray-300/50 rounded-full cursor-pointer"
              onClick={handleLogout}
            />
          </div>

          <div className={role ? "hidden" : "flex gap-5"}>
            <Link
              href={"/login"}
              className="py-1 px-4 bg-gray-300/50 rounded-2xl cursor-pointer flex gap-3 text-blue-400"
            >
              <span>Login</span>
              <LoginOutlined />
            </Link>
          </div>
        </div>
      </nav>

      <Drawer
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        width={260}
      >
        <div className="flex flex-col gap-5">
          <NavItems />
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;