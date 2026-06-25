import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { api } from "./utils/api";
import { persistor } from "./redux/store/store";

const refreshKey = new TextEncoder().encode(process.env.REFRESH_SECRET);
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const refToken = request.cookies.get("refreshToken")?.value;
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;
  const isPublic = path === "/login" || path === "/sign-up" || path === "/";
  await api.get("/me", {withCredentials: true})
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      const role = payload.role as string;

      if (isPublic) {
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        if (role === "user") {
          return NextResponse.redirect(new URL("/user", request.url));
        }
      }

      if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }

      if (path.startsWith("/user") && role !== "user") {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }

      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      persistor.purge();

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/sign-up", "/admin/:path*", "/user/:path*", "/"],
};
