import { NextResponse, NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);

  const isAuthenticated = Boolean(session);

  // Routes that REQUIRE authentication
  const protectedRoutes = ["/deploy"];

  const isProtectedRoute =
    protectedRoutes.includes(pathname);

  // 1. Not authenticated → trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Authenticated → trying to access login
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
