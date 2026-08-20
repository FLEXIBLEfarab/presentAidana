import { getApartments } from "@/actions/apartments";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { SearchBar } from "@/components/search/search-bar";
import { CategoryTabs } from "@/components/search/category-tabs";
import { SearchFilters } from "@/types/database.types";
import { Sparkles, MapPin, ArrowRight, Map } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 px-4 pt-12 pb-16 text-cream-50 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-800/40 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-md mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Отборное гостеприимство в Казахстане</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-cream-50">
            Живите как дома в лучших
            <br className="hidden sm:block" />
            <span className="text-amber-300 italic">апартаментах Казахстана</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-cream-200/80">
            Бесконтактный заезд, гостиничный уровень чистоты и мгновенное бронирование в Алматы, Астане и Шымкенте.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <CategoryTabs />

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
        {/* City + Map Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { val: "All", label: "✨ Все" },
              { val: "Almaty", label: "📍 Алматы" },
              { val: "Astana", label: "📍 Астана" },
              { val: "Shymkent", label: "📍 Шымкент" },
            ].map(({ val, label }) => {
              const isActive = (val === "All" && (!cityFilter || cityFilter === "All")) || cityFilter === val;
              return (
                <Link
                  key={val}
                  href={val === "All" ? "/" : `/?city=${val}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                    isActive ? "bg-emerald-900 text-cream-50 shadow-sm" : "bg-white border border-sand-300 text-stone-600 hover:border-emerald-800"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500">
              <strong className="text-emerald-950 font-bold">{apartments.length}</strong> вариантов
            </span>
            <Link
              href={cityFilter && cityFilter !== "All" ? `/map?city=${cityFilter}` : "/map"}
              className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:border-emerald-800 transition-colors shadow-sm"
            >
              <Map className="h-3.5 w-3.5 text-emerald-700" />
              <span>На карте</span>
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {apartments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apartments.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-sand-300 bg-white p-12 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 mb-3">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-emerald-950">В этом городе пока нет вариантов</h3>
            <p className="mt-1 text-xs text-stone-500">Попробуйте выбрать другой город или сбросить фильтры.</p>
            <Link href="/" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-900 px-5 py-2 text-xs font-bold text-cream-50 hover:bg-emerald-800">
              <span>Смотреть все города</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
            </Link>
          </div>
        )}

        {/* Floating Map Pill Button */}
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-30">
          <Link
            href={cityFilter && cityFilter !== "All" ? `/map?city=${cityFilter}` : "/map"}
            className="flex items-center gap-2 rounded-full bg-emerald-950/95 hover:bg-emerald-900 text-cream-50 px-5 py-2.5 text-xs font-bold shadow-xl shadow-emerald-950/30 border border-emerald-800/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            <Map className="h-4 w-4 text-amber-300" />
            <span>Показать на карте</span>
          </Link>
        </div>

        {/* TTLock Digital Access Banner */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-950 p-8 text-cream-50 sm:p-12 shadow-card">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Бесконтактный заезд · TTLock</span>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl text-cream-50">
              Никаких ключей. Заезжайте в любое время по личному ПИН-коду.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-cream-200/80 leading-relaxed">
              Каждая резиденция оснащена смарт-замками TTLock. После подтверждения бронирования ваш персональный код отправляется прямо в WhatsApp и на почту.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/bookings" className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-xs font-bold text-stone-950 shadow-md hover:bg-amber-300 active:scale-95 transition-all">
                <span>Мои цифровые пропуска</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
