"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronRight, User, Users, Info, LogOut } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Breadcrumb label map ─────────────────────────────────────────────────────
const LABEL_MAP = {
  dashboard: "Dashboard",
  api_keys: "API Keys",
  api_usage: "API Usage",
  digital_content: "Digital Content",
  management: "Management",
  transaction_management: "Transaction Management",
  payment_management: "Payment Management",
  subscription_management: "Subscription Management",
  membership_management: "Membership Management",
  user_management: "User Management",
  profile: "Profile",
  subscription: "Subscription",
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
export default function DashboardNavbar({ onToggleSidebar, UserData, logout }) {
  console.log(UserData);
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs(pathname);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLogoutModalOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <>
    <header className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-4 md:px-6 bg-bg-2/95 backdrop-blur-md border-b border-bg-3 shrink-0">
      {/* ── Left: Hamburger + Breadcrumbs ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="
            w-9 h-9 flex items-center justify-center rounded-lg
            bg-bg-2 border border-bg-3
            text-text-3
            hover:text-primary-1 dark:hover:text-primary-3 hover:border-primary-1/40 dark:hover:border-primary-1/40 hover:bg-primary-1/10 dark:hover:bg-primary-1/10
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
              {i > 0 && <ChevronRight size={13} className="text-bg-3 mx-0.5" />}
              {crumb.isLast ? (
                <span className="font-medium text-text-1">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-text-3 hover:text-primary-1 dark:hover:text-primary-3 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Right: Avatar Dropdown ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <ThemeToggle className="w-9 h-9" />

        <div className="relative" ref={dropdownRef}>
          {/* Trigger button */}
          <button
            id="avatar-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="
              flex items-center gap-2 p-1.5 rounded-xl
              bg-bg-2 border border-bg-3
              hover:border-bg-4 transition-all duration-200
              active:scale-95
            "
          >
            {UserData && UserData?.avatar_url ? (
              <img src={UserData.avatar_url} className="w-7 h-7 rounded-full shrink-0" alt="Avatar Profile" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-[11px] font-bold text-white shadow-lg">
                {UserData?.name?.charAt(0) || "U"}
              </div>
            )}
            <ChevronRight
              size={14}
              className={`text-[#6B7280] transition-transform duration-200 ${dropdownOpen ? "rotate-90" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`
              absolute right-0 mt-3 w-[220px] 
              bg-bg-2 border border-bg-3 
              rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.6)]
              overflow-hidden
              transition-all duration-200
              ${
                dropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }
            `}
          >
            {/* Header Info */}
            <div className="px-4 py-3.5 border-b border-bg-3 bg-bg-2/50">
              <p className="text-[13px] font-bold text-text-1 truncate">{UserData?.name || "User Name"}</p>
              <p className="text-[11px] text-text-3 truncate mt-0.5">{UserData?.email || "user@example.com"}</p>
            </div>

            {/* Links */}
            <div className="p-1.5">
              <Link
                href="/dashboard/profile"
                onClick={() => setDropdownOpen(false)}
                className="
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-[13px] text-slate-600 dark:text-[#9CA3AF]
                  hover:text-primary-1 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#13131A]
                  transition-all duration-200
                "
              >
                <User size={16} />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-[13px] text-text-2
                  hover:text-red-500 hover:bg-red-500/10
                  transition-all duration-200
                "
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

    </header>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to login again to access your dashboard."
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoggingOut}
        icon={LogOut}
      />
    </>
  );
}
