import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const intlMiddleware = createMiddleware(routing);

interface JwtPayload {
  id: string;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("craft-organic-token")?.value;
  let role: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      role = decoded.role;
    } catch {
      // Invalid token
    }
  }

  const path = req.nextUrl.pathname;
  // Remove locale prefix for checking
  const pathWithoutLocale = path.replace(/^\/(ru|kg|en)/, "");

  // Protect /admin routes
  if (pathWithoutLocale.startsWith("/admin") && role !== "ADMIN") {
    const locale = path.split("/")[1] || "ru";
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Protect /seller routes
  if (pathWithoutLocale.startsWith("/seller") && role !== "SELLER" && role !== "ADMIN") {
    const locale = path.split("/")[1] || "ru";
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Protect /profile and /checkout
  if ((pathWithoutLocale.startsWith("/profile") || pathWithoutLocale.startsWith("/checkout")) && !role) {
    const locale = path.split("/")[1] || "ru";
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

