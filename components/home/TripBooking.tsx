// components/home/TripBooking.tsx
"use client";

import { useState } from "react";
import MapWrapper from "@/components/home/MapWrapper";
import RideForm from "@/components/home/RideForm";

export type Point = {
  lat: number;
  lng: number;
  address?: string;
};

type Props = {
  token: string;
};

export default function TripBooking({ token }: Props) {
  const [origin, setOrigin] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);

  return (
    <div className="space-y-6">
      <MapWrapper
        token={token}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
      />

      <RideForm
        token={token}
        origin={origin}
        destination={destination}
        onOriginClear={() => setOrigin(null)}
        onDestinationClear={() => setDestination(null)}
      />
    </div>
  );
}
