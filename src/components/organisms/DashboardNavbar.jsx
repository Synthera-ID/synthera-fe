"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronRight, User, Users, Info, LogOut } from "lucide-react";
import Image from "next/image";

// ─── Breadcrumb label map ─────────────────────────────────────────────────────
const LABEL_MAP = {
  dashboard: "Dashboard",
  api_keys: "API Keys",
  api_usage: "API Usage",
  digital_content: "Digital Content",
  payment_history: "Payment History",
  profile: "Profile",
  subscription: "Subscription",
  user_management: "User Management",
  general_information: "General Information",
};

function useBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: LABEL_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardNavbar({ onToggleSidebar, UserData }) {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs(pathname);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-4 md:px-6 bg-[#0D0D12]/95 backdrop-blur-md border-b border-[#1A1A24] shrink-0">
      {/* ── Left: Hamburger + Breadcrumbs ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="
            w-9 h-9 flex items-center justify-center rounded-lg
            bg-[#13131A] border border-[#1A1A24]
            text-[#6B7280]
            hover:text-[#A78BFA] hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10
            active:scale-95
            transition-all duration-200
          "
        >
          <Menu size={17} strokeWidth={2} />
        </button>

        {/* Breadcrumbs — hidden on xs */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-[13px]">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={13} className="text-[#2D2D3A] mx-0.5" />}
              {crumb.isLast ? (
                <span className="font-medium text-white/90">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-[#6B7280] hover:text-[#A78BFA] transition-colors duration-150">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Right: Avatar Dropdown ─────────────────────────────────────────── */}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger button */}
        <button
          id="avatar-dropdown-btn"
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="User menu"
          aria-expanded={dropdownOpen}
          className="
            flex items-center gap-2.5
            rounded-xl px-2 py-1.5
            border border-transparent
            hover:bg-[#13131A] hover:border-[#1A1A24]
            active:scale-95
            transition-all duration-200
          "
        >
          {/* Avatar circle */}
          {UserData && UserData?.avatar_url ? (
            <img src={UserData.avatar_url} className="w-8 h-8 rounded-full shrink-0" alt="Avatar Profile" />
          ) : (
            <div
              className="
          w-8 h-8 rounded-full shrink-0
          bg-gradient-to-br from-[#8B5CF6] to-[#4F46E5]
          flex items-center justify-center
          text-white text-[12px] font-bold
          shadow-[0_0_14px_rgba(139,92,246,0.35)]
          "
            >
              {UserData?.name[0]}
            </div>
          )}

          {/* Name + plan — hidden on xs */}
          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-[13px] font-semibold text-white">{UserData?.name}</span>
            <span className="text-[11px] text-[#6B7280]">{UserData?.role}</span>
          </div>

          {/* Chevron */}
          <ChevronRight
            size={13}
            className={`
              text-[#4B5563] transition-transform duration-200
              ${dropdownOpen ? "rotate-90" : ""}
            `}
          />
        </button>

        {/* Dropdown panel */}
        <div
          className={`
            absolute right-0 top-[calc(100%+6px)]
            w-52 origin-top-right
            bg-[#0D0D12] border border-[#1A1A24]
            rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.6)]
            overflow-hidden
            transition-all duration-200
            ${dropdownOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }
          `}
        >
          {/* User info header */}
          <div className="px-4 py-3.5 border-b border-[#1A1A24]">
            <div className="flex items-center gap-2.5">
              {UserData && UserData?.avatar_url ? (
                <img src={UserData.avatar_url} className="w-8 h-8 rounded-full shrink-0" alt="Avatar Profile" />
              ) : (
                <div
                  className="
          w-8 h-8 rounded-full shrink-0
          bg-gradient-to-br from-[#8B5CF6] to-[#4F46E5]
          flex items-center justify-center
          text-white text-[12px] font-bold
          shadow-[0_0_14px_rgba(139,92,246,0.35)]
          "
                >
                  {UserData?.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-white truncate">{UserData?.name}</div>
                <div className="text-[11px] text-[#6B7280] truncate">{UserData?.email}</div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5 flex flex-col gap-0.5">
            <Link
              href="/dashboard/profile"
              onClick={() => setDropdownOpen(false)}
              className="
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-[13px] text-[#9CA3AF]
                hover:text-white hover:bg-[#1A1A24]
                transition-all duration-150
              "
            >
              <User size={15} className="text-[#6B7280] shrink-0" />
              Profile
            </Link>
            <Link
              href="/dashboard/general_information"
              onClick={() => setDropdownOpen(false)}
              className="
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-[13px] text-[#9CA3AF]
                hover:text-white hover:bg-[#1A1A24]
                transition-all duration-150
              "
            >
              <Info size={15} className="text-[#6B7280] shrink-0" />
              General Info
            </Link>

            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-[13px] text-[#9CA3AF]
                hover:text-red-400 hover:bg-red-500/10
                transition-all duration-150
              "
            >
              <LogOut size={15} className="text-[#6B7280] shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
