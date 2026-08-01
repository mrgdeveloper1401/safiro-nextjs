// api/v1/auth/request-otp/route.ts
import { api } from "@/lib/axios";
import { RequestOtpSchema } from "@/lib/schema/auth";
import { isDev, response } from "@/utils/config";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // request url
    // const reqUrl = isDev
    //   ? "http://localhost:8000/v1/api/auth/request_otp_phone/"
    //   : `${V1_PUBlIC_BASE_URL}/api/auth/request_otp_phone/`;

    //   check request body
    const body = await request.json();
    if (Object.keys(body).length === 0) {
      return response.json(
        {
          success: false,
          detail: "request body is required",
          message: "field_required",
        },
        {
          status: 400,
        }
      );
    }

    // request backend
    const validateData = RequestOtpSchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }
    const resData = await api.post('/api/auth/request_otp_phone/', validateData.data);

    const phone = resData.data?.result?.mobile;
    if (!phone) {
      return response.json(
        {
          success: false,
          detail: "شماره موبایل در پاسخ بک‌اند وجود ندارد",
        },
        {
          status: 502,
        }
      );
    }

    // save information in cookie
    const cookieStore = await cookies();

    cookieStore.set("phone", String(phone), {
      httpOnly: true,
      secure: !isDev,
      sameSite: "lax",
      maxAge: 120,
      path: "/",
    });

    return response.json({
      success: true,
      is_passenger: resData.data?.result?.is_passenger,
      is_driver: resData.data?.result?.is_driver,
      is_verify_phone: resData.data?.result?.is_verify_phone,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return response.json(
        {
          detail: error.response?.data?.detail,
        },
        {
          status: error.status,
        }
      );
    }
    return response.json(
      {
        message: (error as Error).message || "خطای سرور",
      },
      {
        status: 500,
      }
    );
  }
}
