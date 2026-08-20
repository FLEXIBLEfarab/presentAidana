import { SearchFilters, SortOption } from "@/types/database.types";
import { Apartment } from "@/types/database.types";

export const AMENITY_FILTERS = [
  { id: "ttlock", label: "Бесконтактный заезд (TTLock)", icon: "🔑" },
  { id: "wifi", label: "Wi-Fi высокоскоростной", icon: "📶" },
  { id: "smart_tv", label: "Smart TV", icon: "📺" },
  { id: "ac", label: "Кондиционер", icon: "❄️" },
  { id: "washer", label: "Стиральная машина", icon: "🫧" },
  { id: "parking", label: "Паркинг", icon: "🅿️" },
  { id: "mountain_view", label: "Вид на горы", icon: "⛰️" },
  { id: "balcony", label: "Балкон", icon: "🌅" },
  { id: "coffee", label: "Кофемашина", icon: "☕" },
  { id: "workspace", label: "Рабочий стол", icon: "💻" },
  { id: "pool", label: "Бассейн", icon: "🏊" },
  { id: "gym", label: "Фитнес", icon: "🏋️" },
];

export const PROPERTY_TYPES = [
  { id: "all", label: "Все типы" },
  { id: "studio", label: "Студия" },
  { id: "apartment", label: "Апартамент" },
  { id: "penthouse", label: "Пентхаус" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Сначала рекомендуемые" },
  { value: "price_asc", label: "По возрастанию цены" },
  { value: "price_desc", label: "По убыванию цены" },
  { value: "rating_desc", label: "По рейтингу" },
];

export function applyFiltersAndSort(
  apartments: Apartment[],
  filters: SearchFilters
): Apartment[] {
  let result = [...apartments];

  // City filter
  if (filters.city && filters.city !== "All") {
    result = result.filter(
      (a) => a.city?.toLowerCase() === filters.city!.toLowerCase()
    );
  }

  // Text search
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.district?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q)
    );
  }

  // Price range
  if (filters.minPrice) {
    result = result.filter((a) => a.base_night_price >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    result = result.filter((a) => a.base_night_price <= filters.maxPrice!);
  }

  // Guests
  if (filters.guests && filters.guests > 1) {
    result = result.filter((a) => (a.max_guests || 2) >= filters.guests!);
  }

  // Bedrooms
  if (filters.bedrooms && filters.bedrooms > 0) {
    result = result.filter((a) => (a.bedrooms || 1) >= filters.bedrooms!);
  }

  // Property type
  if (filters.propertyType && filters.propertyType !== "all") {
    result = result.filter((a) => a.property_type === filters.propertyType);
  }

  // Amenity keywords
  if (filters.amenities && filters.amenities.length > 0) {
    result = result.filter((a) =>
      filters.amenities!.every((amenityId) => {
        const amenityMap: Record<string, string> = {
          ttlock: "ttlock",
          wifi: "wi-fi",
          smart_tv: "smart tv",
          ac: "кондиционер",
          washer: "стиральная",
          parking: "паркинг",
          mountain_view: "горы",
          balcony: "балкон",
          coffee: "кофемашина",
          workspace: "рабочий",
          pool: "бассейн",
          gym: "фитнес",
        };
        const keyword = amenityMap[amenityId] || amenityId;
        return (a.amenities || []).some((am) =>
          am.toLowerCase().includes(keyword.toLowerCase())
        );
      })
    );
  }

  // Sorting
  switch (filters.sortBy) {
    case "price_asc":
      result.sort((a, b) => a.base_night_price - b.base_night_price);
      break;
    case "price_desc":
      result.sort((a, b) => b.base_night_price - a.base_night_price);
      break;
    case "rating_desc":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      // recommended: rating-weighted sort
      result.sort(
        (a, b) =>
          (b.rating || 0) * Math.log((b.reviews_count || 1) + 1) -
          (a.rating || 0) * Math.log((a.reviews_count || 1) + 1)
      );
  }

  return result;
}
