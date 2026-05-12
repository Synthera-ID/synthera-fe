"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Settings,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "MEMBER"] },
  { label: "Profile", href: "/dashboard/profile", icon: User, roles: ["ADMIN", "MEMBER"] },
  { label: "My Subscription", href: "/dashboard/subscription", icon: CreditCard, roles: ["ADMIN", "MEMBER"] },
  { label: "API Keys", href: "/dashboard/api_keys", icon: Key, roles: ["ADMIN", "MEMBER"] },
  { label: "API Usage", href: "/dashboard/api_usage", icon: BarChart2, roles: ["ADMIN", "MEMBER"] },
  { label: "User Management", href: "/dashboard/user_management", icon: Users, roles: ["ADMIN"] },
  { label: "Payment History", href: "/dashboard/payment_history", icon: BarChart2, roles: ["ADMIN"] },
  { label: "Digital Content", href: "/dashboard/digital_content", icon: Grid, roles: ["ADMIN"] },
  { label: "General Information", href: "/dashboard/general_information", icon: Info, roles: ["ADMIN"] },
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLogoutModalOpen(false);
    setIsLoggingOut(false);
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
        className={`fixed lg:static inset-y-0 left-0 w-[260px] bg-bg-2 border-r border-bg-3 z-50 transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[60px] px-6 border-b border-bg-3 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image src={SyntheraIcon} alt="Synthera" width={28} height={28} className="rounded-lg" />
              <span className="font-bold text-text-1 tracking-tight">Synthera</span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-text-3 hover:text-text-1 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-1/10 text-primary-2 dark:text-primary-3 border border-primary-1/20 shadow-sm dark:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                        : "text-text-2 hover:text-text-1 hover:bg-bg-3 border border-transparent"
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-bg-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

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