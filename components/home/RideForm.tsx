// components/home/RideForm.tsx
"use client";

import React, { useEffect, useState } from "react";

interface TripType {
  id: number;
  trip_name: string;
}

// مپ رنگ‌ها برای هر نوع سرویس
const serviceColorMap: Record<string, string> = {
  'اتوبوس': 'green',
  'مینی بوس': 'blue',
  'ون': 'purple',
  'میدل باس': 'orange',
  'سواری': 'purple',
  'وانت': 'orange',
  'VIP': 'purple',
};

// مپ قیمت‌ها (می‌تونید از API هم بیارید)
// const servicePriceMap: Record<string, string> = {
//   'اتوبوس': 'از 15,000 تومان',
//   'مینی بوس': 'از 25,000 تومان',
//   'ون': 'از 35,000 تومان',
//   'میدل باس': 'از 45,000 تومان',
//   'سواری': 'از 20,000 تومان',
//   'وانت': 'از 30,000 تومان',
//   'VIP': 'از 50,000 تومان',
// };

const iconBg: Record<string, string> = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

const priceColor: Record<string, string> = {
  green: "text-green-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
};

const RideForm = () => {
  const [tripTypes, setTripTypes] = useState<TripType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null);

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      pickup: formData.get('pickup'),
      destination: formData.get('destination'),
      serviceType: selectedTrip || formData.get('service-type'),
      passengers: formData.get('passengers'),
      date: formData.get('date'),
      time: formData.get('time'),
      description: formData.get('description'),
    };
    
    console.log('فرم ارسال شد:', data);
    // TODO: ارسال به بک‌اند
  };

  useEffect(() => {
    const fetchTripTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/v1/trip/trip_type");
        if (!response.ok) {
          throw new Error(`خطا در دریافت اطلاعات (کد: ${response.status})`);
        }

        const data = await response.json();
        setTripTypes(data);
        
        // انتخاب اولین سرویس به عنوان پیش‌فرض
        if (data.length > 0) {
          setSelectedTrip(data[0].id);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "خطا در ارتباط با سرور"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTripTypes();
  }, []);

  // نمایش حالت بارگذاری
  if (loading) {
    return (
      <div className="relative -mt-32 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 text-lg">در حال بارگذاری...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // نمایش حالت خطا
  if (error) {
    return (
      <div className="relative -mt-32 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-bold text-red-600 mb-2">خطا در بارگذاری</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  className="w-full border-2 border-purple-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
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
                  className="w-full border-2 border-purple-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            {/* نوع سرویس - داینامیک از API */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                انتخاب نوع سرویس
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tripTypes.map((trip, index) => {
                  // دریافت رنگ مناسب برای این سرویس
                  const color = serviceColorMap[trip.trip_name] || 'blue';
                  // const price = servicePriceMap[trip.trip_name] || 'از 20,000 تومان';
                  
                  return (
                    <label key={trip.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="service-type"
                        value={trip.id}
                        checked={selectedTrip === trip.id}
                        onChange={() => setSelectedTrip(trip.id)}
                        className="hidden peer"
                      />
                      <div className={`border-2 rounded-xl p-4 text-center transition-all hover:border-purple-400 peer-checked:border-purple-500 peer-checked:bg-purple-50 ${
                        selectedTrip === trip.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                      }`}>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            iconBg[color]
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
                          {trip.trip_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {trip.trip_name}
                        </div>
                        {/* <div className={`text-sm font-bold mt-1 ${priceColor[color]}`}>
                          {price}
                        </div> */}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* گزینه‌های اضافی */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  تعداد مسافران
                </label>
                <select 
                  name="passengers"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
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
                  name="date"
                  className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  زمان سفر
                </label>
                <input
                  type="time"
                  name="time"
                  className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            {/* توضیحات */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                توضیحات اضافی (اختیاری)
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="لطفا در صورت نیاز توضیحات خود را وارد کنید..."
                className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
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