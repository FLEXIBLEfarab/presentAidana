"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  KeyRound, Wifi, Copy, Check, MapPin, Clock, MessageCircle, ExternalLink,
  ChevronLeft, Sparkles, ShieldCheck, LockOpen, Lock, AlertCircle
} from "lucide-react";
import { Booking } from "@/types/database.types";
import { formatKZT, formatDateRange, isWithinCheckinWindow, buildWhatsAppLink } from "@/lib/utils";

interface BookingPassClientProps {
  booking: Booking;
}

export function BookingPassClient({ booking }: BookingPassClientProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const apt = booking.apartment;
  const cover = apt?.cover_image || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop";

  const pinActive = isWithinCheckinWindow(
    booking.check_in_date,
    booking.check_out_date
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const whatsappLink = buildWhatsAppLink({
    phone: "77001234567",
    apartmentName: apt?.name || "апартаменты",
    dates: formatDateRange(booking.check_in_date, booking.check_out_date),
    bookingId: booking.id.slice(-8).toUpperCase(),
  });

  const maps2gis = `https://2gis.kz/search/${encodeURIComponent(apt?.address || "")}`;
  const yandexMaps = `https://yandex.kz/maps/?text=${encodeURIComponent(apt?.address || "")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <div className="pb-6">
        <Link href="/bookings" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-950">
          <ChevronLeft className="h-4 w-4" />
          <span>Все поездки</span>
        </Link>
      </div>

      {/* Hero Pass Card */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 text-cream-50 sm:p-8 shadow-card relative">
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-800/60">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/80 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Цифровая карта доступа</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">{apt?.name || "Апартаменты"}</h1>
            <p className="text-xs text-cream-200/80 mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              {apt?.address}, {apt?.city}
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-900/60 p-3 text-right border border-emerald-700/40">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Бронь</span>
            <div className="font-mono text-sm font-black text-cream-50">#{booking.id.slice(-8).toUpperCase()}</div>
            <div className="text-[10px] mt-0.5 font-bold text-emerald-300">
              {booking.status === "confirmed" ? "✅ Подтверждено" : booking.status === "pending_payment" ? "⏳ Ожидает оплаты" : booking.status}
            </div>
          </div>
        </div>

        {/* Dates & Guest Grid */}
        <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {[
            { label: "Заезд", value: booking.check_in_date, sub: `После ${apt?.check_in_time || "14:00"}` },
            { label: "Выезд", value: booking.check_out_date, sub: `До ${apt?.check_out_time || "12:00"}` },
            { label: "Гость", value: booking.guest_name, sub: `${booking.guests_count || 2} чел.` },
            { label: "Статус", value: "Оплачено", sub: formatKZT(booking.total_price) },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <span className="text-[11px] text-emerald-300/80 font-medium">{label}</span>
              <div className="font-bold text-sm text-cream-50 mt-0.5 truncate">{value}</div>
              <span className="text-[10px] text-cream-300">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Access Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Door PIN */}
        <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-900 text-amber-300 shadow-md">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">ПИН-код двери</h3>
                <p className="text-[11px] text-stone-400">TTLock Smart Lock</p>
              </div>
            </div>
            {pinActive ? (
              <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-900">
                <LockOpen className="h-3 w-3" />
                <span>Активен</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-sand-100 px-2.5 py-1 text-[10px] font-bold text-stone-500">
                <Lock className="h-3 w-3" />
                <span>Откроется в {apt?.check_in_time || "14:00"}</span>
              </div>
            )}
          </div>

          {pinActive ? (
            <>
              <div className="rounded-2xl border border-sand-300 bg-cream-50 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Ваш 6-значный ПИН</span>
                  <div className="font-mono text-3xl font-black text-emerald-950 tracking-widest mt-0.5">
                    {booking.door_pin_code || "849201"}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(booking.door_pin_code || "849201", "pin")}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 border border-sand-300 shadow-sm hover:bg-sand-100 active:scale-95"
                >
                  {copied === "pin" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copied === "pin" ? "Скопировано" : "Копировать"}</span>
                </button>
              </div>

              <div className="rounded-xl bg-sand-100/70 p-3 text-xs text-stone-600 space-y-1">
                <div className="font-bold text-stone-800">Как открыть замок:</div>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                  <li>Коснитесь клавиатуры — загорятся огни</li>
                  <li>Введите ПИН: <strong className="font-mono">{booking.door_pin_code || "849201"}</strong> и нажмите <strong>#</strong></li>
                  <li>Поверните ручку вниз при зелёном сигнале и звуке</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-sand-200 bg-sand-50 p-4 flex items-center gap-3 text-xs text-stone-600">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-stone-800">ПИН-код активируется в день заезда</p>
                <p className="mt-0.5">Код станет доступен после {apt?.check_in_time || "14:00"} {booking.check_in_date}.</p>
              </div>
            </div>
          )}
        </div>

        {/* Wi-Fi */}
        <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">Wi-Fi сеть</h3>
              <p className="text-[11px] text-stone-400">500 Мбит/с · Без лимита</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-2xl border border-sand-300 bg-cream-50 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Сеть (SSID)</span>
              <div className="font-mono text-xs font-bold text-stone-900 mt-0.5">{apt?.wifi_name || "AyalyMeken_Guest_5G"}</div>
            </div>
            <div className="rounded-2xl border border-sand-300 bg-cream-50 p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Пароль</span>
                <div className="font-mono text-xs font-bold text-emerald-950 mt-0.5">{apt?.wifi_password || "ayaly_meken_2026"}</div>
              </div>
              <button
                onClick={() => handleCopy(apt?.wifi_password || "ayaly_meken_2026", "wifi")}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 border border-sand-300 shadow-sm hover:bg-sand-100 active:scale-95"
              >
                {copied === "wifi" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied === "wifi" ? "Скоп." : "Копировать"}</span>
              </button>
            </div>
          </div>

          {apt?.intercom_code && (
            <div className="flex items-center justify-between rounded-xl bg-sand-100/70 p-2.5 text-xs text-stone-700">
              <span>Домофон: <strong className="font-mono">{apt.intercom_code}</strong></span>
              <button onClick={() => handleCopy(apt.intercom_code!, "intercom")} className="text-[11px] font-bold text-emerald-800 hover:underline">
                {copied === "intercom" ? "Скопировано" : "Копировать"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation & Concierge */}
      <div className="mt-6 rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
        <h3 className="font-serif text-base font-bold text-stone-900 mb-4">Маршрут и поддержка</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href={maps2gis} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-sand-300 p-3.5 hover:border-emerald-800 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900 font-black text-sm shrink-0">2G</div>
            <div><span className="text-xs font-bold text-stone-900">2GIS</span><p className="text-[11px] text-stone-500">Точная навигация</p></div>
            <ExternalLink className="h-4 w-4 text-stone-400 ml-auto" />
          </a>

          <a href={yandexMaps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-sand-300 p-3.5 hover:border-emerald-800 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-black text-sm shrink-0">Я</div>
            <div><span className="text-xs font-bold text-stone-900">Яндекс Карты</span><p className="text-[11px] text-stone-500">Пробки и маршрут</p></div>
            <ExternalLink className="h-4 w-4 text-stone-400 ml-auto" />
          </a>

          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 hover:bg-emerald-50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div><span className="text-xs font-bold text-emerald-950">WhatsApp 24/7</span><p className="text-[11px] text-emerald-700">Консьерж хозяина</p></div>
            <ExternalLink className="h-4 w-4 text-emerald-700 ml-auto" />
          </a>
        </div>
      </div>

      {/* Concierge Services Link */}
      <div className="mt-6">
        <Link
          href={`/guest/${booking.id}`}
          className="flex items-center justify-between rounded-3xl border border-sand-300 bg-gradient-to-r from-cream-50 to-sand-100 p-5 shadow-soft hover:shadow-card transition-all group"
        >
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-emerald-900">Консьерж-услуги 🛎️</h3>
            <p className="text-xs text-stone-500 mt-0.5">Уборка, бельё, поздний выезд и сообщение о неисправностях</p>
          </div>
          <div className="rounded-full bg-emerald-900 p-2.5 text-cream-50 group-hover:scale-110 transition-transform">
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </div>
        </Link>
      </div>
    </div>
  );
}
