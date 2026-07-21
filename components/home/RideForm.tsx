// components/home/RideForm.tsx
"use client";

import React from "react";

const services = [
  {
    value: "economy",
    title: "اقتصادی",
    sub: "اقتصادی",
    price: "از 15,000 تومان",
    color: "green",
  },
  {
    value: "standard",
    title: "معمولی",
    sub: "معمولی",
    price: "از 25,000 تومان",
    color: "blue",
  },
  {
    value: "vip",
    title: "ویژه",
    sub: "VIP",
    price: "از 45,000 تومان",
    color: "purple",
  },
  {
    value: "van",
    title: "وانت",
    sub: "باربری",
    price: "از 35,000 تومان",
    color: "orange",
  },
];

const iconBg: Record<string, string> = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};
// const priceColor: Record<string, string> = {
//   green: "text-green-600",
//   blue: "text-blue-600",
//   purple: "text-purple-600",
//   orange: "text-orange-600",
// };

const RideForm = () => {
  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: ارسال به بک‌اند
  };
  return (
    <div className="relative -mt-32 z-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* مبدأ و مقصد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  مبدأ
                </label>
                <input
                  type="text"
                  name="pickup"
                  placeholder="نقطه سوار شدن را وارد کنید..."
                  required
                  className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  مقصد
                </label>
                <input
                  type="text"
                  name="destination"
                  placeholder="نقطه پیاده شدن را وارد کنید..."
                  required
                  className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* نوع سرویس */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                انتخاب نوع سرویس
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((s, i) => (
                  <label key={s.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="service-type"
                      value={s.value}
                      defaultChecked={i === 0}
                      className="hidden peer"
                    />
                    <div className="border-2 rounded-xl p-4 text-center transition-all hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-50">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          iconBg[s.color]
                        }`}
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="font-semibold text-gray-800">
                        {s.title}
                      </div>
                      <div className="text-xs text-gray-500">{s.sub}</div>
                      {/* <div
                        className={`text-sm font-bold mt-1 ${
                          priceColor[s.color]
                        }`}
                      >
                        {s.price}
                      </div> */}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* گزینه‌های اضافی */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  تعداد مسافران
                </label>
                <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none">
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} نفر
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  تاریخ سفر
                </label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  زمان سفر
                </label>
                <input
                  type="time"
                  className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* توضیحات */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                توضیحات اضافی (اختیاری)
              </label>
              <textarea
                rows={3}
                placeholder="لطفا در صورت نیاز توضیحات خود را وارد کنید..."
                className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ثبت سفارش سفر
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RideForm;
