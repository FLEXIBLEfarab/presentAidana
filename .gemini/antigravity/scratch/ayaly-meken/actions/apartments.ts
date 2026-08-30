"use server";

import { createClient } from "@/lib/supabase/server";
import { MOCK_APARTMENTS } from "@/lib/mock-data";
import { Apartment, SearchFilters, Result } from "@/types/database.types";
import { applyFiltersAndSort } from "@/lib/search-filters";

const ASTANA_HOTSPOTS = [
  { lat: 51.1278, lng: 71.4682, name: "Highvill / Байтурсынова" },
  { lat: 51.1283, lng: 71.4305, name: "Байтерек / бульвар Нуржол" },
  { lat: 51.0886, lng: 71.4138, name: "Mega Silk Way / EXPO" },
  { lat: 51.1092, lng: 71.4285, name: "Ботанический сад / Орынбор" },
  { lat: 51.1325, lng: 71.4038, name: "ТРЦ Хан Шатыр / Туран" },
  { lat: 51.1605, lng: 71.4280, name: "Набережная / Кенесары" },
  { lat: 51.1395, lng: 71.4150, name: "Триумф Астаны" },
  { lat: 51.1520, lng: 71.4170, name: "Городской парк / Сарыарка" },
];

const ALMATY_HOTSPOTS = [
  { lat: 43.2325, lng: 76.9560, name: "Достык плаза / Самал" },
  { lat: 43.2610, lng: 76.9420, name: "Арбат / Панфилова" },
  { lat: 43.2185, lng: 76.9280, name: "Esentai Mall / Аль-Фараби" },
  { lat: 43.2030, lng: 76.8920, name: "Mega Alma-Ata / Розыбакиева" },
  { lat: 43.2240, lng: 76.9080, name: "Атакент / Тимирязева" },
  { lat: 43.2490, lng: 76.9480, name: "Золотой квадрат / Кабанбай" },
];

const SHYMKENT_HOTSPOTS = [
  { lat: 42.3180, lng: 69.5890, name: "Shymkent Plaza / Аль-Фараби" },
  { lat: 42.3710, lng: 69.6150, name: "мкр. Нурсат / Акимат" },
  { lat: 42.3550, lng: 69.6020, name: "Байдибек Би / Дендропарк" },
  { lat: 42.3120, lng: 69.5950, name: "Центральный парк / Казыбек Би" },
];

function getCoordinatesForApartment(apt: any): { lat: number; lng: number } {
  if (apt.lat && apt.lng) return { lat: Number(apt.lat), lng: Number(apt.lng) };

  const city = (apt.city || "").toLowerCase();
  const address = (apt.address || "").toLowerCase();
  const name = (apt.name || "").toLowerCase();

  let pool = ASTANA_HOTSPOTS;
  if (city.includes("алмат") || city.includes("almat")) {
    pool = ALMATY_HOTSPOTS;
  } else if (city.includes("шымкент") || city.includes("shymk")) {
    pool = SHYMKENT_HOTSPOTS;
  }

  const key = `${apt.id}-${name}-${address}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  const hotspot = pool[index];

  const subOffsetLat = ((Math.abs(hash >> 2) % 20) - 10) * 0.0003;
  const subOffsetLng = ((Math.abs(hash >> 5) % 20) - 10) * 0.0003;

  return {
    lat: Number((hotspot.lat + subOffsetLat).toFixed(6)),
    lng: Number((hotspot.lng + subOffsetLng).toFixed(6)),
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
    rating: apt.rating !== undefined && apt.rating !== null ? apt.rating : (match?.rating || 0),
    reviews_count: apt.reviews_count !== undefined && apt.reviews_count !== null ? apt.reviews_count : (match?.reviews_count || 0),
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

    if (!error && Array.isArray(dbApartments)) {
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
