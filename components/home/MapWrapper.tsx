// components/home/MapWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import type { Point } from "@/components/home/TripBooking";

type Props = {
  token?: string;
  onOriginChange?: (point: Point | null) => void;
  onDestinationChange?: (point: Point | null) => void;
};

const MapNeshan = dynamic(() => import("./mapNeshan"), {
  ssr: false,
  loading: () => (
    <div className="flex h-105 items-center justify-center rounded-2xl border border-purple-100 bg-white shadow-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="text-sm text-gray-500">در حال بارگذاری نقشه...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper({
  token,
  onOriginChange,
  onDestinationChange,
}: Props) {
  return (
    <MapNeshan
      token={token}
      onOriginChange={onOriginChange}
      onDestinationChange={onDestinationChange}
    />
  );
}
