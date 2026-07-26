import { NextRequest, NextResponse } from "next/server";
import { DOMAIN_URL, isDev } from "./utils/config";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const selfApi = "http://localhost:3000/api/v1/auth/token_verify";
  const slefHttpsApi = `${DOMAIN_URL}/api/v1/auth/token_verify`;
  const reqUrl = isDev ? selfApi : slefHttpsApi;
  const res = await fetch(reqUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: token }),
  });

  if (res.status !== 200) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/trip",
    "/trip/:path*",
    "/order",
    "/order/:path*",
    "/passenger",
  ],
};
