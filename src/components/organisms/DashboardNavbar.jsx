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
                <Link
                  href={crumb.href}
                  className="text-[#6B7280] hover:text-[#A78BFA] transition-colors"
                >
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
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="
            flex items-center gap-2 p-1.5 rounded-xl
            bg-[#13131A] border border-[#1A1A24]
            hover:border-[#2D2D3A] transition-all duration-200
            active:scale-95
          "
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-[11px] font-bold text-white shadow-lg">
            {UserData?.name?.charAt(0) || "U"}
          </div>
          <ChevronRight
            size={14}
            className={`text-[#6B7280] transition-transform duration-200 ${dropdownOpen ? "rotate-90" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`
            absolute right-0 mt-3 w-[220px] 
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
          {/* Header Info */}
          <div className="px-4 py-3.5 border-b border-[#1A1A24] bg-[#13131A]/50">
            <p className="text-[13px] font-bold text-white truncate">{UserData?.name || "User Name"}</p>
            <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{UserData?.email || "user@example.com"}</p>
          </div>

          {/* Links */}
          <div className="p-1.5">
            <Link
              href="/dashboard/profile"
              onClick={() => setDropdownOpen(false)}
              className="
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-[13px] text-[#9CA3AF]
                hover:text-white hover:bg-[#13131A]
                transition-all duration-200
              "
            >
              <User size={16} />
              My Profile
            </Link>

            <Link
              href="/dashboard/general_information"
              onClick={() => setDropdownOpen(false)}
              className="
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-[13px] text-[#9CA3AF]
                hover:text-white hover:bg-[#13131A]
                transition-all duration-200
              "
            >
              <Info size={16} />
              General Information
            </Link>

            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-[13px] text-[#9CA3AF]
                hover:text-red-400 hover:bg-red-500/10
                transition-all duration-200
              "
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
