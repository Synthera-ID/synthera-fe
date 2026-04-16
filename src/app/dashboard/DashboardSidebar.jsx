"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SyntheraIcon from "@/app/icon.png";
import {
  Home,
  CreditCard,
  Key,
  BarChart2,
  Grid,
  Clock,
  User,
  Moon,
  Sun,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { label: "API Keys", href: "/dashboard/api_keys", icon: Key },
  { label: "API Usage", href: "/dashboard/api_usage", icon: BarChart2 },
  { label: "Digital Content", href: "/dashboard/digital_content", icon: Grid },
  { label: "Payment History", href: "/dashboard/payment_history", icon: Clock },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("light"));
  }, []);

  const toggleTheme = () => {
    const isLightMode = document.documentElement.classList.toggle("light");
    setIsDark(!isLightMode);
  };

  return (
    <aside className="w-64 border-r border-[#1A1A24] bg-[#0D0D12] flex flex-col pt-6 relative z-10 sticky top-0 h-screen hidden md:flex">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 mb-8 group w-fit">
        <Image
          src={SyntheraIcon}
          alt="Synthera Icon"
          width={28}
          height={28}
          className="rounded-full group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all"
        />
        <span className="text-xl font-bold tracking-wide text-white">Synthera</span>
      </Link>

      {/* Theme Toggle */}
      <div className="px-4 mb-6">
        <button
          onClick={toggleTheme}
          className="w-full h-10 rounded-xl bg-[#13131A] border border-[#1A1A24] flex items-center justify-center text-[#6B7280] hover:text-white hover:border-[#8B5CF6]/30 transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 text-[10px] font-bold text-[#6B7280] tracking-widest mb-3">
          USER PANEL
        </div>
        <nav className="flex flex-col gap-0.5 px-3">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? "text-[#A78BFA] bg-[#8B5CF6]/20 border border-[#8B5CF6]/30"
                  : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] border border-transparent"
                  }`}
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className={isActive ? "text-[#A78BFA]" : "text-[#6B7280]"}
                />
                <span className="font-medium text-[13px]">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}