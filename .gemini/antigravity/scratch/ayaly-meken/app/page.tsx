import { getApartments } from "@/actions/apartments";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { SearchBar } from "@/components/search/search-bar";
import { CategoryTabs } from "@/components/search/category-tabs";
import { SearchFilters } from "@/types/database.types";
import { Sparkles, MapPin, ArrowRight, Map, ShieldCheck, Key, Wifi, Clock } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-sand-50/40">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#064231] to-emerald-950 px-4 pt-14 pb-20 text-cream-50 sm:px-6 lg:px-8">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-900/60 px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Премиальный сервис посуточной аренды</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-cream-50 leading-[1.15]">
            Живите с комфортом в лучших{" "}
            <br className="hidden sm:block" />
            <span className="italic font-normal text-amber-300/95 font-serif">апартаментах Казахстана</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-cream-200/80 font-normal leading-relaxed">
            Бесконтактный заезд по электронным замкам TTLock, гостиничный уровень чистоты и мгновенное бронирование.
          </p>

          {/* Search Bar Container */}
          <div className="mt-9">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        {/* City Filter Tabs Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-7 border-b border-sand-200/80">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { val: "All", label: "✨ Все города" },
              { val: "Almaty", label: "📍 Алматы" },
              { val: "Astana", label: "📍 Астана" },
              { val: "Shymkent", label: "📍 Шымкент" },
            ].map(({ val, label }) => {
              const isActive = (val === "All" && (!cityFilter || cityFilter === "All")) || cityFilter === val;
              return (
                <Link
                  key={val}
                  href={val === "All" ? "/" : `/?city=${val}`}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all whitespace-nowrap shadow-2xs ${
                    isActive
                      ? "bg-emerald-950 text-cream-50 shadow-sm"
                      : "bg-white border border-sand-300 text-stone-600 hover:border-emerald-800 hover:text-emerald-950 hover:bg-sand-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500">
              Найдено: <strong className="text-emerald-950 font-bold">{apartments.length}</strong> {apartments.length === 1 ? "вариант" : apartments.length < 5 ? "варианта" : "вариантов"}
            </span>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="pt-6">
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
        </div>

        {/* Floating Map Pill Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
          <Link
            href={cityFilter && cityFilter !== "All" ? `/map?city=${cityFilter}` : "/map"}
            className="flex items-center gap-2 rounded-full bg-emerald-950/95 hover:bg-emerald-900 text-cream-50 px-5 py-2.5 text-xs font-bold shadow-xl shadow-emerald-950/30 border border-emerald-700/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Map className="h-4 w-4 text-amber-300" />
            <span>Показать на карте</span>
          </Link>
        </div>

        {/* TTLock Digital Access Banner */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-8 text-cream-50 sm:p-12 shadow-card border border-emerald-800/40 relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Key size={13} />
              Бесконтактный заезд · Смарт-замки TTLock
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl text-cream-50 leading-tight">
              Никаких ключей. Заезжайте в любое время по личному ПИН-коду.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-cream-200/80 leading-relaxed">
              Каждая резиденция оснащена смарт-замками TTLock. После подтверждения бронирования ваш персональный цифровой код отправляется прямо в WhatsApp и на почту.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/40">
                <Clock size={13} className="text-amber-300" /> Заезд 24/7 без ожидания
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/40">
                <Wifi size={13} className="text-amber-300" /> Высокоскоростной Wi-Fi
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/40">
                <ShieldCheck size={13} className="text-amber-300" /> Гостиничный клининг
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
