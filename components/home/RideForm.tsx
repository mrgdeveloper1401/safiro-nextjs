// components/home/RideForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Bus,
  CalendarDays,
  Clock3,
  FileText,
  Sparkles,
  CheckCircle2,
  Zap,
  CalendarClock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Point {
  lat: number;
  lng: number;
  address?: string;
}

interface TripType {
  id: number;
  trip_name: string;
}

interface RideFormProps {
  token: string;
  origin: Point | null;
  destination: Point | null;
  onTripCreated?: (id: number) => void;
}

type TripMode = "now" | "reserve";
type SubmitStatus = "idle" | "loading" | "success" | "error";

const serviceColorMap: Record<string, string> = {
  اتوبوس: "green",
  "مینی بوس": "blue",
  ون: "purple",
  "میدل باس": "orange",
  سواری: "purple",
  وانت: "orange",
  VIP: "indigo",
};

const iconBg: Record<string, string> = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  indigo: "bg-indigo-100 text-indigo-600",
};

const selectedRing: Record<string, string> = {
  green: "border-green-500 bg-green-50 ring-green-100",
  blue: "border-blue-500 bg-blue-50 ring-blue-100",
  purple: "border-purple-500 bg-purple-50 ring-purple-100",
  orange: "border-orange-500 bg-orange-50 ring-orange-100",
  indigo: "border-indigo-500 bg-indigo-50 ring-indigo-100",
};

const getNowParts = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return { date, time };
};

