"use client";

import dynamic from "next/dynamic";
import { Apartment } from "@/types/database.types";
import { formatKZT } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ApartmentMapProps {
  apartments: Apartment[];
  activeId?: string | null;
  onApartmentClick?: (id: string) => void;
}

// Dynamically import Leaflet-dependent component to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sand-100 rounded-3xl">
      <div className="text-center text-stone-400">
        <div className="animate-pulse text-2xl mb-2">🗺️</div>
        <p className="text-xs font-medium">Загрузка карты...</p>
      </div>
    </div>
  ),
});

export function ApartmentMap(props: ApartmentMapProps) {
  return <LeafletMap {...props} />;
}
