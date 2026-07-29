"use client";

import dynamic from "next/dynamic";

const MapNeshan = dynamic(() => import("./mapNeshan"), {
  ssr: false,
  loading: () => (
    <div className="h-125 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-500">
      در حال بارگذاری نقشه...
    </div>
  ),
});

export default function MapWrapper() {
  return <MapNeshan />;
}
