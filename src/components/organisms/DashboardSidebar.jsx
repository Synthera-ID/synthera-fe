"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
      { label: "Course", href: "/dashboard/course", icon: BookOpen, roles: ["ADMIN", "MEMBER"] },
      { label: "Profile", href: "/dashboard/profile", icon: User, roles: ["ADMIN", "MEMBER"] },
    ],
  },
  {
    label: "SUBSCRIPTION",
    items: [
      { label: "My Subscription", href: "/dashboard/subscription", icon: CreditCard, roles: ["ADMIN", "MEMBER"] },
      { label: "Subscription History", href: "/dashboard/subscription_history", icon: Clock, roles: ["ADMIN", "MEMBER"] },
    ],
  },
  {
    label: "MANAGEMENT",
    roles: ["ADMIN"],
    items: [
      { label: "User Management", href: "/dashboard/user_management", icon: Users, roles: ["ADMIN"] },
      { label: "Payment Management", href: "/dashboard/payment_management", icon: DollarSign, roles: ["ADMIN"] },
      { label: "Transaction Management", href: "/dashboard/payment_history", icon: BarChart2, roles: ["ADMIN"] },
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

export const MEMBER_ALLOWED_ROUTES = [
  "/dashboard",
  "/dashboard/profile",
  "/dashboard/subscription",
  "/dashboard/api_keys",
  "/dashboard/api_usage",
];

export default function DashboardSidebar({ isOpen = false, onClose, userRole = "MEMBER" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-[260px] bg-[#0D0D12] border-r border-[#1A1A24] z-50 transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[60px] px-6 border-b border-[#1A1A24] flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image src={SyntheraIcon} alt="Synthera" width={28} height={28} className="rounded-lg" />
              <span className="font-bold text-white tracking-tight">Synthera</span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-[#6B7280] hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
            {NAV_GROUPS.map((group) => {
              const filteredItems = group.items.filter((item) => item.roles.includes(userRole));
              if (filteredItems.length === 0) return null;
              if (group.roles && !group.roles.includes(userRole)) return null;

              return (
                <div key={group.label} className="space-y-2">
                  <h4 className="px-3 text-[11px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">
                    {group.label}
                  </h4>
                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary-1/10 text-primary-3 border border-primary-1/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                                : "text-[#9CA3AF] hover:text-white hover:bg-[#13131A] border border-transparent"
                            }
                          `}
                        >
                          <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-[#1A1A24]">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
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