"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, Map, Building2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/search/search-bar";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { ApartmentMap } from "@/components/map/apartment-map";
import type { Apartment } from "@/types/database.types";
import { normalizeCity } from "@/lib/search-filters";

interface HomeClientShellProps {
  apartments: Apartment[];
  cityFilter: string;
}

export function HomeClientShell({ apartments, cityFilter }: HomeClientShellProps) {
  const { t } = useI18n();
  const [showMap, setShowMap] = useState(false);

  const cityTabs = [
    { val: "All", label: "✨ " + t.home.all_cities },
    { val: "Almaty", label: "📍 " + t.search.almaty },
    { val: "Astana", label: "📍 " + t.search.astana },
    { val: "Shymkent", label: "📍 " + t.search.shymkent },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-sand-50/40">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#064231] to-emerald-950 px-4 pt-14 pb-20 text-cream-50 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-900/60 px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{t.home.hero_tag}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-cream-50 leading-[1.15]">
            {t.home.hero_title_1}{" "}
            <br className="hidden sm:block" />
            <span className="italic font-normal text-amber-300/95 font-serif">{t.home.hero_title_2}</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-cream-200/80 font-normal leading-relaxed">
            {t.home.hero_subtitle}
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
            {cityTabs.map(({ val, label }) => {
              const isActive =
                (val === "All" && (!cityFilter || cityFilter === "All")) ||
                normalizeCity(cityFilter) === normalizeCity(val);
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
            <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
              {t.home.found_prefix} <strong className="text-emerald-950 font-bold">{apartments.length}</strong>{" "}
              {apartments.length === 1 ? t.home.variant_1 : apartments.length < 5 ? t.home.variant_2_4 : t.home.variant_5}
            </span>

            {/* Map Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-cream-50 px-4 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Map size={14} className="text-amber-300" />
              <span>{showMap ? t.home.list_view : t.home.on_map}</span>
            </button>
          </div>
        </div>

        {/* View switcher: Map OR Cards Grid */}
        {showMap ? (
          <div className="mt-8 rounded-3xl overflow-hidden border border-sand-300 shadow-md h-[600px]">
            <ApartmentMap apartments={apartments} />
          </div>
        ) : apartments.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-sand-100 flex items-center justify-center mx-auto text-stone-400">
              <Building2 size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">{t.home.no_apartments}</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">{t.home.no_apartments_sub}</p>
          </div>
        )}
      </section>
    </div>
  );
}
