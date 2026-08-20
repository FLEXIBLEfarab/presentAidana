"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { Sparkles, Calendar, Users, ShieldCheck, Zap, Info, TrendingDown } from "lucide-react";
import { Apartment } from "@/types/database.types";
import { calculateBookingPrice, formatKZT } from "@/lib/utils";

interface BookingWidgetProps {
  apartment: Apartment;
}

export function BookingWidget({ apartment }: BookingWidgetProps) {
  const router = useRouter();

  const today = new Date();
  const defaultCheckIn = format(addDays(today, 1), "yyyy-MM-dd");
  const defaultCheckOut = format(addDays(today, 4), "yyyy-MM-dd");

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState("2");

  const priceInfo = calculateBookingPrice({
    baseNightPrice: apartment.base_night_price,
    checkIn,
    checkOut,
    weekendSurgeEnabled: apartment.weekend_surge_enabled,
    weekendSurgePercent: apartment.weekend_surge_percent || 15,
    cleaningFee: 3500,
    serviceFeePercent: 5,
    longStayDiscountEnabled: apartment.long_stay_discounts_enabled,
    depositAmount: apartment.deposit_default || 15000,
  });

  const handleReserve = () => {
    const params = new URLSearchParams({ checkIn, checkOut, guests });
    router.push(`/book/${apartment.id}?${params.toString()}`);
  };

  const discountBadges = [
    { nights: 3, pct: 5 },
    { nights: 7, pct: 10 },
    { nights: 28, pct: 20 },
  ];

  return (
    <div className="rounded-3xl border border-sand-300/90 bg-white p-6 shadow-card">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-sand-200 pb-4">
        <div>
          <span className="font-serif text-2xl font-extrabold text-emerald-950">{formatKZT(apartment.base_night_price)}</span>
          <span className="text-sm text-stone-500 font-medium"> / ночь</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>Мгновенно</span>
        </div>
      </div>

      {/* Discount Banners */}
      {apartment.long_stay_discounts_enabled && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {discountBadges.map(({ nights, pct }) => (
            <div key={nights} className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
              <TrendingDown className="h-3 w-3" />
              <span>{nights}+ ночей: −{pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Date + Guests Form */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 rounded-2xl border border-sand-300 bg-cream-50/50 p-2">
          <div className="border-r border-sand-300 pr-2">
            <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
              <Calendar className="h-3 w-3" />
              Заезд
            </label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full bg-transparent text-xs font-semibold text-stone-800 outline-none" />
          </div>
          <div className="pl-2">
            <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
              <Calendar className="h-3 w-3" />
              Выезд
            </label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full bg-transparent text-xs font-semibold text-stone-800 outline-none" />
          </div>
        </div>

        <div className="rounded-2xl border border-sand-300 bg-cream-50/50 p-3">
          <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
            <Users className="h-3 w-3" />
            Гости
          </label>
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold text-stone-800 outline-none cursor-pointer">
            {Array.from({ length: apartment.max_guests || 4 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? "гость" : num < 5 ? "гостя" : "гостей"}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 py-4 text-sm font-bold text-cream-50 shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg active:scale-98"
      >
        <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
        <span>Забронировать · {formatKZT(priceInfo.total)}</span>
      </button>
      <p className="mt-2.5 text-center text-[11px] text-stone-500">Списание произойдёт только после подтверждения</p>

      {/* Price Breakdown */}
      <div className="mt-6 space-y-2.5 border-t border-sand-200 pt-5 text-xs text-stone-600">
        <div className="flex justify-between">
          <span className="underline decoration-dotted cursor-help">{formatKZT(apartment.base_night_price)} × {priceInfo.nights} {priceInfo.nights === 1 ? "ночь" : priceInfo.nights < 5 ? "ночи" : "ночей"}</span>
          <span className="font-semibold text-stone-900">{formatKZT(priceInfo.baseTotal)}</span>
        </div>

        {priceInfo.weekendSurgeTotal > 0 && (
          <div className="flex justify-between text-amber-700">
            <span>Наценка выходного дня</span>
            <span className="font-semibold">+{formatKZT(priceInfo.weekendSurgeTotal)}</span>
          </div>
        )}

        {priceInfo.discountTotal > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Скидка за длительность ({priceInfo.discountPercent}%)</span>
            <span>−{formatKZT(priceInfo.discountTotal)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="underline decoration-dotted">Уборка и смена белья</span>
          <span className="font-semibold text-stone-900">{formatKZT(priceInfo.cleaningFee)}</span>
        </div>

        <div className="flex justify-between">
          <span className="underline decoration-dotted">Сервисный сбор Ayaly Meken</span>
          <span className="font-semibold text-stone-900">{formatKZT(priceInfo.serviceFee)}</span>
        </div>

        <div className="flex justify-between text-stone-500">
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            Возвратный депозит
          </span>
          <span className="font-semibold">{formatKZT(priceInfo.depositAmount)}</span>
        </div>

        <div className="flex items-center justify-between border-t border-sand-200 pt-3 text-sm font-bold text-emerald-950">
          <span>Итого (KZT)</span>
          <span className="text-base font-extrabold">{formatKZT(priceInfo.total)}</span>
        </div>
      </div>

      {/* Digital Access Note */}
      <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-sand-100/80 p-3 text-[11px] text-stone-600">
        <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
        <span>Цифровой ПИН-код двери придёт мгновенно после подтверждения. Бесплатная отмена в течение 24 ч.</span>
      </div>
    </div>
  );
}
