"use client";

import { useTheme } from "@/provider/ThemeProvider";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export default function ThemeToggleButton() {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className=" flex items-center gap-2 rounded-lg px-4 py-2 transition-al bg-gray-200 text-gray-90 dark:bg-gray-700 dark:text-whit hover:opacity-80"
    >
      {themeMode === "dark" ? <SunOutlined /> : <MoonOutlined />}

      {/* {themeMode === "dark" ? "Light Mode" : "Dark Mode"} */}
    </button>
  );
}