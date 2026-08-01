// lib/schema/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  password: z.string().min(1, "پسورد الزامی هست"),
});

export const registerSchema = z
  .object({
    phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
    password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر باشد"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "رمز عبور تکرار نشده",
    path: ["confirm_password"],
  });

export const RequestOtpSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  otp_type: z.enum(["otp", "forget_password"]),
});

export const tokenVerifySchema = z.object({
  token: z.string().min(1, "توکن الزامی هست"),
});

export const verifyForgetPasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, "کد اعتبار سنجی الزامی هست")
      .max(6, "کد اعتبارسنجی ۶ رقمی میباشد"),
    password: z.string().min(1, "پسورد جدید الزامی هست"),
    confirm_password: z.string().min(1, "تایید پسورد  جدید الزامی هست"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "عدم تطابق رمز عبور",
    path: ["confirm_password"],
  });

export const VerifyOtpPhoneSchema = z.object({
  otp: z
    .string()
    .min(1, "کد تایید الزامی هست")
    .max(6, "کد تایید حداکثر ۶ رقمی هست"),
});

export type VerifyOtpPhoneInput = z.infer<typeof VerifyOtpPhoneSchema>;
export type verifyForgetPasswordInput = z.infer<
  typeof verifyForgetPasswordSchema
>;
export type tokenVerify = z.infer<typeof tokenVerifySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;
