"use client";

import ProtectedLayout from "@/components/organisms/ProtectedLayout";

export default function LayoutDashboardPage({ children }) {
  return <ProtectedLayout>{children};</ProtectedLayout>;
}
