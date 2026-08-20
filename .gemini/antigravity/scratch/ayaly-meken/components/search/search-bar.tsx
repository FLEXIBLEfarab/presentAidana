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

  const cityLabel = city === "All" ? t.search.all_cities : city;

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full max-w-xl items-center gap-3 rounded-full border border-sand-300/80 bg-white px-4 py-2 shadow-soft hover:shadow-card transition-all text-left"
      >
        <Search className="h-4 w-4 text-emerald-700 shrink-0" />
        <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
          <span className="font-bold text-stone-800 truncate">{cityLabel}</span>
          <span className="text-sand-400">•</span>
          <span className="text-stone-500">{checkIn || t.search.any_dates}</span>
          <span className="text-sand-400">•</span>
          <span className="text-stone-500">{guests} {t.search.guests.toLowerCase()}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Desktop Search Bar */}
      <div className="hidden md:flex items-center rounded-full border border-sand-300/80 bg-white p-2 shadow-card transition-all hover:shadow-float">
        <div className="flex-1 px-4 py-2 hover:bg-cream-50 rounded-full cursor-pointer transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">{t.search.where}</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="All">{t.search.all_cities}</option>
            <option value="Almaty">Алматы</option>
            <option value="Astana">Астана</option>
            <option value="Shymkent">Шымкент</option>
          </select>
        </div>
        <div className="h-8 w-px bg-sand-300" />
        <div className="flex-1 px-4 py-2 hover:bg-cream-50 rounded-full cursor-pointer transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">Заезд</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-stone-800 outline-none" />
        </div>
        <div className="h-8 w-px bg-sand-300" />
        <div className="flex-1 px-4 py-2 hover:bg-cream-50 rounded-full cursor-pointer transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">Выезд</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-stone-800 outline-none" />
        </div>
        <div className="h-8 w-px bg-sand-300" />
        <div className="flex-1 px-4 py-2 hover:bg-cream-50 rounded-full cursor-pointer transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">{t.search.guests}</label>
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-stone-800 outline-none cursor-pointer">
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}</option>)}
          </select>
        </div>
        <button onClick={handleSearch} className="flex items-center gap-2 rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-cream-50 shadow-md transition-all hover:bg-emerald-800 active:scale-95">
          <Search className="h-4 w-4 text-amber-300" />
          <span>{t.home.search_btn}</span>
        </button>
      </div>

      {/* Mobile Search Trigger */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(true)} className="flex w-full items-center justify-between rounded-full border border-sand-300/80 bg-white p-3 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-900 p-2 text-cream-100">
              <Search className="h-4 w-4 text-amber-300" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-emerald-950">{city === "All" ? "Весь Казахстан" : city}</div>
              <div className="text-xs text-stone-500">{checkIn || "Любые даты"} • {guests} гост.</div>
            </div>
          </div>
          <div className="rounded-full border border-sand-300 p-2 text-stone-600">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Mobile Full-screen Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream-50 p-4 md:hidden animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-sand-300">
            <h2 className="text-lg font-bold text-emerald-950">Найти жильё</h2>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-stone-500 hover:bg-sand-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 pt-4 overflow-y-auto">
            <div className="rounded-2xl border border-sand-300 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                <MapPin className="h-4 w-4 text-emerald-700" />
                Куда летим?
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["All", "Almaty", "Astana", "Shymkent"].map((c) => (
                  <button key={c} onClick={() => setCity(c)} className={cn("rounded-xl py-2.5 px-3 text-sm font-medium transition-all", city === c ? "bg-emerald-900 text-cream-50 shadow-sm" : "bg-sand-100 text-stone-700 hover:bg-sand-200")}>
                    {c === "All" ? "Все города" : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-sand-300 bg-white p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                <Calendar className="h-4 w-4 text-emerald-700" />
                Даты
              </div>
              <div>
                <label className="text-[11px] text-stone-500 font-medium">Заезд</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-0.5 w-full rounded-xl border border-sand-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-700" />
              </div>
              <div>
                <label className="text-[11px] text-stone-500 font-medium">Выезд</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-0.5 w-full rounded-xl border border-sand-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-700" />
              </div>
            </div>

            <div className="rounded-2xl border border-sand-300 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                <Users className="h-4 w-4 text-emerald-700" />
                Гости
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700">Количество гостей</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests(String(Math.max(1, Number(guests) - 1)))} className="h-8 w-8 rounded-full border border-sand-300 flex items-center justify-center font-bold active:bg-sand-200">-</button>
                  <span className="font-bold text-stone-800 w-4 text-center">{guests}</span>
                  <button onClick={() => setGuests(String(Math.min(6, Number(guests) + 1)))} className="h-8 w-8 rounded-full border border-sand-300 flex items-center justify-center font-bold active:bg-sand-200">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sand-300">
            <button onClick={handleSearch} className="w-full rounded-2xl bg-emerald-900 py-3.5 text-center font-bold text-cream-50 shadow-md active:scale-98">
              {t.home.search_btn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
