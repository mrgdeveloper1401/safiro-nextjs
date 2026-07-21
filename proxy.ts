import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { V1_PUBlIC_BASE_URL, isDev, response } from "./utils/config";
import { api } from "./lib/axios";
import { isAxiosError } from "axios";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { pathname } = request.nextUrl;

  const requestPath = [
    "/",
    "/profile",
    "/trip",
    "/trip/:path",
    "/order",
    "/order/:path",
    "/passenger",
  ];
  if (!token && requestPath.includes(pathname)) {
    return response.redirect(new URL("/login", request.url));
  } else {
    // create request for valid token
    try {
      const devReqUrl = `http://localhost:8000/v1/api/auth/token/verify/`;
      const prodReqUrl = `${V1_PUBlIC_BASE_URL}/api/auth/token/verify/`;
      const reqUrl = isDev ? devReqUrl : prodReqUrl;

      await api.post(reqUrl, { token });
      return response.next();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        const res = response.redirect(new URL("/login", request.url));
        res.cookies.delete("token");
        return res;
      }
    }
  }

  return response.next();
}

export const config = {
  mathcer: [
    "/",
    "/profile",
    "/trip",
    "/trip/:path",
    "/order",
    "/order/:path",
    "/passenger",
  ],
};
