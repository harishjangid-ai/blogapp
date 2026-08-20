import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic =
    path === "/" || path === "/login" || path === "/sign-up";
    
  if (isPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/sign-up", "/admin/:path*", "/user/:path*"],
};