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
  User,
  Users,
  Info,
  X,
  LogOut,
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Wallet,
  Receipt,
  BadgeCheck,
  LayoutList,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "MEMBER"] },
  { label: "Course", href: "/dashboard/course", icon: BookOpen, roles: ["ADMIN", "MEMBER"] },
  { label: "Profile", href: "/dashboard/profile", icon: User, roles: ["ADMIN", "MEMBER"] },
  { label: "My Subscription", href: "/dashboard/subscription", icon: CreditCard, roles: ["ADMIN", "MEMBER"] },
  { label: "API Keys", href: "/dashboard/api_keys", icon: Key, roles: ["ADMIN", "MEMBER"] },
  { label: "API Usage", href: "/dashboard/api_usage", icon: BarChart2, roles: ["ADMIN", "MEMBER"] },

  { label: "General Information", href: "/dashboard/general_information", icon: Info, roles: ["ADMIN"] },
];

const MANAGEMENT_ITEMS = [
  { label: "User Management", href: "/dashboard/management/user_management", icon: Users },
  { label: "Payment Management", href: "/dashboard/management/payment_management", icon: Wallet },
  { label: "Transaction Management", href: "/dashboard/management/transaction_management", icon: Receipt },
  { label: "Subscription Management", href: "/dashboard/management/subscription_management", icon: BadgeCheck },
  { label: "Membership Management", href: "/dashboard/management/membership_management", icon: LayoutList },
  { label: "Digital Content", href: "/dashboard/management/digital_content_management", icon: BookOpen },
];

const MANAGEMENT_ROUTES = MANAGEMENT_ITEMS.map((i) => i.href);

export const MEMBER_ALLOWED_ROUTES = [
  "/dashboard",
  "/dashboard/course",
  "/dashboard/profile",
  "/dashboard/subscription",
  "/dashboard/api_keys",
  "/dashboard/api_usage",
];

// ─── NavLink atom ──────────────────────────────────────────────────────────────
function NavLink({ item, isActive, isOpen }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200
        ${
          isActive
            ? "bg-primary-1/10 text-primary-2 dark:text-primary-3 border border-primary-1/20 shadow-sm dark:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
            : "text-text-2 hover:text-text-1 hover:bg-bg-3 border border-transparent"
        }
        ${!isOpen && "lg:justify-center lg:px-0"}
      `}
      title={!isOpen ? item.label : ""}
    >
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
      <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"}`}>
        {item.label}
      </span>
    </Link>
  );
}

// ─── Management group ──────────────────────────────────────────────────────────
function ManagementGroup({ pathname, isOpen }) {
  const isAnyActive = MANAGEMENT_ROUTES.some((r) => pathname === r);
  const [expanded, setExpanded] = useState(isAnyActive);

  return (
    <div>
      {/* Group header button */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium
          transition-all duration-200 border
          ${
            isAnyActive
              ? "bg-primary-1/10 text-primary-2 dark:text-primary-3 border-primary-1/20"
              : "text-text-2 hover:text-text-1 hover:bg-bg-3 border-transparent"
          }
          ${!isOpen && "lg:justify-center lg:px-0"}
        `}
        title={!isOpen ? "Management" : ""}
      >
        <ShieldCheck size={18} strokeWidth={isAnyActive ? 2.5 : 2} className="shrink-0" />

        {/* Label + chevron — only visible when sidebar is open */}
        <span
          className={`flex flex-1 items-center justify-between transition-all duration-300 ${
            isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"
          }`}
        >
          <span>Management</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
          />
        </span>
      </button>

      {/* Sub-items */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded && isOpen ? "max-h-[400px] opacity-100 mt-1" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-3 pl-3 border-l border-bg-3 space-y-0.5">
          {MANAGEMENT_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border
                  ${
                    isActive
                      ? "bg-primary-1/10 text-primary-2 dark:text-primary-3 border-primary-1/20"
                      : "text-text-3 hover:text-text-1 hover:bg-bg-3 border-transparent"
                  }
                `}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
export default function DashboardSidebar({ isOpen = false, onClose, userRole = "MEMBER" }) {
  const pathname = usePathname();
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
  const showManagement = userRole === "ADMIN";

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
        className={`fixed lg:static inset-y-0 left-0 bg-bg-2 border-r border-bg-3 z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-[260px] translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-[80px]"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[60px] px-6 border-b border-bg-3 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image src={SyntheraIcon} alt="Synthera" width={28} height={28} className="rounded-lg" />
              <span
                className={`font-bold text-text-1 tracking-tight transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"
                }`}
              >
                Synthera
              </span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-text-3 hover:text-text-1 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 custom-scrollbar">
            {/* Regular items */}
            {filteredItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                isOpen={isOpen}
              />
            ))}

            {/* Management group — ADMIN only */}
            {showManagement && (
              <>
                {/* Section label */}
                <div
                  className={`pt-4 pb-1 px-3 transition-all duration-300 ${
                    isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-3/60">
                    Management
                  </p>
                </div>

                <ManagementGroup pathname={pathname} isOpen={isOpen} />
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-bg-3">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors ${
                !isOpen && "lg:justify-center lg:px-0"
              }`}
              title={!isOpen ? "Sign Out" : ""}
            >
              <LogOut size={18} className="shrink-0" />
              <span
                className={`transition-all duration-300 ${isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"}`}
              >
                Sign Out
              </span>
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