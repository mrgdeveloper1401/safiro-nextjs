"use client";

import { useEffect, useRef, useState } from "react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { mapKey } from "@/utils/config";

type Point = {
  lat: number;
  lng: number;
};

type SelectingMode = "origin" | "destination" | null;

const bounds: [[number, number], [number, number]] = [
  [51.0583, 35.5422], // جنوب غربی تهران
  [51.6218, 35.8504], // شمال شرقی تهران
];

export default function MapNeshan() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<string | number | null>(null);
  const originMarkerRef = useRef<string | number | null>(null);
  const destinationMarkerRef = useRef<string | number | null>(null);

  const [selecting, setSelecting] = useState<SelectingMode>("origin");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);

  // ساخت / آپدیت مارکر
  const upsertMarker = (
    type: "origin" | "destination",
    lng: number,
    lat: number,
    map: string | number | null
  ) => {
    const isOrigin = type === "origin";
    const markerRef = isOrigin ? originMarkerRef : destinationMarkerRef;
    const color = isOrigin ? "#22c55e" : "#ef4444";

    if (!markerRef.current) {
      const marker = new nmp_mapboxgl.Marker({
        color,
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        const point = { lat: lngLat.lat, lng: lngLat.lng };

        if (isOrigin) {
          setOrigin(point);
        } else {
          setDestination(point);
        }
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
      mapTypeControllerOptions: {
        show: true,
        position: "bottom-left",
      },
    });

    mapRef.current = map;

    map.on("click", (e: string | number | null) => {
      if (!selecting) return;

      const { lng, lat } = e.lngLat;
      const point = { lat, lng };

      if (selecting === "origin") {
        setOrigin(point);
        upsertMarker("origin", lng, lat, map);
        // بعد از انتخاب مبدا، خودکار برو روی مقصد
        setSelecting("destination");
      } else if (selecting === "destination") {
        setDestination(point);
        upsertMarker("destination", lng, lat, map);
        setSelecting(null); // هر دو انتخاب شدند
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      originMarkerRef.current = null;
      destinationMarkerRef.current = null;
    };
  }, []);

  // همگام‌سازی مارکرها وقتی state از بیرون تغییر کرد
  // (و همچنین برای drag که state را آپدیت می‌کند)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (origin) {
      upsertMarker("origin", origin.lng, origin.lat, map);
    }
    if (destination) {
      upsertMarker("destination", destination.lng, destination.lat, map);
    }
  }, [origin, destination]);

  // چون selecting داخل useEffect اول نیست،
  // برای جلوگیری از stale closure یک ref نگه می‌داریم
  const selectingRef = useRef(selecting);
  useEffect(() => {
    selectingRef.current = selecting;
  }, [selecting]);

  // نسخه بهتر event click با ref (جایگزین click داخل useEffect اول)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: string | number | null) => {
      const mode = selectingRef.current;
      if (!mode) return;

      const { lng, lat } = e.lngLat;
      const point = { lat, lng };

      if (mode === "origin") {
        setOrigin(point);
        upsertMarker("origin", lng, lat, map);
        setSelecting("destination");
      } else if (mode === "destination") {
        setDestination(point);
        upsertMarker("destination", lng, lat, map);
        setSelecting(null);
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, []);

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
          type="button"
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
          type="button"
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
          type="button"
          onClick={clearAll}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          پاک کردن همه
        </button>
      </div>

      {/* راهنما */}
      <div className="text-sm text-gray-600">
        {selecting === "origin" && (
          <span className="text-green-700">روی نقشه کلیک کنید تا مبدا انتخاب شود (یا مارکر را بکشید)</span>
        )}
        {selecting === "destination" && (
          <span className="text-red-700">روی نقشه کلیک کنید تا مقصد انتخاب شود (یا مارکر را بکشید)</span>
        )}
        {!selecting && origin && destination && (
          <span className="text-blue-700">مبدا و مقصد انتخاب شدند. می‌توانید مارکرها را جابه‌جا کنید.</span>
        )}
      </div>

      {/* نقشه */}
      <div
        ref={mapContainer}
        className="h-150 w-full rounded-xl overflow-hidden border"
      />

      {/* اطلاعات نقاط */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* مبدا */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-800">مبدا</span>
            {origin && (
              <button
                type="button"
                onClick={clearOrigin}
                className="text-xs text-green-700 hover:underline"
              >
                پاک کردن
              </button>
            )}
          </div>
          {origin ? (
            <>
              <div>عرض: <b>{origin.lat.toFixed(6)}</b></div>
              <div>طول: <b>{origin.lng.toFixed(6)}</b></div>
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
                type="button"
                onClick={clearDestination}
                className="text-xs text-red-700 hover:underline"
              >
                پاک کردن
              </button>
            )}
          </div>
          {destination ? (
            <>
              <div>عرض: <b>{destination.lat.toFixed(6)}</b></div>
              <div>طول: <b>{destination.lng.toFixed(6)}</b></div>
            </>
          ) : (
            <div className="text-gray-500">هنوز انتخاب نشده</div>
          )}
        </div>
      </div>
    </div>
  );
}
