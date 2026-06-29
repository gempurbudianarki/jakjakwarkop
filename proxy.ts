import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS = {
  "X-DNS-Prefetch-Control": "on",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(self), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

// In-memory rate limit store (per Edge worker instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function applyRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }
  if (record.count >= limit) return true;
  record.count++;
  return false;
}

function getSessionRole(request: NextRequest): string | null {
  // Next-Auth v5 stores session in a cookie — we check for its presence
  // Full role validation happens in the API route/page itself
  // This is an optimistic check to redirect unauthenticated users
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token") ||
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  return sessionCookie ? "authenticated" : null;
}

// Named export as per Next.js 16 proxy convention
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    const isStrict =
      pathname === "/api/auth/register" || pathname === "/api/checkin";
    const limited = applyRateLimit(ip, isStrict ? 10 : 120, 60000);
    if (limited) {
      return NextResponse.json(
        { error: "Terlalu banyak request. Coba lagi nanti." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Optimistic admin route protection (full role check is in the page/API)
  if (pathname.startsWith("/admin")) {
    const session = getSessionRole(request);
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Full ADMIN role verification happens in the admin page component itself
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};
