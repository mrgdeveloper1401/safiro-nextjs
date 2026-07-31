// components/home/mapNeshan.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { mapKey } from "@/utils/config";
import { reverseGeocode, type ReverseResult } from "@/utils/neshan";
import { MapPin, Navigation, RotateCcw, Loader2 } from "lucide-react";

type Point = {
  lat: number;
  lng: number;
  address?: string;
};

type Props = {
  token?: string;
  // اختیاری: اگر خواستی بعداً به فرم وصلش کنی
  onOriginChange?: (point: Point | null) => void;
  onDestinationChange?: (point: Point | null) => void;
};

type SelectingMode = "origin" | "destination" | null;

const bounds: [[number, number], [number, number]] = [
  [51.0583, 35.5422],
  [51.6218, 35.8504],
];

export default function MapNeshan({
  token,
  onOriginChange,
  onDestinationChange,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<InstanceType<typeof nmp_mapboxgl.Map> | null>(null);
  const originMarkerRef = useRef<InstanceType<typeof nmp_mapboxgl.Marker> | null>(null);
  const destinationMarkerRef = useRef<InstanceType<typeof nmp_mapboxgl.Marker> | null>(null);

  const [selecting, setSelecting] = useState<SelectingMode>("origin");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [loadingAddress, setLoadingAddress] = useState<"origin" | "destination" | null>(null);

  const setPointWithAddress = async (
    type: "origin" | "destination",
    lat: number,
    lng: number,
    map: InstanceType<typeof nmp_mapboxgl.Map>
  ) => {
    const point: Point = { lat, lng, address: "در حال دریافت آدرس..." };

    if (type === "origin") {
      setOrigin(point);
      onOriginChange?.(point);
      upsertMarker("origin", lng, lat, map);
    } else {
      setDestination(point);
      onDestinationChange?.(point);
      upsertMarker("destination", lng, lat, map);
    }

    setLoadingAddress(type);

    const result: ReverseResult | null = await reverseGeocode(lat, lng, token);
    const address = result?.formatted_address || "آدرس یافت نشد";
    const finalPoint = { lat, lng, address };

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

    setLoadingAddress(null);
  };

  const upsertMarker = (
    type: "origin" | "destination",
    lng: number,
    lat: number,
    map: InstanceType<typeof nmp_mapboxgl.Map>
  ) => {
    const isOrigin = type === "origin";
    const markerRef = isOrigin ? originMarkerRef : destinationMarkerRef;
    const color = isOrigin ? "#16a34a" : "#dc2626";

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
      map.remove();
      mapRef.current = null;
      originMarkerRef.current = null;
      destinationMarkerRef.current = null;
    };
  }, []);

  const selectingRef = useRef(selecting);
  useEffect(() => {
    selectingRef.current = selecting;
  }, [selecting]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = async (e: { lngLat: { lng: number; lat: number } }) => {
      const mode = selectingRef.current;
      if (!mode) return;

      const { lng, lat } = e.lngLat;

      if (mode === "origin") {
        await setPointWithAddress("origin", lat, lng, map);
        setSelecting("destination");
      } else {
        await setPointWithAddress("destination", lat, lng, map);
        setSelecting(null);
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (origin) upsertMarker("origin", origin.lng, origin.lat, map);
    if (destination) upsertMarker("destination", destination.lng, destination.lat, map);
  }, [origin, destination]);

  const clearOrigin = () => {
    setOrigin(null);
    onOriginChange?.(null);
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    setSelecting("origin");
  };

  const clearDestination = () => {
    setDestination(null);
    onDestinationChange?.(null);
    destinationMarkerRef.current?.remove();
    destinationMarkerRef.current = null;
    setSelecting("destination");
  };

  const clearAll = () => {
    clearOrigin();
    clearDestination();
    setSelecting("origin");
  };

  const statusText =
    selecting === "origin"
      ? "روی نقشه بزنید یا مارکر سبز را جابه‌جا کنید"
      : selecting === "destination"
        ? "روی نقشه بزنید یا مارکر قرمز را جابه‌جا کنید"
        : origin && destination
          ? "مبدا و مقصد آماده است — می‌توانید مارکرها را تنظیم کنید"
          : "یک نقطه را انتخاب کنید";

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl">
      {/* هدر */}
      <div className="flex flex-col gap-3 border-b border-purple-50 bg-linear-to-l from-purple-50 to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-800 sm:text-lg">
            انتخاب مسیر روی نقشه
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{statusText}</p>
        </div>

        <div className="flex flex-wrap gap-2">
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

      {/* نقشه */}
      <div className="relative">
        <div
          ref={mapContainer}
          className="h-85 w-full sm:h-105 lg:h-120"
        />

        {/* بج وضعیت روی نقشه */}
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md backdrop-blur">
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

      {/* کارت‌های آدرس */}
      <div className="grid grid-cols-1 gap-3 border-t border-purple-50 bg-gray-50/80 p-4 md:grid-cols-2">
        {/* مبدا */}
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
              <div className="mt-2 font-mono text-[11px] text-gray-400" dir="ltr">
                {origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">هنوز انتخاب نشده</p>
          )}
        </div>

        {/* مقصد */}
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
              <div className="mt-2 font-mono text-[11px] text-gray-400" dir="ltr">
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
