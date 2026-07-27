// app/(auth)/request-forget-password/page.tsx
import RequestForgetPassword from "@/components/auth/request-otp/RequestForgetPassword";
import { DOMAIN_URL, isDev } from "@/utils/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const requestForgetPassword = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {    
    const selfApi = "http://localhost:3000/api/v1/auth/token_verify";
    const slefHttpsApi = `${DOMAIN_URL}/api/v1/auth/token_verify`;
    const reqUrl = isDev ? selfApi : slefHttpsApi;

    const res = await fetch(reqUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });
    if (res.ok) {
      return redirect("/");
    }
  }

  return <RequestForgetPassword />;
};

export default requestForgetPassword;
