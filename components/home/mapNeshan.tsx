"use client";

import { useEffect, useRef, useState } from "react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { mapKey } from "@/utils/config";
import { reverseGeocode, type ReverseResult } from "@/utils/neshan";
import { MapPin, Navigation, RotateCcw, Loader2, Locate } from "lucide-react";

// نوع داده مختصات و آدرس یک نقطه انتخاب شده روی نقشه
type Point = {
  lat: number;
  lng: number;
  address?: string;
};

// ورودی‌های کامپوننت: توکن، و کال‌بک‌ها برای ارسال مبدا و مقصد به کامپوننت والد
type Props = {
  token?: string;
  onOriginChange?: (point: Point | null) => void;
  onDestinationChange?: (point: Point | null) => void;
};

// حالت انتخاب: مبدا، مقصد، یا هیچکدام
type SelectingMode = "origin" | "destination" | null;

export default function MapNeshan({
  token,
  onOriginChange,
  onDestinationChange,
}: Props) {
  // ref نگهدارنده المنت DOM برای رندر نقشه
  const mapContainer = useRef<HTMLDivElement>(null);
  // ref نگهدارنده نمونه نقشه Neshan برای دسترسی خارج از useEffect
  const mapRef = useRef<InstanceType<typeof nmp_mapboxgl.Map> | null>(null);
  // ref نگهدارنده مارکر سبز مبدأ (قابل جابه‌جا)
  const originMarkerRef = useRef<InstanceType<
    typeof nmp_mapboxgl.Marker
  > | null>(null);
  // ref نگهدارنده مارکر قرمز مقصد (قابل جابه‌جا)
  const destinationMarkerRef = useRef<InstanceType<
    typeof nmp_mapboxgl.Marker
  > | null>(null);
  // ref نگهدارنده مارکر آبی موقعیت فعلی کاربر (غیرقابل جابه‌جا)
  const userMarkerRef = useRef<InstanceType<typeof nmp_mapboxgl.Marker> | null>(
    null
  );
  // ref نگه‌دارنده حالت انتخاب در زمان کلیک (جلوگیری از closure قدیمی در useEffect)
  const selectingRef = useRef<SelectingMode>("origin");

  // حالت انتخاب فعلی: مبدا، مقصد یا هیچکدام
  const [selecting, setSelecting] = useState<SelectingMode>("origin");
  // داده مختصات و آدرس مبدا
  const [origin, setOrigin] = useState<Point | null>(null);
  // داده مختصات و آدرس مقصد
  const [destination, setDestination] = useState<Point | null>(null);
  // علامت‌گذاری اینکه کدام آدرس در حال دریافت است (برای نمایش لودینگ در کارت‌ها)
  const [loadingAddress, setLoadingAddress] = useState<
    "origin" | "destination" | null
  >(null);
  // مختصات موقعیت فعلی کاربر (از GPS)
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // وضعیت فعال‌بودن درخواست موقعیت مکانی (برای غیرفعال کردن دکمه)
  const [gettingLocation, setGettingLocation] = useState(false);

  // همگام‌سازی selectingRef با state انتخاب
  // (نیاز است چون click handler در useEffect مقدار بسته‌شده را می‌خواند)
  useEffect(() => {
    selectingRef.current = selecting;
  }, [selecting]);

  // ========== تابع دریافت موقعیت مکانی کاربر از GPS ==========
  const getUserLocation = () => {
    // جلوگیری از کلیک تکراری هنگام درخواست قبلی
    if (gettingLocation) return;
    setGettingLocation(true);

    // بررسی پشتیبانی مرورگر از geolocation API
    if (!navigator.geolocation) {
      alert("موقعیت مکانی توسط مرورگر پشتیبانی نمی‌شود.");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // موفقیت: دریافت لاتیتود و لانجیتود از پاسخ GPS
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // بررسی اینکه نقشه هنوز ساخته نشده باشد
        if (!mapRef.current) {
          setGettingLocation(false);
          alert("نقشه هنوز آماده نشده، لطفاً چند لحظه صبر کنید.");
          return;
        }

        // تنظیم مبدا روی موقعیت فعلی کاربر + دریافت آدرس معکوس
        await setPointWithAddress(
          "origin",
          latitude,
          longitude,
          mapRef.current
        );

        // حذف مارکر آبی قبلی اگر وجود دارد (جلوگیری از روی هم افتادن)
        if (userMarkerRef.current) userMarkerRef.current.remove();

        // ایجاد مارکر آبی برای نمایش موقعیت فعلی کاربر روی نقشه
        userMarkerRef.current = new nmp_mapboxgl.Marker({
          color: "#3b82f6",
          anchor: "bottom",
          scale: 1.3,
        })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        // حرکت نرم نقشه (fly) به موقعیت کاربر با زوم 14
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });

        setGettingLocation(false);
      },
      // هندل خطاهای geolocation با پیام‌های فارسی
      (error) => {
        setGettingLocation(false);

        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "دسترسی به موقعیت مکانی رد شد.\n" +
              "لطفاً مجوز Location را در تنظیمات مرورگر فعال کنید، یا مبدأ را به صورت دستی روی نقشه انتخاب کنید."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert(
            "سرویس موقعیت مکانی در دسترس نیست.\n" +
              "لطفاً GPS دستگاه و اتصال اینترنت خود را بررسی کنید، یا مبدأ را روی نقشه به صورت دستی انتخاب کنید."
          );
        } else {
          // TIMEOUT یا خطای نامشخص (مانند خطای 403 گوگل)
          alert(
            "خطا در دریافت موقعیت مکانی.\n" +
              "لطفاً دوباره تلاش کنید یا مبدأ را روی نقشه به صورت دستی انتخاب کنید."
          );
        }
      },
      // تنظیمات geolocation: دقت بالا، تایم‌آوت 10 ثانیه، کش قبلی نامعتبر
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ========== تنظیم نقطه روی نقشه و دریافت آدرس معکوس ==========
  const setPointWithAddress = async (
    type: "origin" | "destination",
    lat: number,
    lng: number,
    map: InstanceType<typeof nmp_mapboxgl.Map>
  ) => {
    // ایجاد شی‌ه اولیه با متن لودینگ برای آدرس
    const point: Point = { lat, lng, address: "در حال دریافت آدرس..." };

    // تنظیم state مبدا یا مقصد + ارسال به کامپوننت والد + ایجاد/بروزرسانی مارکر
    if (type === "origin") {
      setOrigin(point);
      onOriginChange?.(point);
      upsertMarker("origin", lng, lat, map);
    } else {
      setDestination(point);
      onDestinationChange?.(point);
      upsertMarker("destination", lng, lat, map);
    }

    // شروع حالت لودینگ آدرس
    setLoadingAddress(type);

    // درخواست آدرس معکوس (reverse geocode) از سرویس Neshan
    const result: ReverseResult | null = await reverseGeocode(lat, lng, token);
    const address = result?.formatted_address || "آدرس یافت نشد";
    const finalPoint = { lat, lng, address };

    // بروزرسانی state با آدرس نهایی (فقط اگر مختصات هنوز همان باشد تا از race condition جلوگیری شود)
    if (type === "origin") {
      setOrigin((prev) =>
        prev && prev.lat === lat && prev.lng === lng ? finalPoint : prev
      );
      onOriginChange?.(finalPoint);
    } else {
      setDestination((prev) =>
        prev && prev.lat === lat && prev.lng === lng ? finalPoint : prev
      );
      onDestinationChange?.(finalPoint);
    }

    // پایان لودینگ آدرس
    setLoadingAddress(null);
  };

  // ========== ایجاد یا بروزرسانی مارکر مبدأ یا مقصد ==========
  const upsertMarker = (
    type: "origin" | "destination",
    lng: number,
    lat: number,
    map: InstanceType<typeof nmp_mapboxgl.Map>
  ) => {
    const isOrigin = type === "origin";
    // انتخاب ref مارکر مناسب (سبز برای مبدأ، قرمز برای مقصد)
    const markerRef = isOrigin ? originMarkerRef : destinationMarkerRef;
    // رنگ مارکر: سبز برای مبدأ، قرمز برای مقصد
    const color = isOrigin ? "#16a34a" : "#dc2626";

    if (!markerRef.current) {
      // اولین بار: ایجاد مارکر جدید و قابل جابه‌جا
      const marker = new nmp_mapboxgl.Marker({ color, draggable: true })
        .setLngLat([lng, lat])
        .addTo(map);

      // هنگام رها کردن مارکر بعد از کشیدن، مختصات جدید را اعمال کن
      marker.on("dragend", async () => {
        const lngLat = marker.getLngLat();
        // بررسی امنیت: نقشه هنوز وجود داشته باشد
        if (!mapRef.current) return;

        await setPointWithAddress(
          isOrigin ? "origin" : "destination",
          lngLat.lat,
          lngLat.lng,
          mapRef.current
        );
      });

      markerRef.current = marker;
    } else {
      // مارکر قبلاً وجود دارد: فقط مختصات را به‌روز کن
      markerRef.current.setLngLat([lng, lat]);
    }
  };

  // ========== ساخت نمونه نقشه Neshan ==========
  useEffect(() => {
    // جلوگیری از ساخت دوباره
    if (!mapContainer.current || mapRef.current) return;

    // محدوده شهری نقشه این جا مربوط به کل استان تهران است
    const tehranProvinceBounds = [
      [50.18, 34.88], // southwest: [lng, lat]
      [53.33, 36.32], // northeast: [lng, lat]
    ];

    const map = new nmp_mapboxgl.Map({
      mapKey: mapKey,
      container: mapContainer.current,
      center: [51.2, 35.85],
      zoom: 11,
      pitch: 0,
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      poi: true,
      traffic: true,
      maxBounds: tehranProvinceBounds,
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      mapTypeControllerOptions: { show: true, position: "bottom-left" },
    });

    mapRef.current = map;

    // پاکسازی هنگام غیرفعال شدن کامپوننت
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      mapRef.current = null;
      originMarkerRef.current = null;
      destinationMarkerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  // ========== هندل کلیک روی نقشه برای انتخاب مبدا یا مقصد ==========
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = async (e: { lngLat: { lng: number; lat: number } }) => {
      // خواندن حالت انتخاب از ref (مقدار لحظه‌ای و به‌روز)
      const mode = selectingRef.current;
      if (!mode) return;

      const { lng, lat } = e.lngLat;

      if (mode === "origin") {
        // اگر حالت انتخاب مبدا بود، مبدا را تنظیم کن و سپس حالت را به مقصد تغییر بده
        await setPointWithAddress("origin", lat, lng, map);
        setSelecting("destination");
      } else {
        // اگر حالت انتخاب مقصد بود، مقصد را تنظیم کن و سپس حالت انتخاب را تمام کن
        await setPointWithAddress("destination", lat, lng, map);
        setSelecting(null);
      }
    };

    map.on("click", handleClick);

    // پاکسازی ایونت لیسنر هنگام تغییر وابستگی‌ها یا غیرفعال شدن کامپوننت
    return () => {
      map.off("click", handleClick);
    };
  }, [token]);

  // ========== بروزرسانی مارکرها هنگام تغییر مختصات مبدأ یا مقصد ==========
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (origin) upsertMarker("origin", origin.lng, origin.lat, map);
    if (destination)
      upsertMarker("destination", destination.lng, destination.lat, map);
  }, [origin, destination]);

  // ========== پاک کردن مبدا ==========
  const clearOrigin = () => {
    setOrigin(null);
    onOriginChange?.(null);
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    // پس از پاک کردن، حالت انتخاب به مبدا بازمی‌گردد
    setSelecting("origin");
  };

  // ========== پاک کردن مقصد ==========
  const clearDestination = () => {
    setDestination(null);
    onDestinationChange?.(null);
    destinationMarkerRef.current?.remove();
    destinationMarkerRef.current = null;
    setSelecting("destination");
  };

  // ========== پاک کردن همه (مبدا و مقصد) ==========
  const clearAll = () => {
    clearOrigin();
    clearDestination();
    setSelecting("origin");
  };

  // ========== متن وضعیت زیر عنوان (رابط کاربری فارسی) ==========
  const statusText =
    selecting === "origin"
      ? "روی نقشه بزنید یا مارکر سبز را جابه‌جا کنید"
      : selecting === "destination"
      ? "روی نقشه بزنید یا مارکر قرمز را جابه‌aja کنید"
      : origin && destination
      ? "مبدا و مقصد آماده است — می‌توانید مارکرها را تنظیم کنید"
      : "یک نقطه را انتخاب کنید";

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl">
      {/* ===== هدر: عنوان + دکمه‌های کنترل ===== */}
      <div className="flex flex-col gap-3 border-b border-purple-50 bg-linear-to-l from-purple-50 to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-800 sm:text-lg">
            انتخاب مسیر روی نقشه
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            {statusText}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* دکمه موقعیت من: درخواست GPS + غیرفعال حین لودینگ */}
          <button
            type="button"
            onClick={getUserLocation}
            disabled={gettingLocation}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
              gettingLocation
                ? "cursor-wait bg-blue-100 text-blue-400"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {gettingLocation ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Locate className="h-3.5 w-3.5" />
            )}
            {gettingLocation ? "در حال دریافت..." : "موقعیت من"}
          </button>

          {/* دکمه انتخاب مبدا (سبز = فعال) */}
          <button
            type="button"
            onClick={() => setSelecting("origin")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
              selecting === "origin"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            مبدا
          </button>

          {/* دکمه انتخاب مقصد (قرمز = فعال) */}
          <button
            type="button"
            onClick={() => setSelecting("destination")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
              selecting === "destination"
                ? "bg-red-600 text-white shadow-md shadow-red-200"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            مقصد
          </button>

          {/* دکمه پاک کردن همه */}
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200 sm:text-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            پاک کردن
          </button>
        </div>
      </div>

      {/* ===== کانتینر نقشه ===== */}
      <div className="relative">
        <div ref={mapContainer} className="h-85 w-full sm:h-105 lg:h-120" />

        {/* بج وضعیت شناور روی نقشه (مبدا سبز / مقصد قرمز / مسیر بنفش) */}
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur">
          {selecting === "origin" && (
            <span className="flex items-center gap-1.5 text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              در حال انتخاب مبدا
            </span>
          )}
          {selecting === "destination" && (
            <span className="flex items-center gap-1.5 text-red-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              در حال انتخاب مقصد
            </span>
          )}
          {!selecting && origin && destination && (
            <span className="flex items-center gap-1.5 text-purple-700">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              مسیر انتخاب شد
            </span>
          )}
        </div>
      </div>

      {/* ===== کارت اطلاعات مبدأ و مقصد ===== */}
      <div className="grid grid-cols-1 gap-3 border-t border-purple-50 bg-gray-50/80 p-4 md:grid-cols-2">
        {/* کارت مبدا */}
        <div
          className={`rounded-xl border bg-white p-3.5 transition ${
            selecting === "origin"
              ? "border-green-400 ring-2 ring-green-100"
              : "border-green-100"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-green-800">مبدا</span>
            </div>
            {origin && (
              <button
                type="button"
                onClick={clearOrigin}
                className="text-xs text-green-600 hover:underline"
              >
                پاک کردن
              </button>
            )}
          </div>

          {origin ? (
            <>
              <div className="min-h-10 text-sm leading-6 text-gray-800">
                {loadingAddress === "origin" ? (
                  <span className="inline-flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    در حال دریافت آدرس...
                  </span>
                ) : (
                  origin.address || "آدرس موجود نیست"
                )}
              </div>
              <div
                className="mt-2 font-mono text-[11px] text-gray-400"
                dir="ltr"
              >
                {origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">هنوز انتخاب نشده</p>
          )}
        </div>

        {/* کارت مقصد */}
        <div
          className={`rounded-xl border bg-white p-3.5 transition ${
            selecting === "destination"
              ? "border-red-400 ring-2 ring-red-100"
              : "border-red-100"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Navigation className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-red-800">مقصد</span>
            </div>
            {destination && (
              <button
                type="button"
                onClick={clearDestination}
                className="text-xs text-red-600 hover:underline"
              >
                پاک کردن
              </button>
            )}
          </div>

          {destination ? (
            <>
              <div className="min-h-10 text-sm leading-6 text-gray-800">
                {loadingAddress === "destination" ? (
                  <span className="inline-flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    در حال دریافت آدرس...
                  </span>
                ) : (
                  destination.address || "آدرس موجود نیست"
                )}
              </div>
              <div
                className="mt-2 font-mono text-[11px] text-gray-400"
                dir="ltr"
              >
                {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">هنوز انتخاب نشده</p>
          )}
        </div>
      </div>
    </div>
  );
}