const RideForm: React.FC<RideFormProps> = ({
  token,
  origin,
  destination,
  onTripCreated,
}) => {
  const [tripTypes, setTripTypes] = useState<TripType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null);
  const [tripMode, setTripMode] = useState<TripMode>("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");

  useEffect(() => {
    if (tripMode === "now") {
      const { date: d, time: t } = getNowParts();
      setDate(d);
      setTime(t);
    }
  }, [tripMode]);

  useEffect(() => {
    const fetchTripTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/trip/trip_type");
        if (!response.ok) throw new Error(`کد خطا: ${response.status}`);
        const data = await response.json();
        setTripTypes(data);
        if (data.length > 0) setSelectedTrip(data[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در ارتباط");
      } finally {
        setLoading(false);
      }
    };
    fetchTripTypes();
  }, []);

  const handleTripSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!selectedTrip) errors.push("نوع سرویس را انتخاب کنید");
    if (!origin) errors.push("مبدأ را روی نقشه انتخاب کنید");
    if (!destination) errors.push("مقصد را روی نقشه انتخاب کنید");
    if (tripMode === "reserve" && (!date || !time))
      errors.push("تاریخ و ساعت رزرو را مشخص کنید");

    if (errors.length > 0) {
      setSubmitMessage(errors.join("، "));
      setSubmitStatus("error");
      return;
    }

    const status = tripMode === "now" ? "pending" : "reserve";
    const dateStr = tripMode === "now" ? getNowParts().date : date;
    const timeStr = tripMode === "now" ? getNowParts().time : time;
    const departureTime = new Date(`${dateStr}T${timeStr}:00Z`).toISOString();

    const payload = {
      from_lat: origin.lat,
      from_lng: origin.lng,
      from_address: origin.address || "",
      to_lat: destination.lat,
      to_lng: destination.lng,
      to_address: destination.address || "",
      status,
      departure_time: departureTime,
      reserve_for_other: false,
      phone_reserve_for_other: "",
      description: (e.currentTarget as HTMLFormElement).description
        ?.value || "",
      trip_type: selectedTrip,
    };

    setSubmitStatus("loading");
    setSubmitMessage("");

    try {
      const res = await fetch("/api/v1/trip/create_trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || data.message || `خطای ${res.status}`
        );
      }

      setSubmitStatus("success");
      setSubmitMessage("سفارش شما با موفقیت ثبت شد!");
      if (data.id) onTripCreated?.(data.id);
    } catch (err) {
      setSubmitStatus("error");
      setSubmitMessage(
        err instanceof Error ? err.message : "خطا در ارسال درخواست"
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="mt-4 text-sm text-gray-500">در حال آماده‌سازی فرم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-xl">
        <div className="py-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-14 w-14 text-red-400" />
          <h3 className="text-lg font-bold text-red-600">خطا در بارگذاری</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl">
      <div className="border-b border-purple-50 bg-linear-to-l from-purple-50 via-white to-indigo-50 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              تکمیل اطلاعات سفر
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {origin && destination
                ? "مبدأ و مقصد مشخص شده — نوع سرویس و زمان را انتخاب کنید"
                : "ابتدا مبدأ و مقصد را روی نقشه انتخاب کنید"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleTripSubmit} className="space-y-7 p-5 sm:p-6">
        {/* حالت سفر */}
        <section>
          <div className="mb-3">
            <label className="text-sm font-bold text-gray-800">
              زمان انجام سفر
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTripMode("now")}
              className={`relative rounded-2xl border-2 p-4 text-right transition-all ${
                tripMode === "now"
                  ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100 shadow-sm"
                  : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
              }`}
            >
              {tripMode === "now" && (
                <span className="absolute left-2 top-2 text-purple-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              )}
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold text-gray-800">همین الان</div>
              <div className="mt-1 text-[11px] leading-5 text-gray-400">
                سفر فوری با نزدیک‌ترین زمان ممکن
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTripMode("reserve")}
              className={`relative rounded-2xl border-2 p-4 text-right transition-all ${
                tripMode === "reserve"
                  ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100 shadow-sm"
                  : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
              }`}
            >
              {tripMode === "reserve" && (
                <span className="absolute left-2 top-2 text-purple-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              )}
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold text-gray-800">رزرو سفر</div>
              <div className="mt-1 text-[11px] leading-5 text-gray-400">
                انتخاب تاریخ و ساعت دلخواه
              </div>
            </button>
          </div>
        </section>

        {/* نوع سرویس */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-gray-800">
              انتخاب نوع سرویس
            </label>
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-600">
              {tripTypes.length} گزینه
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {tripTypes.map((trip) => {
              const color = serviceColorMap[trip.trip_name] || "purple";
              const isSelected = selectedTrip === trip.id;
              return (
                <label key={trip.id} className="group cursor-pointer">
                  <input
                    type="radio"
                    name="service-type"
                    value={trip.id}
                    checked={isSelected}
                    onChange={() => setSelectedTrip(trip.id)}
                    className="sr-only"
                  />
                  <div
                    className={`relative h-full rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
                      isSelected
                        ? `${selectedRing[color]} ring-2 shadow-sm`
                        : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-2 top-2 text-purple-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                    <div
                      className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition ${iconBg[color]} ${
                        isSelected ? "scale-105" : "group-hover:scale-105"
                      }`}
                    >
                      <Bus className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {trip.trip_name}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400">
                      مناسب سفر شما
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* تاریخ و ساعت — فقط در حالت رزرو */}
        {tripMode === "reserve" ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <CalendarDays className="h-4 w-4 text-purple-500" />
                تاریخ سفر
              </label>
              <input
                type="date"
                name="date"
                required
                value={date}
                min={getNowParts().date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-purple-200 bg-purple-50/30 px-4 py-3 text-sm text-gray-700 outline-none transition focus:ring-4 focus:ring-purple-100"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <Clock3 className="h-4 w-4 text-purple-500" />
                ساعت سفر
              </label>
              <input
                type="time"
                name="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-purple-200 bg-purple-50/30 px-4 py-3 text-sm text-gray-700 outline-none transition focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </section>
        ) : (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs leading-6 text-emerald-700">
            سفر به‌صورت{" "}
            <span className="font-bold">فوری</span>{" "}
            ثبت می‌شود. زمان فعلی سیستم به‌عنوان زمان درخواست در نظر گرفته
            می‌شود.
          </div>
        )}

        {/* توضیحات */}
        <section className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <FileText className="h-4 w-4 text-purple-500" />
            توضیحات اضافی
            <span className="text-xs font-normal text-gray-400">(اختیاری)</span>
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="مثلاً: توقف کوتاه، تعداد چمدان، نیاز به صندلی کودک..."
            className="w-full resize-none rounded-xl border border-purple-200 bg-purple-50/30 px-4 py-3 text-sm text-gray-700 outline-none transition focus:ring-4 focus:ring-purple-100"
          />
        </section>

        {/* وضعیت ارسال */}
        {submitStatus === "success" && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle className="mb-1 inline h-5 w-5" />
            {submitMessage}
          </div>
        )}
        {submitStatus === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mb-1 inline h-5 w-5" />
            {submitMessage}
          </div>
        )}

        {/* دکمه */}
        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="group relative w-full overflow-hidden rounded-xl bg-linear-to-l from-purple-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:from-purple-400 disabled:to-indigo-400 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitStatus === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ثبت...
              </>
            ) : submitStatus === "success" ? (
              <>
                <CheckCircle className="h-4 w-4" />
                ثبت شد!
              </>
            ) : tripMode === "now" ? (
              <>
                درخواست سفر فوری
                <Sparkles className="h-4 w-4 opacity-90 transition group-hover:rotate-12" />
              </>
            ) : (
              <>
                ثبت رزرو سفر
                <Sparkles className="h-4 w-4 opacity-90 transition group-hover:rotate-12" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default RideForm;
