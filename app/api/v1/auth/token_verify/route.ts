// api/v1/auth/token_verify
import { api } from "@/lib/axios";
import { tokenVerifySchema } from "@/lib/schema/auth";
import { response } from "@/utils/config";
import { isAxiosError } from "axios";
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

    // request backend
    const validateData = tokenVerifySchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }
    const token = validateData.data.token;
    const res = await api.post("api/auth/token/verify/", { token });
    if (res.status !== 200) {
      return response.json(
        {
          detail: res.data?.detail || "حطا",
        },
        {
          status: res.status,
        }
      );
    }

    return response.json({})

  } catch (error) {
    if (isAxiosError(error)) {
      return response.json(
        {
          detail: error.response?.data?.error,
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
