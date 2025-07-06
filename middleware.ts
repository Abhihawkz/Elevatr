import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")

    // If user is on auth page and already authenticated, redirect based on role
    if (isAuthPage && isAuth) {
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url))
      } else {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Protect admin routes
    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Protect user dashboard routes
    if (isDashboardPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
      if (token?.role !== "USER") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
}
