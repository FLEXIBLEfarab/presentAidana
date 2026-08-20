"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ChevronLeft, Send, Loader2, AlertCircle, CheckCircle2,
  BedDouble, Clock, AlertTriangle, Camera, X
} from "lucide-react";
import { Booking, ServiceRequestType } from "@/types/database.types";
import { createServiceRequest } from "@/actions/bookings";
import { formatKZT } from "@/lib/utils";
import Link from "next/link";

interface GuestHubClientProps {
  booking: Booking;
}

interface ServiceOption {
  type: ServiceRequestType;
  icon: string;
  label: string;
  sub: string;
  price?: number;
  requiresNote?: boolean;
  requiresPhoto?: boolean;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { type: "extra_cleaning", icon: "🧹", label: "Внеплановая уборка", sub: "Профессиональный клининг апартаментов", price: 4000 },
  { type: "extra_linen", icon: "🛏️", label: "Доп. комплект белья", sub: "Свежие полотенца, постельное бельё и подушки", price: 2000 },
  { type: "late_checkout", icon: "⏰", label: "Поздний выезд (до 15:00)", sub: "Освободите апартаменты до 15:00 вместо 12:00" },
  { type: "issue_report", icon: "⚠️", label: "Сообщить о неисправности", sub: "Сантехника, техника, мебель или другая проблема", requiresNote: true, requiresPhoto: true },
];

export function GuestHubClient({ booking }: GuestHubClientProps) {
  const [activeType, setActiveType] = useState<ServiceRequestType | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<ServiceRequestType | null>(null);
  const [error, setError] = useState("");

  const apt = booking.apartment;

  const handleRequest = async (opt: ServiceOption) => {
    if (opt.requiresNote && !note.trim()) {
      setError("Пожалуйста, опишите проблему перед отправкой.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await createServiceRequest({
        bookingId: booking.id,
        apartmentId: booking.apartment_id,
        type: opt.type,
        guestNotes: note || opt.label,
        price: opt.price,
      });

      if (res.success) {
        setSuccess(opt.type);
        setActiveType(null);
        setNote("");
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError("Не удалось отправить запрос. Попробуйте снова.");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте снова.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-sand-300">
        <Link href={`/bookings/${booking.id}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 bg-white text-stone-700 hover:bg-sand-100">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold text-stone-900">Консьерж-услуги 🛎️</h1>
          <p className="text-xs text-stone-500">{apt?.name || "Ваши апартаменты"}</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
          <span>Запрос отправлен! Хозяин получит уведомление и скоро свяжется с вами.</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Service Cards Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICE_OPTIONS.map((opt) => {
          const isActive = activeType === opt.type;

          return (
            <div
              key={opt.type}
              className={`rounded-3xl border bg-white shadow-soft transition-all overflow-hidden ${
                isActive ? "border-emerald-800 ring-2 ring-emerald-800/15" : "border-sand-300 hover:border-emerald-700/50"
              }`}
            >
              {/* Card Header */}
              <div
                className="flex items-start gap-4 p-5 cursor-pointer"
                onClick={() => setActiveType(isActive ? null : opt.type)}
              >
                <div className="text-3xl shrink-0 leading-none">{opt.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-stone-900">{opt.label}</h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{opt.sub}</p>
                  {opt.price && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
                      {formatKZT(opt.price)}
                    </span>
                  )}
                </div>
                <div className={`shrink-0 h-5 w-5 rounded-full border-2 mt-0.5 ${isActive ? "border-emerald-800 bg-emerald-800" : "border-sand-300"}`} />
              </div>

              {/* Expanded: Note + Submit */}
              {isActive && (
                <div className="px-5 pb-5 pt-0 border-t border-sand-200 space-y-3">
                  {opt.requiresNote && (
                    <div className="mt-3">
                      <label className="block text-xs font-bold text-stone-700 mb-1">Опишите проблему</label>
                      <textarea
                        rows={3}
                        placeholder="Например: не работает кондиционер в спальне..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-2xl border border-sand-300 bg-cream-50/50 p-3 text-xs text-stone-900 outline-none resize-none focus:border-emerald-700"
                      />
                    </div>
                  )}

                  {opt.requiresPhoto && (
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 bg-sand-50 rounded-xl px-3 py-2 border border-sand-200">
                      <Camera className="h-3.5 w-3.5" />
                      <span>Фото неисправности можно отправить в WhatsApp нашему менеджеру</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleRequest(opt)}
                    disabled={sending}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 py-3 text-xs font-bold text-cream-50 shadow-md hover:bg-emerald-800 active:scale-98 transition-all disabled:opacity-70"
                  >
                    {sending ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /><span>Отправляю...</span></>
                    ) : (
                      <><Send className="h-4 w-4 text-amber-300" /><span>Отправить запрос</span></>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Note about PMS routing */}
      <div className="mt-8 flex items-start gap-3 rounded-3xl border border-sand-300 bg-sand-50/60 p-5">
        <Sparkles className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-stone-900">Мгновенная маршрутизация запросов</h4>
          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
            Все запросы автоматически направляются в систему управления Altyn Qonaq PMS, где уборщики и технические специалисты получают задание в реальном времени.
          </p>
        </div>
      </div>
    </div>
  );
}
