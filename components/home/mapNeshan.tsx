"use client";

import { useEffect } from "react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { mapKey } from "@/utils/config";

export default function MapNeshan() {
  useEffect(() => {
    const map = new nmp_mapboxgl.Map({
      mapKey,
      container: "map",
      center: [51.389, 35.6892], // تهران
      zoom: 11,
      pitch: 0,
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      poi: true,
      traffic: true,
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      mapTypeControllerOptions: {
        show: true,
        position: "bottom-left",
      },
    });

    return () => {
      map.removeMapTypeControl();
    };
  }, []);

  return (
    <div
      id="map"
      className="h-[500px] w-full rounded-xl overflow-hidden"
    />
  );
}
