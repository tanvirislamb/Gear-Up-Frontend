import { NextRequest, NextResponse } from "next/server";

const ROLE_HOME: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json)?.role ?? null;
  } catch {
    return null;
  }
}

function loginRedirect(pathname: string, search: string, origin: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const origin = req.nextUrl.origin;
  const token = req.cookies.get("accessToken")?.value || req.cookies.get("token")?.value;
  const role = token ? getRoleFromToken(token) : null;

  // Already authenticated -> never show auth pages again.
  if ((pathname === "/login" || pathname === "/register") && role) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] || "/", origin));
  }

  // Everything below requires authentication.
  if (!token) {
    if (pathname === "/login" || pathname === "/register") return NextResponse.next();
    return loginRedirect(pathname, search, origin);
  }

  // Checkout: any logged-in user may proceed.
  if (pathname.startsWith("/checkout")) return NextResponse.next();

  // Role-scoped dashboard gating.
  if (pathname.startsWith("/dashboard")) {
    const requiredRole = pathname.startsWith("/dashboard/provider")
      ? "PROVIDER"
      : pathname.startsWith("/dashboard/admin")
        ? "ADMIN"
        : pathname.startsWith("/dashboard/customer")
          ? "CUSTOMER"
          : null;

    if (requiredRole && role !== requiredRole) {
      return NextResponse.redirect(new URL(ROLE_HOME[role || ""] || "/", origin));
    }
    if (!requiredRole && role) {
      return NextResponse.redirect(new URL(ROLE_HOME[role] || "/", origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout",
    "/login",
    "/register",
  ],
};
