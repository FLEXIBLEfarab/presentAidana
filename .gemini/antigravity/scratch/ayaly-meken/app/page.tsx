import { getApartments } from "@/actions/apartments";
import { SearchFilters } from "@/types/database.types";
import { HomeClientShell } from "@/components/search/home-client-shell";

interface HomePageProps {
  searchParams: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    searchQuery?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const filters: SearchFilters = {
    city: searchParams.city,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests ? Number(searchParams.guests) : undefined,
    searchQuery: searchParams.searchQuery,
    sortBy: "recommended",
  };

  const result = await getApartments(filters);
  const apartments = result.data || [];
  const cityFilter = searchParams.city || "All";

  return <HomeClientShell apartments={apartments} cityFilter={cityFilter} />;
}
