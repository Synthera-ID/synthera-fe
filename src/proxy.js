import { NextResponse } from "next/server";

/**
 * Routes yang HARUS login + 2FA verified
 */
const protectedRoutes = [
  "/dashboard",
  "/subscriptions",
  "/profile",
  "/digital_content",
  "/api_usage",
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
 * Cek apakah session cookie ada di request.
 * Ini BUKAN validasi session — hanya cek keberadaan cookie.
 * Validasi real dilakukan client-side oleh komponen/hook.
 */
function hasSessionCookie(request) {
  const cookie = request.cookies.get("userAccessToken");
  return !!cookie?.value;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSession = hasSessionCookie(request);

  // Public routes → langsung lewat
  if (matchRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // ── GUEST ROUTES: punya session → redirect dashboard ──
  if (matchRoute(pathname, guestRoutes)) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── 2FA ROUTES: harus punya session ──
  if (matchRoute(pathname, twoFactorRoutes)) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // ── PROTECTED ROUTES: harus punya session ──
  if (matchRoute(pathname, protectedRoutes)) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
