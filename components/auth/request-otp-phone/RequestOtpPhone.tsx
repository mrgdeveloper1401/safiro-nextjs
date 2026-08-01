// components/auth/request-otp-phone/RequestOtpPhone.tsx
'use client'


import { selfApi, slefHttpsApi } from "@/lib/axios";
import { RequestOtpInput, RequestOtpSchema } from "@/lib/schema/auth";
import { isDev } from "@/utils/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const RequestOtpPhone = () => {
  const router = useRouter();
  const otpForm = useForm<RequestOtpInput>({
    resolver: zodResolver(RequestOtpSchema),
    defaultValues: { otp_type: "otp" },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = otpForm;

  const onSubmit = async (data: RequestOtpInput) => {
    try {
      // روت هندلر شماره رو توی کوکی httpOnly ست می‌کنه
      const selfReqUrl = isDev ? selfApi : slefHttpsApi;
      await selfReqUrl.post("/api/v1/auth/request-otp", data);
      // بعد از ارسال کد، به صفحه تایید کد هدایت می‌شود
      router.push("/verify-otp-phone");
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          otpForm.setError("root", {
            message: "کاربری با این شماره یافت نشد",
          });
        } else if (status === 429) {
          otpForm.setError("root", {
            message: "تعداد درخواست‌ها زیاد است، کمی صبر کنید",
          });
        } else if (status === 500) {
          otpForm.setError("root", { message: "خطای سرور" });
        } else if (status === 403) {
          otpForm.setError("root", { message: "خطای دسترسی" });
        } else {
          otpForm.setError("root", {
            message: "خطایی رخ داد، دوباره تلاش کنید",
          });
        }
      } else {
        otpForm.setError("root", { message: "خطای ناشناخته" });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative">
        <button
          onClick={() => router.replace("/")}
          className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="border-b border-gray-200 p-6 text-center bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ارسال  کد تایید</h2>
          <p className="text-gray-600 mt-1 text-sm">
            شماره موبایل خود را وارد کنید تا کد تایید ارسال شود
          </p>
        </div>

        <div className="p-6">
          <form
            onSubmit={otpForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* شماره موبایل */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                شماره موبایل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full pr-10 pl-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                  placeholder="09xxxxxxxxx"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* otp_type مخفی و ثابت */}
            <input type="hidden" {...register("otp_type")} />

            {errors.root && (
              <p className="text-red-500 text-sm text-center">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "در حال ارسال کد..." : "ارسال کد تایید"}
            </button>
          </form>

          <div className="flex justify-between pt-4 w-[90%]">
            <Link href={"/register"} className="text-blue-500">
              ایجاد حساب
            </Link>
            <Link href={"/login"} className="text-blue-500">
              بازگشت به ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
