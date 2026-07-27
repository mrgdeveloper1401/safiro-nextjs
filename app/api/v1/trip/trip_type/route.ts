// api/v1/trip/trip_type

import { api } from "@/lib/axios";
import { response } from "@/utils/config";
import { isAxiosError } from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await api.get("api/trip/trip_type");
    return response.json(res.data?.result);

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
