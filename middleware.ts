import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Set CORS headers for API requests
  if (pathname.startsWith("/api/")) {
    res.headers.append("Access-Control-Allow-Origin", "*");
    res.headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.append("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
  }

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res;
  }

  // Define protected and auth routes
  const isProtectedPath = ["/account", "/customers"].some((path) => pathname.startsWith(path));
  const isAuthPath = ["/login", "/register"].includes(pathname);

  // Only check authentication for protected/auth routes
  if (isProtectedPath || isAuthPath) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Redirect to login if accessing protected route without token
    if (isProtectedPath && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // Preserve callback URL
      return NextResponse.redirect(loginUrl);
    }


    if (isAuthPath && token) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/account/:path*",
    "/customers/:path*",
    "/login",
    "/register",
  ],
};
