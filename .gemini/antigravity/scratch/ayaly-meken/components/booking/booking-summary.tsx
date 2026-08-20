import Image from "next/image";
import { Star, ShieldCheck, MapPin, TrendingDown } from "lucide-react";
import { Apartment } from "@/types/database.types";
import { PriceCalculation, formatKZT, formatDateRange } from "@/lib/utils";

interface BookingSummaryProps {
  apartment: Apartment;
  priceInfo: PriceCalculation;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function BookingSummary({
  apartment,
  priceInfo,
  checkIn,
  checkOut,
  guests,
}: BookingSummaryProps) {
  const cover =
    apartment.cover_image ||
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft space-y-6">
      {/* Property Thumbnail & Title */}
      <div className="flex gap-4">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-sand-200">
          <Image src={cover} alt={apartment.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
              <MapPin className="h-3 w-3" />
              <span>
                {apartment.city}
                {apartment.district ? ` · ${apartment.district}` : ""}
              </span>
            </div>
            <h3 className="font-serif text-sm font-bold text-stone-900 line-clamp-2 mt-0.5">
              {apartment.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-stone-800">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{apartment.rating || "4.95"}</span>
            <span className="text-stone-400 font-normal">
              ({apartment.reviews_count || 32} отзыва)
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-sand-200" />

      {/* Reservation Details */}
      <div className="space-y-3 text-xs">
        <h4 className="font-bold uppercase tracking-wider text-emerald-950">Детали поездки</h4>
        <div className="flex justify-between">
          <span className="text-stone-500">Даты</span>
          <span className="font-semibold text-stone-800">{formatDateRange(checkIn, checkOut)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Гостей</span>
          <span className="font-semibold text-stone-800">
            {guests} {guests === 1 ? "гость" : guests < 5 ? "гостя" : "гостей"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Ночей</span>
          <span className="font-semibold text-stone-800">
            {priceInfo.nights} {priceInfo.nights === 1 ? "ночь" : priceInfo.nights < 5 ? "ночи" : "ночей"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Время заезда</span>
          <span className="font-semibold text-stone-800">
            После {apartment.check_in_time || "14:00"}
          </span>
        </div>
      </div>

      <div className="border-t border-sand-200" />

      {/* Price Details */}
      <div className="space-y-2.5 text-xs text-stone-600">
        <h4 className="font-bold uppercase tracking-wider text-emerald-950">Стоимость</h4>
        <div className="flex justify-between">
          <span>
            {formatKZT(apartment.base_night_price)} × {priceInfo.nights}{" "}
            {priceInfo.nights === 1 ? "ночь" : priceInfo.nights < 5 ? "ночи" : "ночей"}
          </span>
          <span className="font-semibold text-stone-800">{formatKZT(priceInfo.baseTotal)}</span>
        </div>

        <div className="flex items-center justify-between border-t border-sand-200 pt-3 text-sm font-bold text-emerald-950">
          <span>Итого (KZT)</span>
          <span className="text-lg font-extrabold">{formatKZT(priceInfo.total)}</span>
        </div>
      </div>

      {/* Guarantee Badge */}
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 text-xs text-emerald-900 border border-emerald-100">
        <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
        <span>
          Гарантия Ayaly Meken: проверенные замки, безупречная чистота, мгновенная поддержка хозяина.
        </span>
      </div>
    </div>
  );
}
