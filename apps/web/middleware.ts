import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { api } from "./utils/api";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const path = request.nextUrl.pathname;

  const isPublic = path === "/" || path === "/login" || path === "/sign-up";

  let role: string | null = null;

  if (!token && !refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      role = payload.role as string;
    } catch {
    }
  }

  if (role && isPublic) {
    return NextResponse.redirect(
      new URL(`/${role}`, request.url)
    );
  }

  if (role && path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(
      new URL(`/${role}`, request.url)
    );
  }
1
  if (role && path.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(
      new URL(`/${role}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/sign-up", "/admin/:path*", "/user/:path*"],
};