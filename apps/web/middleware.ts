import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const secretKey = new TextEncoder().encode("blogappsecretkey");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;
  const isPublic = path === "/login" || path === "/sign-up" || path==="/" || path === "/blogs" || path === "/writers" ;

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      const role = payload.role;

      if (isPublic) {
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        if (role === "writer") {
          return NextResponse.redirect(new URL("/writer", request.url));
        }
        if (role === "reader") {
          return NextResponse.redirect(new URL("/reader", request.url));
        }
      }
      if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }
      if (path.startsWith("/writer") && role !== "writer") {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }
      if (path.startsWith("/reader") && role !== "reader") {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/login",
    "/sign-up",
    "/admin/:path*",
    "/writer/:path*",
    "/reader/:path*",
    "/",
    "/blogs",
    "/writers",
  ],
};
