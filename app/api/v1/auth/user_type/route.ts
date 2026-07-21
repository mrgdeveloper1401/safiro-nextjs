// api/v1/auth/user_type/route.ts
import { api } from "@/lib/axios";
import { V1_PUBlIC_BASE_URL, isDev, response } from "@/utils/config";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // request
    const devReqUrl = `http://localhost:8000/v1/api/auth/user_type/`;
    const prodReqUrl = `${V1_PUBlIC_BASE_URL}/api/auth/user_type/`;
    const reqUrl = isDev ? devReqUrl : prodReqUrl;

    // token
    const token = request.headers
      .get("Authorization")
      ?.split("Bearer")[1]
      .trim();
    if (!token) {
      return response.json(
        {
          sucess: false,
          detail: "Authentication credentials were not provided.",
        },
        {
          status: 401,
        }
      );
    }

    // request backend
    const resData = await api.get(reqUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = resData.data[0];
    return response.json(data, { status: resData.status });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return response.json(
        {
          detail: error.response.data.detail || "خطا",
        },
        {
          status: error.response.status,
        }
      );
    }

    return response.json({ message: "Unexpected error" }, { status: 500 });
  }
}
