"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface SearchBarProps {
  compact?: boolean;
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const [city, setCity] = useState(searchParams.get("city") || "All");
  const [guests, setGuests] = useState(searchParams.get("guests") || "1");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city && city !== "All") params.set("city", city);
    if (guests && Number(guests) > 1) params.set("guests", guests);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  const cityLabel =
    city === "All"
      ? "Все города"
      : city === "Almaty"
      ? "Алматы"
      : city === "Astana"
      ? "Астана"
      : city === "Shymkent"
      ? "Шымкент"
      : city;

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full max-w-xl items-center gap-3 rounded-full border border-sand-300 bg-white px-4 py-2 shadow-sm hover:shadow-md transition-all text-left"
      >
        <Search className="h-4 w-4 text-emerald-800 shrink-0" />
        <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
          <span className="font-bold text-stone-800 truncate">{cityLabel}</span>
          <span className="text-sand-300">•</span>
          <span className="text-stone-500">{checkIn || "Любые даты"}</span>
          <span className="text-sand-300">•</span>
          <span className="text-stone-500">{guests} гост.</span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Desktop Search Bar */}
      <div className="hidden md:flex items-center rounded-full border border-sand-200 bg-white/95 backdrop-blur-md p-2 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.18)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.22)]">
        {/* City Segment */}
        <div className="flex-1 px-5 py-2 hover:bg-sand-100/70 rounded-full cursor-pointer transition-colors text-left">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-950/70">
            {t.search.where}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-emerald-950 outline-none cursor-pointer"
          >
            <option value="All">{t.search.all_cities}</option>
            <option value="Almaty">{t.search.almaty}</option>
            <option value="Astana">{t.search.astana}</option>
            <option value="Shymkent">{t.search.shymkent}</option>
          </select>
        </div>

        <div className="h-8 w-px bg-sand-200 shrink-0" />

        {/* CheckIn Segment */}
        <div className="flex-1 px-5 py-2 hover:bg-sand-100/70 rounded-full cursor-pointer transition-colors text-left">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-950/70">
            Заезд
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-emerald-950 outline-none cursor-pointer"
          />
        </div>

        <div className="h-8 w-px bg-sand-200 shrink-0" />

        {/* CheckOut Segment */}
        <div className="flex-1 px-5 py-2 hover:bg-sand-100/70 rounded-full cursor-pointer transition-colors text-left">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-950/70">
            Выезд
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-emerald-950 outline-none cursor-pointer"
          />
        </div>

        <div className="h-8 w-px bg-sand-200 shrink-0" />

        {/* Guests Segment */}
        <div className="flex-1 px-5 py-2 hover:bg-sand-100/70 rounded-full cursor-pointer transition-colors text-left">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-950/70">
            {t.search.guests}
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-emerald-950 outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Action Button */}
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-900 to-emerald-950 px-7 py-3 text-xs font-bold text-cream-50 shadow-md shadow-emerald-950/20 transition-all hover:bg-emerald-800 hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0 border border-emerald-700/30"
        >
          <Search className="h-3.5 w-3.5 text-amber-300" />
          <span>{t.home.search_btn}</span>
        </button>
      </div>

      {/* Mobile Search Trigger Bar */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between rounded-full border border-sand-200 bg-white p-3 shadow-lg shadow-black/10"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-900 p-2 text-cream-100 shadow-xs">
              <Search className="h-4 w-4 text-amber-300" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-emerald-950">{cityLabel}</div>
              <div className="text-[11px] text-stone-500">
                {checkIn ? `${checkIn} — ${checkOut || "..."}` : "Любые даты"} • {guests} гост.
              </div>
            </div>
          </div>
          <div className="rounded-full border border-sand-300 p-2 text-stone-600 bg-sand-50">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>

      {/* Mobile Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-5 md:hidden animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <h2 className="text-base font-bold text-emerald-950 font-serif">Параметры поиска</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-stone-400 hover:bg-sand-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 pt-4 overflow-y-auto">
            {/* City Selection */}
            <div className="rounded-2xl border border-sand-200 bg-sand-50/60 p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-950">
                <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                Город пребывания
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "All", label: "Все города" },
                  { id: "Almaty", label: "Алматы" },
                  { id: "Astana", label: "Астана" },
                  { id: "Shymkent", label: "Шымкент" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCity(item.id)}
                    className={cn(
                      "rounded-xl py-2.5 px-3 text-xs font-bold transition-all",
                      city === item.id
                        ? "bg-emerald-900 text-cream-50 shadow-sm"
                        : "bg-white border border-sand-300 text-stone-700 hover:bg-sand-100"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="rounded-2xl border border-sand-200 bg-sand-50/60 p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-950">
                <Calendar className="h-3.5 w-3.5 text-emerald-700" />
                Даты поездки
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">Заезд</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-xl border border-sand-300 bg-white p-2.5 text-xs font-semibold text-stone-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 mb-1 block">Выезд</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-xl border border-sand-300 bg-white p-2.5 text-xs font-semibold text-stone-800"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="rounded-2xl border border-sand-200 bg-sand-50/60 p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-950">
                <Users className="h-3.5 w-3.5 text-emerald-700" />
                Количество гостей
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setGuests(String(n))}
                    className={cn(
                      "rounded-xl py-2 text-xs font-bold transition-all",
                      guests === String(n)
                        ? "bg-emerald-900 text-cream-50 shadow-sm"
                        : "bg-white border border-sand-300 text-stone-700"
                    )}
                  >
                    {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sand-200">
            <button
              onClick={handleSearch}
              className="w-full rounded-2xl bg-emerald-900 py-3.5 text-xs font-bold text-cream-50 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="h-4 w-4 text-amber-300" />
              <span>Показать варианты</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
