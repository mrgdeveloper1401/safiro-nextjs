// components/home/mapNeshan.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { mapKey } from "@/utils/config";
import { reverseGeocode, type ReverseResult } from "@/utils/neshan";
import { cookies } from "next/headers";

type Point = {
  lat: number;
  lng: number;
  address?: string;
};

type SelectingMode = "origin" | "destination" | null;

const bounds: [[number, number], [number, number]] = [
  [51.0583, 35.5422],
  [51.6218, 35.8504],
];

export default function MapNeshan() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);

  const [selecting, setSelecting] = useState<SelectingMode>("origin");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [loadingAddress, setLoadingAddress] = useState<
    "origin" | "destination" | null
  >(null);

  // گرفتن توکن (اگر کلید توکنت فرق داره، اینجا تغییر بده)
  const getAuthToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  // تابع مشترک برای تنظیم نقطه + دریافت آدرس
  const setPointWithAddress = async (
    type: "origin" | "destination",
    lat: number,
    lng: number,
    map: any
  ) => {
    const point: Point = { lat, lng, address: "در حال دریافت آدرس..." };

    if (type === "origin") {
      setOrigin(point);
      upsertMarker("origin", lng, lat, map);
    } else {
      setDestination(point);
      upsertMarker("destination", lng, lat, map);
    }

    setLoadingAddress(type);

    const token = getAuthToken();
    if (!token) {
      console.warn("توکن یافت نشد");
      setLoadingAddress(null);
      return;
    }

    const result: ReverseResult | null = await reverseGeocode(lat, lng, token);
    const address = result?.formatted_address || "آدرس یافت نشد";

    if (type === "origin") {
      setOrigin((prev) =>
        prev && prev.lat === lat && prev.lng === lng
          ? { ...prev, address }
          : prev
      );
    } else {
      setDestination((prev) =>
        prev && prev.lat === lat && prev.lng === lng
          ? { ...prev, address }
          : prev
      );
    }

    setLoadingAddress(null);
  };

  // ساخت یا آپدیت مارکر
  const upsertMarker = (
    type: "origin" | "destination",
    lng: number,
    lat: number,
    map: any
  ) => {
    const isOrigin = type === "origin";
    const markerRef = isOrigin ? originMarkerRef : destinationMarkerRef;
    const color = isOrigin ? "#22c55e" : "#ef4444";

    if (!markerRef.current) {
      const marker = new nmp_mapboxgl.Marker({ color, draggable: true })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.on("dragend", async () => {
        const lngLat = marker.getLngLat();
        await setPointWithAddress(
          isOrigin ? "origin" : "destination",
          lngLat.lat,
          lngLat.lng,
          map
        );
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  };

  // مقداردهی اولیه نقشه
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new nmp_mapboxgl.Map({
      mapKey: mapKey,
      container: mapContainer.current,
      center: [51.389, 35.6892],
      zoom: 11,
      pitch: 0,
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      poi: true,
      traffic: true,
      maxBounds: bounds,
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      mapTypeControllerOptions: { show: true, position: "bottom-left" },
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      originMarkerRef.current = null;
      destinationMarkerRef.current = null;
    };
  }, []);

  // مدیریت کلیک روی نقشه
  const selectingRef = useRef(selecting);
  useEffect(() => {
    selectingRef.current = selecting;
  }, [selecting]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = async (e: any) => {
      const mode = selectingRef.current;
      if (!mode) return;

      const { lng, lat } = e.lngLat;

      if (mode === "origin") {
        await setPointWithAddress("origin", lat, lng, map);
        setSelecting("destination");
      } else if (mode === "destination") {
        await setPointWithAddress("destination", lat, lng, map);
        setSelecting(null);
      }
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, []);

  // همگام‌سازی مارکرها
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (origin) upsertMarker("origin", origin.lng, origin.lat, map);
    if (destination)
      upsertMarker("destination", destination.lng, destination.lat, map);
  }, [origin, destination]);

  const clearOrigin = () => {
    setOrigin(null);
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }
    setSelecting("origin");
  };

  const clearDestination = () => {
    setDestination(null);
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
    setSelecting("destination");
  };

  const clearAll = () => {
    clearOrigin();
    clearDestination();
    setSelecting("origin");
  };

  return (
    <div className="space-y-3">
      {/* کنترل‌ها */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelecting("origin")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            selecting === "origin"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          انتخاب مبدا
        </button>

        <button
          onClick={() => setSelecting("destination")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            selecting === "destination"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          انتخاب مقصد
        </button>

        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          پاک کردن همه
        </button>
      </div>

      {/* راهنما */}
      <div className="text-sm text-gray-600">
        {selecting === "origin" && (
          <span className="text-green-700">
            روی نقشه کلیک کنید یا مارکر را بکشید
          </span>
        )}
        {selecting === "destination" && (
          <span className="text-red-700">
            روی نقشه کلیک کنید یا مارکر را بکشید
          </span>
        )}
        {!selecting && origin && destination && (
          <span className="text-blue-700">مبدا و مقصد انتخاب شدند</span>
        )}
      </div>

      {/* نقشه */}
      <div
        ref={mapContainer}
        className="h-125 w-full rounded-xl overflow-hidden border"
      />

      {/* اطلاعات نقاط */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* مبدا */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-800">مبدا</span>
            {origin && (
              <button
                onClick={clearOrigin}
                className="text-xs text-green-700 hover:underline"
              >
                پاک کردن
              </button>
            )}
          </div>
          {origin ? (
            <>
              <div className="text-gray-800">
                {loadingAddress === "origin"
                  ? "در حال دریافت آدرس..."
                  : origin.address || "آدرس موجود نیست"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}
              </div>
            </>
          ) : (
            <div className="text-gray-500">هنوز انتخاب نشده</div>
          )}
        </div>

        {/* مقصد */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-red-800">مقصد</span>
            {destination && (
              <button
                onClick={clearDestination}
                className="text-xs text-red-700 hover:underline"
              >
                پاک کردن
              </button>
            )}
          </div>
          {destination ? (
            <>
              <div className="text-gray-800">
                {loadingAddress === "destination"
                  ? "در حال دریافت آدرس..."
                  : destination.address || "آدرس موجود نیست"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
              </div>
            </>
          ) : (
            <div className="text-gray-500">هنوز انتخاب نشده</div>
          )}
        </div>
      </div>
    </div>
  );
}
