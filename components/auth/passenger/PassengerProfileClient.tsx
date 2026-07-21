"use client";

import { useState } from "react";
import {
  User,
  Star,
  Car,
  Wallet,
  LayoutDashboard,
  UserCog,
  Route,
  Zap,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { PassengerProfile } from "@/app/(auth)/passenger/page";

type SectionKey = "dashboard" | "personal-info" | "trips";

const NAV_ITEMS: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "داشبورد", icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: "personal-info", label: "اطلاعات شخصی", icon: <UserCog className="w-5 h-5" /> },
  { key: "trips", label: "سفرهای من", icon: <Route className="w-5 h-5" /> },
];

export default function PassengerProfileClient({
  passenger,
}: {
  passenger: PassengerProfile;
}) {
  const [active, setActive] = useState<SectionKey>("dashboard");

  const fullName =
    `${passenger.user.first_name ?? ""} ${passenger.user.last_name ?? ""}`.trim() ||
    passenger.user.phone;

  const image = passenger.profile_image ?? passenger.user.image ?? null;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-8">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto bg-white/20 flex items-center justify-center overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={fullName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-3">{fullName}</h2>
              <p className="text-blue-100 text-sm mt-1">{passenger.user.phone}</p>
              <div className="flex gap-2 justify-center mt-3">
                {passenger.user.is_passenger !== false && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                    🚗 مسافر
                  </span>
                )}
                {passenger.user.is_driver && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                    👨‍✈️ راننده
                  </span>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active === item.key
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              {!passenger.user.is_driver && (
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <Zap className="w-5 h-5" />
                  <span>🚗 ثبت‌نام راننده</span>
                </button>
              )}

              <hr className="my-4 border-gray-100" />

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>خروج از حساب</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1">
          {active === "dashboard" && <DashboardSection passenger={passenger} />}
          {active === "personal-info" && <PersonalInfoSection passenger={passenger} />}
          {active === "trips" && <TripsSection />}
        </section>
      </div>
    </main>
  );
}

/* ---------- Sections ---------- */

function DashboardSection({ passenger }: { passenger: PassengerProfile }) {
  const rides = new Intl.NumberFormat("fa-IR").format(passenger.total_rides ?? 0);
  const rating = passenger.rating
    ? parseFloat(passenger.rating).toFixed(1)
    : "۰";
  const balance = new Intl.NumberFormat("fa-IR").format(
    parseFloat(passenger.wallet_balance ?? "0") || 0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">داشبورد</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox
          gradient="from-blue-500 to-blue-600"
          icon={<Car className="w-8 h-8" />}
          value={rides}
          label="سفرهای انجام‌شده"
        />
        <StatBox
          gradient="from-amber-500 to-orange-500"
          icon={<Star className="w-8 h-8" />}
          value={rating}
          label="امتیاز شما"
        />
        <StatBox
          gradient="from-emerald-500 to-green-600"
          icon={<Wallet className="w-8 h-8" />}
          value={`${balance} ت`}
          label="کیف پول"
        />
      </div>
    </div>
  );
}

function StatBox({
  gradient,
  icon,
  value,
  label,
}: {
  gradient: string;
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );
}

function PersonalInfoSection({ passenger }: { passenger: PassengerProfile }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">اطلاعات شخصی</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="نام" defaultValue={passenger.user.first_name} />
          <Field label="نام خانوادگی" defaultValue={passenger.user.last_name} />
          <Field
            label="شماره موبایل"
            defaultValue={passenger.user.phone}
            disabled
          />
          <Field
            label="ایمیل"
            type="email"
            defaultValue={passenger.user.email ?? ""}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  disabled = false,
}: {
  label: string;
  defaultValue?: string | null;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue ?? ""}
        disabled={disabled}
        className={`w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-100 text-gray-500" : ""
        }`}
      />
    </div>
  );
}

function TripsSection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">سفرهای من</h3>
      <div className="text-center text-gray-400 py-12">
        <Route className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>هیچ سفری یافت نشد</p>
      </div>
    </div>
  );
}
