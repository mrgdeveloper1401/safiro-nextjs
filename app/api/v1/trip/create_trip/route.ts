// api/v1/trip/create_trip/route.ts
import { api } from "@/lib/axios";
import { ceateTripSchema } from "@/lib/schema/trip";
import { response } from "@/utils/config";
import { isAxiosError } from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // check token
    const token = request.headers.get("Authorization");
    if (!token) {
      return response.json(
        {
          detail: "Authentication credentials were not provided.",
        },
        {
          status: 401,
        }
      );
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

    //  validate data
    const validateData = ceateTripSchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }

    const resData = await api.post("api/trip/trips/", validateData.data, {
      headers: {
        Authorization: token,
      },
    });
    return response.json(resData.data, { status: 201 });
  } catch (error) {
    if (isAxiosError(error)) {
      return response.json(
        {
          detail: error.response?.data?.detail,
          code: error.response?.data?.code,
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
