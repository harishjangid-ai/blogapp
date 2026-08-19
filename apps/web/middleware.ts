import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const activeRole = request.cookies.get("activeRole")?.value;

  const path = request.nextUrl.pathname;

  const isPublic =
    path === "/" || path === "/login" || path === "/sign-up";

  let role: string | null = null;
  let anotherRole: string | null = null;

  if (!token && !refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      role = payload.role as string;
      anotherRole = payload.anotherRole as string | null;
    } catch {}
  }

  let currentRole = role;

  if ( anotherRole && activeRole && (activeRole === role || activeRole === anotherRole)) {
    currentRole = activeRole;
  }

  if (currentRole && isPublic) {
    return NextResponse.redirect(
      new URL(`/${currentRole}`, request.url)
    );
  }

  if (
    currentRole &&
    path.startsWith("/admin") &&
    currentRole !== "admin"
  ) {
    return NextResponse.redirect(
      new URL(`/${currentRole}`, request.url)
    );
  }

  if (
    currentRole &&
    path.startsWith("/user") &&
    currentRole !== "user"
  ) {
    return NextResponse.redirect(
      new URL(`/${currentRole}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ "/", "/login", "/sign-up", "/admin/:path*", "/user/:path*" ],
};