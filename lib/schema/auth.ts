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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;
