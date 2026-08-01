// api/v1/trip/[id]/route.ts

import { api } from "@/lib/axios";
import { cancelTripSchema } from "@/lib/schema/trip";
import { response } from "@/utils/config";
import { isAxiosError } from "axios";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // get id
    const { id } = await params;

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
    const validateData = cancelTripSchema.safeParse(body);
    if (!validateData.success) {
      return response.json(
        validateData.error.issues.map((err) => ({
          message: err.message,
        })),
        { status: 400 }
      );
    }

    const resData = await api.patch(`api/trip/trips/${id}/`, validateData.data, {
      headers: {
        Authorization: token,
      },
    });
    return response.json(resData.data, { status: 200 });
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
