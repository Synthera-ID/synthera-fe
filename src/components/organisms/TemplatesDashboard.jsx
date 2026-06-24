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

  // ── Mobile scroll lock effect ──────────────
  useEffect(() => {
    const checkMediaQuery = () => window.innerWidth < 1024;
    
    if (isSidebarOpen && checkMediaQuery()) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    const handleResize = () => {
      if (checkMediaQuery() && isSidebarOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Don't render admin-only content for MEMBER while redirecting
  if (userRole !== "ADMIN") {
    const isAllowed = MEMBER_ALLOWED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (!isAllowed) return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userRole={userRole} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <DashboardNavbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} UserData={user} logout={logout} />

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">{children}</main>
      </div>
    </div>
  );
}
