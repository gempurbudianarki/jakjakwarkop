import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 60000
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  if (record.count >= limit) {
    return NextResponse.json(
      { error: "Terlalu banyak request. Coba lagi nanti." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((record.resetTime - now) / 1000).toString(),
        },
      }
    );
  }

  record.count++;
  return null;
}

export function strictRateLimit(
  request: NextRequest,
  limit: number = 5,
  windowMs: number = 60000
): NextResponse | null {
  return rateLimit(request, limit, windowMs);
}
