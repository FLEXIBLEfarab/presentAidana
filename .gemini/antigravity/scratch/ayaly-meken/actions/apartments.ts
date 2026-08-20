"use server";

import { createClient } from "@/lib/supabase/server";
import { MOCK_APARTMENTS } from "@/lib/mock-data";
import { Apartment, SearchFilters, Result } from "@/types/database.types";
import { applyFiltersAndSort } from "@/lib/search-filters";

function getCoordinatesForApartment(apt: any): { lat: number; lng: number } {
  if (apt.lat && apt.lng) return { lat: Number(apt.lat), lng: Number(apt.lng) };

  const city = (apt.city || "").toLowerCase();
  let baseLat = 51.128;
  let baseLng = 71.430; // Astana default

  if (city.includes("алмат") || city.includes("almat")) {
    baseLat = 43.238;
    baseLng = 76.945; // Almaty
  } else if (city.includes("шымкент") || city.includes("shymk")) {
    baseLat = 42.315;
    baseLng = 69.587; // Shymkent
  } else if (city.includes("астан") || city.includes("astan") || city.includes("нур-султан")) {
    baseLat = 51.128;
    baseLng = 71.430; // Astana
  }

  const idStr = String(apt.id || "1");
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((Math.abs(hash) % 100) - 50) * 0.0004;
  const offsetLng = ((Math.abs(hash >> 3) % 100) - 50) * 0.0004;

  return {
    lat: Number((baseLat + offsetLat).toFixed(6)),
    lng: Number((baseLng + offsetLng).toFixed(6)),
  };
}

function enrichApartment(apt: any): Apartment {
  const match = MOCK_APARTMENTS.find((m) => m.id === apt.id);
  const coords = getCoordinatesForApartment(apt);

  return {
    ...apt,
    cover_image:
      apt.cover_image ||
      match?.cover_image ||
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    images:
      apt.images && apt.images.length > 0
        ? apt.images
        : match?.images || [
            apt.cover_image ||
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
          ],
    amenities:
      apt.amenities && apt.amenities.length > 0
        ? apt.amenities
        : match?.amenities || [
            "Бесконтактный заезд (TTLock)",
            "Wi-Fi 500 Mbps",
            "Кондиционер",
            "Smart TV",
            "Стиральная машина",
          ],
    description:
      apt.description ||
      match?.description ||
      `Превосходные апартаменты «${apt.name}» с бесконтактным заселением по электронному замку TTLock, современным ремонтом и полным набором удобств.`,
    house_rules:
      apt.house_rules ||
      match?.house_rules || [
        "Курение строго запрещено (штраф 25 000 ₸)",
        "Тихий час с 23:00 до 08:00",
        "Без вечеринок и шумных компаний",
      ],
    nearby_landmarks:
      apt.nearby_landmarks || match?.nearby_landmarks || ["Центральный парк", "ТРЦ", "Кофейни"],
    rating: apt.rating || match?.rating || 4.95,
    reviews_count: apt.reviews_count || match?.reviews_count || 38,
    lat: coords.lat,
    lng: coords.lng,
    wifi_name: apt.wifi_name || match?.wifi_name || "AyalyMeken_Guest",
    wifi_password: apt.wifi_password || match?.wifi_password || "AltynGuest2026",
    intercom_code: apt.intercom_code || match?.intercom_code || "101K",
  };
}

export async function getApartments(
  filters?: SearchFilters
): Promise<Result<Apartment[]>> {
  try {
    const supabase = createClient();
    const { data: dbApartments, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("status", "active");

    let apartments: Apartment[] = [];

    if (!error && dbApartments && dbApartments.length > 0) {
      apartments = dbApartments.map(enrichApartment);
    } else {
      apartments = [...MOCK_APARTMENTS];
    }

    if (filters) {
      apartments = applyFiltersAndSort(apartments, filters);
    }

    return { success: true, data: apartments };
  } catch {
    const apartments = filters
      ? applyFiltersAndSort([...MOCK_APARTMENTS], filters)
      : [...MOCK_APARTMENTS];
    return { success: true, data: apartments };
  }
}

export async function getApartmentById(id: string): Promise<Result<Apartment>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return { success: true, data: enrichApartment(data) };
    }

    const found = MOCK_APARTMENTS.find((apt) => apt.id === id);
    return found
      ? { success: true, data: enrichApartment(found) }
      : { success: false, error: "Апартамент не найден" };
  } catch {
    const found = MOCK_APARTMENTS.find((apt) => apt.id === id);
    return found
      ? { success: true, data: enrichApartment(found) }
      : { success: false, error: "Апартамент не найден" };
  }
}

/**
 * Check date availability for an apartment — returns booked date ranges.
 */
export async function getUnavailableDates(
  apartmentId: string
): Promise<Result<{ checkIn: string; checkOut: string }[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("check_in_date, check_out_date")
      .eq("apartment_id", apartmentId)
      .in("status", ["confirmed", "pending_payment", "checked_in"]);

    if (!error && data) {
      return {
        success: true,
        data: data.map((b: { check_in_date: string; check_out_date: string }) => ({
          checkIn: b.check_in_date,
          checkOut: b.check_out_date,
        })),
      };
    }
    return { success: true, data: [] };
  } catch {
    return { success: true, data: [] };
  }
}
