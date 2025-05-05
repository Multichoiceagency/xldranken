import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Define allowed origins
  const allowedOrigins = [
    "https://xlgroothandelbv.nl", 
    "http://localhost:8080", 
    "http://localhost:3000"
  ];
  
  // Get the origin from the request
  const origin = req.headers.get("origin") || "";
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // Set CORS headers for all requests
  // For API routes, allow any origin in development or specific origins in production
  if (pathname.startsWith("/api/")) {
    if (isDevelopment) {
      res.headers.set("Access-Control-Allow-Origin", "*");
    } else if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      res.headers.set("Access-Control-Allow-Origin", "https://xlgroothandelbv.nl");
    }
    
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    
    // Handle OPTIONS request (CORS preflight)
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: res.headers,
      });
    }
  } 
  // For non-API routes, set more restrictive CORS
  else {
    if (isDevelopment || allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin || "*");
    } else if (origin) {
      res.headers.set("Access-Control-Allow-Origin", "https://xlgroothandelbv.nl");
    }
    
    if (origin) {
      res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    }
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

    // Redirect to account if already logged in and trying to access auth pages
    if (isAuthPath && token) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
    "/account/:path*",
    "/customers/:path*",
    "/login",
    "/register",
  ],
};
