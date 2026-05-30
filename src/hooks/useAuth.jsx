"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
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

  const logout = useCallback(async () => {
    try {
      const token = getCookie("userAccessToken");

      // Revoke token di server
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Tetap lanjut logout meskipun API call gagal
    } finally {
      removeCookie("userAccessToken");
      setUser(null);
      setTwoFactorRequired(false);
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, twoFactorRequired, checkAuth, logout }}>
      {loading ? <AuthSkeleton /> : children}
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

// ─── Auth Loading Skeleton ─────────────────────────────────────────────────────
function AuthSkeleton() {
  return (
    <div className="fixed inset-0 bg-bg-1 flex flex-col items-center justify-center gap-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-1/20 animate-pulse" />
        <div className="h-5 w-24 rounded-lg bg-bg-3 animate-pulse" />
      </div>

      {/* Spinner ring */}
      <div className="w-10 h-10 rounded-full border-2 border-primary-1/20 border-t-primary-3 animate-spin" />

      {/* Skeleton bars */}
      <div className="flex flex-col items-center gap-2.5 w-48">
        <div className="h-3 w-full rounded-full bg-bg-3 animate-pulse" />
        <div className="h-3 w-3/4 rounded-full bg-bg-3 animate-pulse" style={{ animationDelay: "150ms" }} />
        <div className="h-3 w-1/2 rounded-full bg-bg-3 animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>

      <p className="text-[12px] text-text-3 animate-pulse">Authenticating...</p>
    </div>
  );
}
