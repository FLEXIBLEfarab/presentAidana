"use client";

import { useState } from "react";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { ApartmentMap } from "@/components/map/apartment-map";
import { FilterDrawer } from "@/components/search/filter-drawer";
import { SearchBar } from "@/components/search/search-bar";
import { Apartment, SearchFilters } from "@/types/database.types";
import { applyFiltersAndSort } from "@/lib/search-filters";
import { List, Map, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchShellProps {
  initialApartments: Apartment[];
  initialFilters: SearchFilters;
}

export function SearchShell({ initialApartments, initialFilters }: SearchShellProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeId, setActiveId] = useState<string | null>(null);

  const apartments = applyFiltersAndSort(initialApartments, filters);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header Strip */}
      <div className="sticky top-16 z-30 border-b border-sand-200/80 bg-cream-50/90 backdrop-blur-md py-3 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <SearchBar compact />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <FilterDrawer
              filters={filters}
              onApply={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              resultCount={apartments.length}
            />

            {/* View Toggle */}
            <div className="flex items-center rounded-full border border-sand-300 bg-white p-0.5 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  viewMode === "list"
                    ? "bg-emerald-900 text-cream-50 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Список</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  viewMode === "map"
                    ? "bg-emerald-900 text-cream-50 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                <Map className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Карта</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Summary */}
        <div className="flex items-center justify-between pb-5">
          <p className="text-sm font-semibold text-stone-600">
            {apartments.length === 0
              ? "Ничего не найдено"
              : `${apartments.length} ${apartments.length === 1 ? "вариант" : apartments.length < 5 ? "варианта" : "вариантов"}`}
            {filters.city && filters.city !== "All" && ` в ${filters.city}`}
          </p>
        </div>

        {/* Desktop: split list+map, Mobile: toggle */}
        {viewMode === "map" ? (
          /* Full Map View */
          <div className="h-[calc(100vh-260px)] min-h-[500px] w-full">
            <ApartmentMap
              apartments={apartments}
              activeId={activeId}
              onApartmentClick={(id) => setActiveId(id)}
            />
          </div>
        ) : (
          /* List View — with optional side-map on desktop */
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Listings */}
            <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {apartments.length > 0 ? (
                apartments.map((apt) => (
                  <div
                    key={apt.id}
                    onMouseEnter={() => setActiveId(apt.id)}
                    onMouseLeave={() => setActiveId(null)}
                  >
                    <ApartmentCard apartment={apt} isHighlighted={activeId === apt.id} />
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-sand-300 bg-white p-10 text-center">
                  <div className="text-3xl mb-3">🔍</div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Ничего не найдено</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Попробуйте изменить параметры фильтров или выбрать другой город.
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Map on Desktop */}
            <div className="hidden xl:block xl:col-span-2">
              <div className="sticky top-36 h-[calc(100vh-180px)] min-h-[500px] rounded-3xl overflow-hidden">
                <ApartmentMap
                  apartments={apartments}
                  activeId={activeId}
                  onApartmentClick={(id) => {
                    setActiveId(id);
                    const el = document.getElementById(`card-${id}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
