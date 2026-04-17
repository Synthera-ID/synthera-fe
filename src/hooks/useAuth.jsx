"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("userAccessToken")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setUser(data);

        // Cek apakah 2FA required
        if (data.two_factor_confirmed_at && data.two_factor_enabled && !data.two_factor_verified) {
          setTwoFactorRequired(true);
        }
      } else {
        // Session invalid / expired → redirect login
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
    <AuthContext.Provider value={{ user, loading, twoFactorRequired, checkAuth }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
