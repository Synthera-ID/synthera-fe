"use client";
import ProtectedLayout from "@/components/organisms/ProtectedLayout";
import TemplatesDashboard from "@/components/organisms/TemplatesDashboard";

export default function LayoutDashboardPage({ children }) {
  return (
    <ProtectedLayout>
      <TemplatesDashboard>{children}</TemplatesDashboard>
    </ProtectedLayout>
  );
}
