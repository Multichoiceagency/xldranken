import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.append("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");

  return res;
}

export const config = {
  matcher: "/api/:path*", // Apply only to API routes
};
