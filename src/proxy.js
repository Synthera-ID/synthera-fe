import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Routes yang HARUS login + 2FA verified
 */
const protectedRoutes = [
  "/dashboard",
  "/subscriptions",
  "/profile",
  "/payment_history",
  "digital_content",
  "api_usage",
  "/api_keys",
];

/**
 * Routes khusus 2FA (harus login, tapi belum perlu verify 2FA)
 */
const twoFactorRoutes = ["/2fa"];

/**
 * Routes untuk guest only (sudah login → redirect dashboard)
 */
const guestRoutes = ["/login", "/register"];

/**
 * Routes publik (tidak perlu auth sama sekali)
 */
const publicRoutes = ["/", "/privacy-policy", "/terms-of-services"];

function matchRoute(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}
/**
 * Extract XSRF-TOKEN dari cookie string & decode
 */
function getXsrfToken(cookieHeader) {
  const match = cookieHeader.match(/XSRF-TOKEN=([^;]+)/);
  if (!match) return "";
  // Laravel encode XSRF token, perlu decode
  return decodeURIComponent(match[1]);
}

export async function proxy(request) {
  return NextResponse.next();
  const { pathname } = request.nextUrl;

  // Public routes → langsung lewat
  if (matchRoute(pathname, publicRoutes)) {
  }

  // ── Cek auth ke Laravel ──
  let user = null;
  let twoFactorRequired = false;

  try {
    // Forward semua cookies dari browser ke Laravel
    const cookieHeader = request.headers.get("cookie") || "";
    const xsrfToken = getXsrfToken(cookieHeader);
    console.log("=== MIDDLEWARE DEBUG ===");
    console.log("Cookies:", cookieHeader);
    console.log("API_BASE:", API_BASE);
    console.log("Referer:", request.nextUrl.origin);
    const res = await fetch(`${API_BASE}/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
        Referer: request.nextUrl.origin,
        ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken }),
      },
    });

    if (res.ok) {
      user = await res.json();

      console.log("User data from API:", user); // Debug: cek data user yang diterima
      // Cek 2FA: enabled di DB tapi belum verify di session ini
      twoFactorRequired = user.two_factor_enabled && !user.two_factor_verified;
    }
  } catch {
    // Laravel down / network error → anggap belum login
    user = null;
  }

  const isAuthenticated = !!user;

  // ── GUEST ROUTES: sudah login → redirect dashboard ──
  if (matchRoute(pathname, guestRoutes)) {
    if (isAuthenticated) {
      if (twoFactorRequired) {
        return NextResponse.redirect(new URL("/2fa", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── 2FA ROUTES: harus login ──
  if (matchRoute(pathname, twoFactorRoutes)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Sudah verify 2FA → tidak perlu di halaman 2FA lagi
    if (!twoFactorRequired) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── PROTECTED ROUTES: harus login + 2FA verified ──
  if (matchRoute(pathname, protectedRoutes)) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (twoFactorRequired) {
      return NextResponse.redirect(new URL("/2fa", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua routes KECUALI:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
