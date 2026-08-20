"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Sparkles, MapPin, User, Map } from "lucide-react";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useI18n } from "@/lib/i18n/context";

import { useGuestAuth } from "@/lib/auth-context";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { t } = useI18n();
  const { user, openAuthModal, openProfileModal } = useGuestAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/5 bg-cream-50/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative flex h-10 w-10 overflow-hidden rounded-2xl bg-emerald-950 shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform border border-amber-400/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="Ayaly Meken Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-emerald-950 leading-none">
              Ayaly Meken
            </span>
            <span className="hidden sm:block text-[10px] font-medium tracking-widest text-emerald-700/80 uppercase">
              Аялы Мекен • KZ RU
            </span>
          </div>
        </Link>

        {/* Compact Search Trigger (non-homepage) */}
        {!isHome && (
          <Link
            href="/"
            className="hidden md:flex items-center gap-3 rounded-full border border-sand-300/80 bg-white px-4 py-2 text-xs font-medium text-emerald-950 shadow-soft hover:shadow-md transition-all"
          >
            <span className="flex items-center gap-1.5 text-emerald-900 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              Казахстан
            </span>
            <span className="h-4 w-px bg-sand-300" />
            <span className="text-sand-500">{t.search.any_dates}</span>
            <span className="h-4 w-px bg-sand-300" />
            <span className="text-sand-500">{t.search.guests}</span>
            <div className="rounded-full bg-emerald-800 p-1.5 text-white">
              <Search className="h-3 w-3" />
            </div>
          </Link>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Map view toggle */}
          <Link
            href="/map"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:border-emerald-800 transition-all shadow-sm"
          >
            <Map className="h-3.5 w-3.5 text-emerald-700" />
            <span>На карте</span>
          </Link>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* Trips link */}
          <Link
            href="/bookings"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:border-emerald-800 transition-all shadow-sm"
          >
            <span>Мои поездки</span>
          </Link>

          {/* User Account Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openProfileModal}
                className="flex items-center gap-2 rounded-full border border-sand-300 bg-white p-1.5 pr-3 shadow-sm hover:shadow-md hover:border-emerald-600 transition-all text-left group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-900 to-emerald-950 text-cream-50 font-bold text-xs shadow-xs group-hover:scale-105 transition-transform border border-amber-400/30">
                  {user.name ? user.name.slice(0, 1).toUpperCase() : "Г"}
                </div>
                <div className="hidden md:block leading-none">
                  <span className="text-xs font-bold text-stone-800 block group-hover:text-emerald-900 transition-colors">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono">{user.phone}</span>
                </div>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-full bg-emerald-900 hover:bg-emerald-950 text-cream-50 px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <User className="h-3.5 w-3.5 text-amber-300" />
              <span>Войти</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
