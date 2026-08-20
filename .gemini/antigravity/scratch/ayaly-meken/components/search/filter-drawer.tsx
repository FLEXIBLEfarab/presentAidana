"use client";

import { useState, useCallback } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { SearchFilters, SortOption } from "@/types/database.types";
import { AMENITY_FILTERS, PROPERTY_TYPES, SORT_OPTIONS } from "@/lib/search-filters";
import { formatKZT, cn } from "@/lib/utils";

interface FilterDrawerProps {
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  resultCount: number;
}

export function FilterDrawer({ filters, onApply, resultCount }: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<SearchFilters>(filters);

  const MIN_PRICE = 5000;
  const MAX_PRICE = 100000;

  const toggleAmenity = (amenityId: string) => {
    const current = draft.amenities || [];
    const updated = current.includes(amenityId)
      ? current.filter((a) => a !== amenityId)
      : [...current, amenityId];
    setDraft((prev) => ({ ...prev, amenities: updated }));
  };

  const handleApply = () => {
    onApply(draft);
    setIsOpen(false);
  };

  const handleReset = () => {
    const reset: SearchFilters = {
      city: filters.city,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests,
    };
    setDraft(reset);
    onApply(reset);
    setIsOpen(false);
  };

  const activeFilterCount = [
    draft.minPrice,
    draft.maxPrice,
    draft.bedrooms,
    draft.propertyType && draft.propertyType !== "all" ? draft.propertyType : null,
    ...(draft.amenities || []),
  ].filter(Boolean).length;

  return (
    <>
      {/* Filter Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all shadow-sm",
          activeFilterCount > 0
            ? "border-emerald-900 bg-emerald-900 text-cream-50"
            : "border-sand-300 bg-white text-stone-700 hover:border-emerald-700"
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Фильтры{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">Фильтры</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-stone-400 hover:bg-sand-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-7">
          {/* Sort */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">Сортировка</h3>
            <div className="space-y-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDraft((p) => ({ ...p, sortBy: opt.value as SortOption }))}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
                    draft.sortBy === opt.value
                      ? "border-emerald-800 bg-emerald-50 text-emerald-900 font-bold"
                      : "border-sand-200 text-stone-600 hover:border-emerald-700/50"
                  )}
                >
                  <span className={cn(
                    "h-3.5 w-3.5 rounded-full border-2 flex-shrink-0",
                    draft.sortBy === opt.value
                      ? "border-emerald-800 bg-emerald-800"
                      : "border-sand-300"
                  )} />
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">Ценовой диапазон</h3>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span>{formatKZT(draft.minPrice || MIN_PRICE)}</span>
              <span>{formatKZT(draft.maxPrice || MAX_PRICE)}</span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1000}
                value={draft.minPrice || MIN_PRICE}
                onChange={(e) => setDraft((p) => ({ ...p, minPrice: Number(e.target.value) }))}
                className="w-full accent-emerald-800"
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1000}
                value={draft.maxPrice || MAX_PRICE}
                onChange={(e) => setDraft((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                className="w-full accent-emerald-800"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-stone-400">Стоимость за ночь</p>
          </section>

          {/* Bedrooms */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">Количество спален</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 0, l: "Любое" },
                { v: 1, l: "Студия / 1 сп." },
                { v: 2, l: "2 спальни" },
                { v: 3, l: "3+ спальни" },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setDraft((p) => ({ ...p, bedrooms: v === 0 ? undefined : v }))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    (v === 0 ? !draft.bedrooms : draft.bedrooms === v)
                      ? "border-emerald-900 bg-emerald-900 text-cream-50"
                      : "border-sand-300 text-stone-600 hover:border-emerald-700"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>

          {/* Property Type */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">Тип жилья</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setDraft((p) => ({ ...p, propertyType: pt.id === "all" ? undefined : pt.id }))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    (pt.id === "all" ? !draft.propertyType : draft.propertyType === pt.id)
                      ? "border-emerald-900 bg-emerald-900 text-cream-50"
                      : "border-sand-300 text-stone-600 hover:border-emerald-700"
                  )}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">Удобства</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AMENITY_FILTERS.map((am) => {
                const isActive = (draft.amenities || []).includes(am.id);
                return (
                  <button
                    key={am.id}
                    onClick={() => toggleAmenity(am.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-left transition-all",
                      isActive
                        ? "border-emerald-800 bg-emerald-50 text-emerald-900 font-semibold"
                        : "border-sand-200 text-stone-600 hover:border-emerald-700/40"
                    )}
                  >
                    <span className="text-sm">{am.icon}</span>
                    <span className="leading-tight">{am.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-sand-200 px-6 py-4 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-2xl border border-sand-300 py-3 text-sm font-semibold text-stone-700 hover:bg-sand-50 transition-colors"
          >
            Сбросить
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-2xl bg-emerald-900 py-3 text-sm font-bold text-cream-50 shadow-md hover:bg-emerald-800 active:scale-98 transition-all"
          >
            Показать {resultCount} жилья
          </button>
        </div>
      </div>
    </>
  );
}
