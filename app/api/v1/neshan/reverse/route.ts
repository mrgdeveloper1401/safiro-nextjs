// api/v1/neshan/reverse

import { api } from "@/lib/axios";
import { reverseGeocodeSchema } from "@/lib/schema/trip";
import { response } from "@/utils/config";
import { isAxiosError } from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // check token
    const token = request.headers.get("Authorization");
    if (!token) {
      return response.json({
        detail: "Authentication credentials were not provided.",
        code: "not_authenticated",
      });
    }

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
    const validateData = reverseGeocodeSchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }

    // request backend and
    const resData = await api.post(
      "api/trip/reverse_geocode",
      validateData.data,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json(resData.data?.result);
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
