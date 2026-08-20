"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Apartment } from "@/types/database.types";
import { formatKZT } from "@/lib/utils";

interface LeafletMapProps {
  apartments: Apartment[];
  activeId?: string | null;
  onApartmentClick?: (id: string) => void;
}

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPriceIcon(price: number, isActive: boolean): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        background: ${isActive ? "#064e3b" : "#ffffff"};
        color: ${isActive ? "#fef9e7" : "#064e3b"};
        border: 2px solid ${isActive ? "#064e3b" : "#d1fae5"};
        border-radius: 100px;
        padding: 4px 10px;
        font-weight: 800;
        font-size: 11px;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(-50%) translateY(-50%);
        cursor: pointer;
        transition: all 0.2s;
        font-family: system-ui, sans-serif;
      ">
        ${Math.round(price / 1000)} тыс ₸
      </div>
    `,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function LeafletMap({ apartments, activeId, onApartmentClick }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const validApts = apartments.filter((a) => a.lat && a.lng);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Calculate center from apartments
    const center: [number, number] =
      validApts.length > 0
        ? [
            validApts.reduce((s, a) => s + (a.lat || 0), 0) / validApts.length,
            validApts.reduce((s, a) => s + (a.lng || 0), 0) / validApts.length,
          ]
        : [43.24, 76.93];

    const map = L.map(containerRef.current, {
      center,
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap © CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    // Add markers
    validApts.forEach((apt) => {
      const isActive = apt.id === activeId;
      const marker = L.marker([apt.lat!, apt.lng!], {
        icon: createPriceIcon(apt.base_night_price, isActive),
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: system-ui; min-width: 180px; padding: 4px;">
            <img src="${apt.cover_image}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px" />
            <div style="font-weight:700;font-size:12px;color:#064e3b;margin-bottom:2px">${apt.name}</div>
            <div style="font-size:11px;color:#6b7280">${apt.district || apt.city}</div>
            <div style="font-weight:800;font-size:14px;color:#064e3b;margin-top:4px">${formatKZT(apt.base_night_price)} <span style="font-weight:400;font-size:11px">/ночь</span></div>
            <a href="/apartments/${apt.id}" style="display:block;margin-top:6px;background:#064e3b;color:white;text-align:center;padding:5px 8px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none">Подробнее</a>
          </div>`,
          { maxWidth: 220 }
        );

      marker.on("click", () => {
        if (onApartmentClick) onApartmentClick(apt.id);
      });

      markersRef.current[apt.id] = marker;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker icons when activeId changes
  useEffect(() => {
    if (!mapRef.current) return;

    validApts.forEach((apt) => {
      const marker = markersRef.current[apt.id];
      if (marker) {
        const isActive = apt.id === activeId;
        marker.setIcon(createPriceIcon(apt.base_night_price, isActive));
        if (isActive && apt.lat && apt.lng) {
          mapRef.current?.panTo([apt.lat, apt.lng], { animate: true, duration: 0.5 });
        }
      }
    });
  }, [activeId, validApts]);

  if (validApts.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-sand-100 rounded-3xl">
        <div className="text-center text-stone-400">
          <div className="text-3xl mb-2">🗺️</div>
          <p className="text-xs font-medium">Нет апартаментов с координатами</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-3xl overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
}
