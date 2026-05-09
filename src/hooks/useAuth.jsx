"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, removeCookie } from "@/utils/cookie";

const AuthContext = createContext(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:8000/api";
const PUBLIC_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
      return;
    }

    if (user && twoFactorRequired && pathname !== "/2fa/verify") {
      router.replace("/2fa/verify");
      return;
    }
  }, [user, loading, pathname, twoFactorRequired, router]);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("userAccessToken")}`,
        },
      });

      if (res.ok) {
        const { data } = await res.json();
        setUser(data);

        // Cek apakah 2FA required
        const require2FA = data.two_factor_confirmed_at && data.two_factor_enabled && !data.two_factor_verified;

        setTwoFactorRequired(require2FA);
      } else {
        // Session invalid / expired → redirect login
        removeCookie("userAccessToken");
        setUser(null);
        router.push("/login");
      }
    } catch {
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, twoFactorRequired, checkAuth }}>
      {loading ? <div className="flex items-center justify-center min-h-screen">Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
