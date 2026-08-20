import { getApartments } from "@/actions/apartments";
import { SearchShell } from "@/components/search/search-shell";
import { SearchFilters } from "@/types/database.types";

interface MapPageProps {
  searchParams: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export const metadata = {
  title: "Карта жилья — Ayaly Meken",
  description: "Найдите апартаменты на карте Алматы, Астаны и Шымкента. Просматривайте цены и бронируйте онлайн.",
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const filters: SearchFilters = {
    city: searchParams.city,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests ? Number(searchParams.guests) : undefined,
  };

  const result = await getApartments(filters);
  const apartments = result.data || [];

  return (
    <SearchShell
      initialApartments={apartments}
      initialFilters={{ ...filters, sortBy: "recommended" }}
    />
  );
}
