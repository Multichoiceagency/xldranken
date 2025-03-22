import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Create the response first so we can modify headers
  const res = NextResponse.next()

  // Add CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    res.headers.append("Access-Control-Allow-Origin", "*")
    res.headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.headers.append("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization")
  }

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res
  }

  // Check if the path is protected
  const isProtectedPath = ["/account", "/customers"].some((path) => pathname.startsWith(path))

  // Check if the path is auth-related
  const isAuthPath = ["/login", "/register"].some((path) => pathname === path)

  // Only check authentication for protected or auth paths
  if (isProtectedPath || isAuthPath) {
    // Get the token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Redirect to login if accessing protected route without token
    if (isProtectedPath && !token) {
      const url = new URL("/login", req.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Redirect to account if accessing auth path with token
    if (isAuthPath && token) {
      return NextResponse.redirect(new URL("/account", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    "/api/:path*", // Apply to API routes for CORS
    "/account/:path*", // Protected routes
    "/customers/:path*", // Protected routes
    "/login", // Auth routes
    "/register", // Auth routes
  ],
}

