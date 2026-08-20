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
        background: ${isActive ? "#022c22" : "#064e3b"};
        color: #ffffff;
        border: 2px solid ${isActive ? "#fbbf24" : "rgba(255,255,255,0.9)"};
        border-radius: 9999px;
        padding: 5px 12px;
        font-weight: 800;
        font-size: 12px;
        white-space: nowrap;
        box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        transform: translate(-50%, -50%) ${isActive ? "scale(1.1)" : "scale(1)"};
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>${Math.round(price / 1000)} тыс ₸</span>
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
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const defaultCenter: [number, number] =
        validApts.length > 0
          ? [
              validApts.reduce((s, a) => s + (a.lat || 0), 0) / validApts.length,
              validApts.reduce((s, a) => s + (a.lng || 0), 0) / validApts.length,
            ]
          : [51.128, 71.430];

      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;

      // Invalidate size shortly after mounting to prevent gray tiles
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove();
    });
    markersRef.current = {};

    if (validApts.length === 0) return;

    const bounds = L.latLngBounds([]);

    // Add new markers
    validApts.forEach((apt) => {
      const isActive = apt.id === activeId;
      const latLng: [number, number] = [apt.lat!, apt.lng!];
      bounds.extend(latLng);

      const marker = L.marker(latLng, {
        icon: createPriceIcon(apt.base_night_price, isActive),
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px; padding: 2px;">
            <img src="${apt.cover_image || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600'}" style="width:100%;height:110px;object-fit:cover;border-radius:12px;margin-bottom:8px" />
            <div style="font-weight:700;font-size:13px;color:#022c22;margin-bottom:2px">${apt.name}</div>
            <div style="font-size:11px;color:#6b7280;margin-bottom:6px">${apt.district ? `${apt.district}, ` : ''}${apt.city}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">
              <span style="font-weight:800;font-size:14px;color:#064e3b">${formatKZT(apt.base_night_price)} <span style="font-weight:400;font-size:11px;color:#6b7280">/ночь</span></span>
              <a href="/apartments/${apt.id}" style="background:#064e3b;color:white;text-align:center;padding:5px 12px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;display:inline-block">Забронировать</a>
            </div>
          </div>`,
          { maxWidth: 240, className: "custom-leaflet-popup" }
        );

      marker.on("click", () => {
        if (onApartmentClick) onApartmentClick(apt.id);
      });

      markersRef.current[apt.id] = marker;
    });

    if (validApts.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    return () => {};
  }, [apartments]);

  // Highlight active marker and pan
  useEffect(() => {
    if (!mapRef.current) return;

    validApts.forEach((apt) => {
      const marker = markersRef.current[apt.id];
      if (marker) {
        const isActive = apt.id === activeId;
        marker.setIcon(createPriceIcon(apt.base_night_price, isActive));
        if (isActive && apt.lat && apt.lng) {
          mapRef.current?.panTo([apt.lat, apt.lng], { animate: true, duration: 0.5 });
          marker.openPopup();
        }
      }
    });
  }, [activeId, validApts]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-sand-300 shadow-soft">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
