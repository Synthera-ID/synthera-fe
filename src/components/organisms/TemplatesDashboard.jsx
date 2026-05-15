"use client";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardSidebar, { MEMBER_ALLOWED_ROUTES } from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function TemplatesDashboard({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user,logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const userRole = user?.role || "MEMBER";

  console.log(user)
  // ── Route guard: redirect MEMBER from admin-only pages ──────────────
  useEffect(() => {
    if (userRole !== "ADMIN") {
      const isAllowed = MEMBER_ALLOWED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
      );
      if (!isAllowed) {
        router.replace("/dashboard");
      }
    }
  }, [pathname, userRole, router]);

  // Don't render admin-only content for MEMBER while redirecting
  if (userRole !== "ADMIN") {
    const isAllowed = MEMBER_ALLOWED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (!isAllowed) return null;
  }

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userRole={userRole} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <DashboardNavbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} UserData={user} logout={logout} />

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">{children}</main>
      </div>
    </div>
  );
}
