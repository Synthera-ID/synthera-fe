// app/(protected)/layout.jsx atau app/dashboard/layout.jsx
"use client";

import { AuthProvider } from "@/hooks/useAuth";

export default function ProtectedLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
