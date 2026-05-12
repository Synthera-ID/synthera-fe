"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LogoutModal from "./LogoutModal";
import SyntheraIcon from "@/app/icon.png";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  CreditCard,
  Key,
  BarChart2,
  Grid,
  Clock,
  User,
  Users,
  Info,
  X,
  LogOut,
  BookOpen,
  Settings,
  ShieldCheck,
  DollarSign,
  ChevronDown,
} from "lucide-react";

/**
 * NAV_GROUPS with role-based access
 */
const NAV_GROUPS = [
  {
    label: "MAIN MENU",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "MEMBER"] },
      { label: "Courses", href: "/dashboard/course", icon: BookOpen, roles: ["ADMIN", "MEMBER"] },
      { label: "Profile", href: "/dashboard/profile", icon: User, roles: ["ADMIN", "MEMBER"] },
    ],
  },
  {
    label: "SUBSCRIPTION",
    items: [
      { label: "My Subscription", href: "/dashboard/subscription", icon: CreditCard, roles: ["ADMIN", "MEMBER"] },
      { label: "History", href: "/dashboard/subscription_history", icon: Clock, roles: ["ADMIN", "MEMBER"] },
    ],
  },
  {
    label: "MANAGEMENT",
    roles: ["ADMIN"],
    items: [
      { label: "User Management", href: "/dashboard/user_management", icon: Users, roles: ["ADMIN"] },
      { label: "Payment Management", href: "/dashboard/payment_management", icon: DollarSign, roles: ["ADMIN"] },
      { label: "Transaction Management", href: "/dashboard/transaction_management", icon: BarChart2, roles: ["ADMIN"] },
      { label: "Subscription Management", href: "/dashboard/subscription_management", icon: CreditCard, roles: ["ADMIN"] },
      { label: "Membership Management", href: "/dashboard/membership_management", icon: ShieldCheck, roles: ["ADMIN"] },
      { label: "Digital Content", href: "/dashboard/digital_content", icon: Grid, roles: ["ADMIN"] },
    ],
  },
  {
    label: "DEVELOPER",
    items: [
      { label: "API Keys", href: "/dashboard/api_keys", icon: Key, roles: ["ADMIN", "MEMBER"] },
      { label: "API Usage", href: "/dashboard/api_usage", icon: BarChart2, roles: ["ADMIN", "MEMBER"] },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "General Info", href: "/dashboard/general_information", icon: Info, roles: ["ADMIN"] },
    ],
  },
];

/** Routes accessible by MEMBER role */
export const MEMBER_ALLOWED_ROUTES = [
  "/dashboard",
  "/dashboard/profile",
  "/dashboard/subscription",
  "/dashboard/api_keys",
  "/dashboard/api_usage",
];

/**
 * DashboardSidebar
 * @param {boolean}  isOpen   – controls visibility on mobile (default false)
 * @param {function} onClose  – called when user clicks overlay or close button
 * @param {string}   userRole – "ADMIN" | "MEMBER"
 */
export default function DashboardSidebar({ isOpen = false, onClose, userRole = "MEMBER" }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  return (
    <>
      {/* ── Mobile overlay backdrop ───────────────────────────────────────── */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`
          fixed inset-0 z-30 bg-black/60 backdrop-blur-sm
          md:hidden
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Sidebar panel ─────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed md:sticky top-0 left-0
          z-40 md:z-10
          w-64 h-screen shrink-0
          flex flex-col pt-6
          bg-[#0D0D12] border-r border-[#1A1A24]
          transition-all duration-300 ease-in-out
          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* ── Logo row + mobile close button ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 mb-8">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <Image
              src={SyntheraIcon}
              alt="Synthera Icon"
              width={28}
              height={28}
              className="rounded-full group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all"
            />
            <span className="text-xl font-bold tracking-wide text-white">
              Synthera
            </span>
          </Link>

          {/* Close button — only on mobile */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              md:hidden w-7 h-7 flex items-center justify-center rounded-lg
              text-[#6B7280] hover:text-white hover:bg-[#1A1A24]
              transition-all duration-150
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col gap-6 px-3 py-4">
            {NAV_GROUPS.map((group) => {
              // Filter items in group based on userRole
              const visibleItems = group.items.filter((item) => item.roles.includes(userRole));
              
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.label} className="flex flex-col gap-1">
                  <h3 className="px-4 text-[10px] font-bold text-[#6B7280] tracking-[0.15em] mb-2 uppercase">
                    {group.label}
                  </h3>
                  <div className="flex flex-col gap-0.5">
                    {visibleItems.map(({ label, href, icon: Icon }) => {
                      const isActive =
                        href === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname.startsWith(href);

                      return (
                        <Link
                          key={href}
                          href={href}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-xl
                            border transition-all duration-200 group
                            ${isActive
                              ? "text-[#A78BFA] bg-[#8B5CF6]/10 border-[#8B5CF6]/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                              : "text-[#9CA3AF] border-transparent hover:text-white hover:bg-[#1A1A24]"
                            }
                          `}
                        >
                          <Icon
                            size={18}
                            strokeWidth={1.75}
                            className={`
                              transition-colors duration-200
                              ${isActive ? "text-[#A78BFA]" : "text-[#6B7280] group-hover:text-white"}
                            `}
                          />
                          <span className="font-medium text-[13px]">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── Logout button ─────────────────────────────────────────────── */}
        <div className="px-3 pb-6 pt-2 border-t border-[#1A1A24]">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="
              flex items-center gap-3 w-full px-4 py-2.5 rounded-xl
              border border-transparent
              text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20
              transition-all duration-200 cursor-pointer
            "
          >
            <LogOut size={18} strokeWidth={1.75} className="text-[#6B7280]" />
            <span className="font-medium text-[13px]">Logout</span>
          </button>
        </div>
      </aside>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
}