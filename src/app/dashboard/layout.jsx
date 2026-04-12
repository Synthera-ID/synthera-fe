"use client";

import ProtectedRoute from "@/components/organisms/ProtectedRoutes";

export default function LayoutDashboardPage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
