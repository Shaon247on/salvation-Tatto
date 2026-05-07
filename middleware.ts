import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/dashboard");
  // pathname.startsWith("/tasks") ||
  // pathname.startsWith("/users") ||
  // pathname.startsWith("/profile");

  const isAuthRoute = pathname === "/auth/signin" || pathname === "/";

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    // "/tasks/:path*",
    // "/users/:path*",
    // "/profile/:path*",
    "/auth/signin",
    "/",
  ],
};
