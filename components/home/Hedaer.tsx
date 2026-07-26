// components/home/Header.tsx
"use client";

import { logout } from "@/app/actions/auth";
import { UserType } from "@/types/auth";
import Link from "next/link";
import { useState, useTransition } from "react";

const quickLinks = ["درباره ما", "پشتیبانی", "قوانین", "تماس با ما"];
const mobileLinks = [
  "خانه",
  "درباره ما",
  "خدمات",
  "پشتیبانی",
  "قوانین",
  "تماس با ما",
];
const stats = [
  { value: "+۵۰٬۰۰۰", label: "سفر موفق" },
  { value: "+۱٬۰۰۰", label: "راننده حرفه‌ای" },
  { value: "۲۴/۷", label: "پشتیبانی" },
  { value: "⭐ ۴.۸", label: "امتیاز کاربران" },
];

interface HeaderProps {
  user: UserType | null;
}

const Header = ({ user }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const roleLabel = user?.is_driver
    ? "راننده"
    : user?.is_passenger
    ? "مسافر"
    : "کاربر";
  const dashboardHref = user?.is_driver ? "/driver" : "/passenger";

  const handleLogout = () => {
    startTransition(async () => await logout());
  };

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-indigo-800 to-purple-900" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        {/* نوار بالا */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href={"/"} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">
                  سفیرو
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-6 text-white/80">
                {quickLinks.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3 text-white/70 text-sm">
                  <div className="flex items-center gap-1">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-1">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>info@safir.com</span>
                  </div>
                </div>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 text-white"
                    >
                      <span className="w-8 h-8 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-bold">
                        {user.username?.[0]?.toUpperCase() ?? "؟"}
                      </span>
                      <span dir="ltr" className="text-sm font-medium">
                        {user.phone}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-50 text-gray-800">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <div
                            dir="ltr"
                            className="font-semibold text-sm text-right"
                          >
                            {user.phone}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {roleLabel}
                          </div>
                        </div>
                        <Link
                          href={dashboardHref}
                          className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          داشبورد من
                        </Link>
                        <Link
                          href="/trips"
                          className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          سفرهای من
                        </Link>
                        <button
                          onClick={handleLogout}
                          disabled={isPending}
                          className="block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 w-full hover:cursor-pointer"
                        >
                          {isPending ? 'در حال خروج': "خروج از حساب"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="group relative px-5 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 overflow-hidden text-white">
                      ورود/ثبت نام
                    </button>
                  </Link>
                )}

                <button
                  onClick={() => setMenuOpen(true)}
                  className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* منوی موبایل */}
        <div
          className={`fixed inset-0 bg-black/95 z-50 md:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-white font-bold text-xl">سفیر</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-lg"
              >
                <svg
                  className="w-6 h-6"
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
            </div>
            <nav className="space-y-4">
              {mobileLinks.map((l) => (
                <Link
                  key={l}
                  href="#"
                  className="block text-white/80 hover:text-white py-2 text-lg"
                >
                  {l}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <div className="border-t border-white/10 pt-4">
                <div className="text-white/60 text-sm space-y-2">
                  <div>📞 ۰۲۱-۱۲۳۴۵۶۷۸</div>
                  <div>✉️ info@safir.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-6 animate-fade-in-up">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
                🚗 همراه مطمئن سفرهای شهری
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                سفر کن با{" "}
                <span className="bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  سفیرو
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                سریع‌ترین و امن‌ترین سرویس درخواست خودرو در شهر
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                    {s.value}
                  </div>
                  <div className="text-sm text-white/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* موج پایین */}
        <div className="relative">
          <svg
            className="absolute bottom-0 w-full h-12 md:h-16 text-gray-50"
            preserveAspectRatio="none"
            viewBox="0 0 1440 120"
          >
            <path
              fill="currentColor"
              d="M0,32L80,42.7C160,53,320,75,480,80C640,85,800,75,960,69.3C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
