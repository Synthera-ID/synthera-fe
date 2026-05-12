"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`p-2 rounded-lg border border-[#1A1A24] bg-[#13131A] w-9 h-9 flex items-center justify-center ${className}`}>
        <div className="w-4 h-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        p-2 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-center
        ${isDark 
          ? "border-white/10 bg-white/5 text-gray-400 hover:text-white" 
          : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
        }
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={15} className="transition-all" />
      ) : (
        <Sun size={15} className="text-yellow-500 transition-all" />
      )}
    </button>
  );
}
