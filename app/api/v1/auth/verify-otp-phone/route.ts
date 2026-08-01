// api/v1/auth/verify-otp-phone
import { api } from "@/lib/axios";
import { VerifyOtpPhoneSchema } from "@/lib/schema/auth";
import { isDev, response } from "@/utils/config";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    // validate data
    const cookieStore = await cookies();
    const phone = cookieStore.get("phone")?.value;
    if (!phone) {
      return response.json(
        {
          detail: "شماره موبایل یافت نشد",
        },
        {
          status: 404,
        }
      );
    }
    const validateData = VerifyOtpPhoneSchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }

    const payload = {
      ...validateData.data,
      phone,
    };

    // request backend
    const reqUrl = "api/auth/verify_otp/";
    const resData = await api.post(reqUrl, payload);

    // save token in cookie
    cookieStore.set("token", resData.data?.result?.token?.access_token, {
      httpOnly: true,
      secure: isDev ? false : true,
      sameSite: "lax",
      maxAge: resData.data?.result.token?.access_token_life_time,
    });

    return response.json({
      is_verify_phone: resData.data?.result?.is_verify_phone,
      is_staff: resData.data?.result?.is_staff,
      is_passenger: resData.data?.result?.is_passenger,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return response.json(
        {
          detail: error.response?.data,
        },
        {
          status: error.response?.status,
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
