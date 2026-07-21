// api/v1/auth/register
import { api } from "@/lib/axios";
import { registerSchema } from "@/lib/schema/auth";
import { V1_PUBlIC_BASE_URL, isDev, response } from "@/utils/config";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // request url
    const reqUrl = isDev
      ? "http://localhost:8000/v1/api/auth/sing_up_by_phone/"
      : `${V1_PUBlIC_BASE_URL}/api/auth/sing_up_by_phone/`;

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
    const validateData = registerSchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }

    // request backend
    const resData = await api.post(reqUrl, validateData.data);
    if (resData.status !== 201) {
      return response.json(
        {
          message: resData.data?.message || "خطا",
          detail: resData.data?.detail || "حطا",
        },
        {
          status: resData.status,
        }
      );
    }

    // save token in cookie
    const cookieStore = await cookies();
    cookieStore.set("token", resData.data?.result?.token?.access_token, {
      httpOnly: true,
      secure: isDev ? false : true,
      sameSite: "lax",
      maxAge: resData.data?.result.token?.access_token_life_time,
    });

    return response.json(
      {
        mobile: resData.data?.result?.mobile,
        is_staff: resData.data?.result?.is_staff,
        is_verify_phone: resData.data?.result?.is_verify_phone,
        is_passenger: resData.data?.result?.is_passenger,
        is_driver: resData.data?.result?.is_driver,
      },
      { status: resData.status }
    );
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
