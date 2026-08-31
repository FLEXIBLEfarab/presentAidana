"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGuestAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { getBookings } from "@/actions/bookings";
import { Booking } from "@/types/database.types";
import { formatKZT, formatDateRange } from "@/lib/utils";
import {
  Luggage, Calendar, KeyRound,
  Key, ChevronRight, Sparkles, MapPin, Clock, MessageCircle, User, LogIn, Loader2, Star, AlertTriangle, XCircle, CheckCircle2
} from "lucide-react";
import { ReviewModal } from "@/components/reviews/review-modal";

const statusLabels: Record<string, string> = {
  confirmed: "✅ Подтверждено",
  pending_payment: "⏳ Ожидает оплаты",
  pending: "⏳ В обработке",
  checked_in: "🔑 Заселён",
  checked_out: "✔ Выезд оформлен",
  cancelled: "❌ Отменено",
};

export function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const { t } = useI18n();
  const { user, isLoading: isAuthLoading, openAuthModal } = useGuestAuth();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<"active" | "history" | "cancelled">("active");
  const [isLoading, setIsLoading] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadUserBookings() {
      if (!user) {
        setBookings([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await getBookings(user.phone);
        if (res.success && res.data) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading) {
      loadUserBookings();
    }
  }, [user, isAuthLoading]);

  const activeBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "checked_in" || b.status === "pending");
  const historyBookings = bookings.filter((b) => b.status === "checked_out");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  const currentDisplayList =
    activeTab === "active"
      ? activeBookings
      : activeTab === "history"
      ? historyBookings
      : cancelledBookings;

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-sand-300 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold sm:text-3xl text-stone-900">
            Мои поездки 🧳
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            {user ? (
              <span>Бронирования для гостя: <strong className="text-emerald-950 font-bold">{user.name}</strong> ({user.phone})</span>
            ) : (
              <span>Войдите в аккаунт, чтобы просматривать персональные цифровые пропуска.</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!user ? (
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-5 py-2.5 text-xs font-bold text-cream-50 shadow-md hover:bg-emerald-800 transition-all active:scale-95"
            >
              <LogIn className="h-4 w-4 text-amber-300" />
              <span>Войти / Регистрация</span>
            </button>
          ) : (
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-4 py-2 text-xs font-bold text-cream-50 shadow-sm hover:bg-emerald-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Забронировать ещё</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Filter */}
      {user && (
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "active"
                ? "bg-emerald-950 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-sand-100 border border-sand-200"
            }`}
          >
            <span>Активные</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${activeTab === "active" ? "bg-emerald-800 text-amber-300" : "bg-sand-200 text-stone-700"}`}>
              {activeBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-emerald-950 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-sand-100 border border-sand-200"
            }`}
          >
            <span>Завершённые</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${activeTab === "history" ? "bg-emerald-800 text-amber-300" : "bg-sand-200 text-stone-700"}`}>
              {historyBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cancelled")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "cancelled"
                ? "bg-rose-950 text-white shadow-xs"
                : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            <span>Отменённые</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${activeTab === "cancelled" ? "bg-rose-800 text-rose-100" : "bg-rose-100 text-rose-700"}`}>
              {cancelledBookings.length}
            </span>
          </button>
        </div>
      )}

      {/* Bookings List */}
      <div className="mt-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-800 mb-2" />
            <p className="text-xs text-stone-500">Загрузка ваших поездок...</p>
          </div>
        ) : !user ? (
          <div className="rounded-3xl border border-sand-300 bg-white p-12 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 mb-3">
              <User className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Вы не авторизованы</h3>
            <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
              Войдите по номеру телефона, чтобы увидеть все оформленные бронирования и цифровые ключи.
            </p>
            <button
              onClick={openAuthModal}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-6 py-3 text-xs font-bold text-cream-50 shadow-md hover:bg-emerald-800 active:scale-95 transition-all"
            >
              <LogIn className="h-4 w-4 text-amber-300" />
              <span>Войти или Зарегистрироваться</span>
            </button>
          </div>
        ) : currentDisplayList.length > 0 ? (
          currentDisplayList.map((booking) => {
            const apt = booking.apartment;
            const cover =
              apt?.cover_image ||
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop";
            const isCancelled = booking.status === "cancelled";
            const isCheckedOut = booking.status === "checked_out";
            const statusLabel = statusLabels[booking.status] || booking.status;
            const pinDisplay = isCancelled
              ? "Деактивирован"
              : isCheckedOut
              ? "Отозван"
              : booking.door_pin_code || booking.ttlock_passcode || "—";

            return (
              <div
                key={booking.id}
                className={`overflow-hidden rounded-3xl border p-5 shadow-soft transition-all sm:p-6 ${
                  isCancelled
                    ? "border-rose-200 bg-rose-50/20"
                    : "border-sand-300 bg-white hover:shadow-card"
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Property Thumbnail */}
                  <div className="relative h-44 sm:h-36 sm:w-48 shrink-0 overflow-hidden rounded-2xl bg-sand-200">
                    <Image
                      src={cover}
                      alt={apt?.name || "Apartment"}
                      fill
                      className={`object-cover ${isCancelled ? "grayscale opacity-75" : ""}`}
                    />
                    <div className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${
                      isCancelled
                        ? "bg-rose-900/90 text-rose-100"
                        : "bg-emerald-950/80 text-cream-50"
                    }`}>
                      {statusLabel}
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800">
                          <MapPin className="h-3.5 w-3.5" />
                          {apt?.city || "Астана"}
                          {apt?.district ? ` · ${apt.district}` : ""}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          Бронь #{booking.id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="mt-1 font-serif text-base sm:text-lg font-bold text-stone-900">
                        {apt?.name || "Апартаменты"}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-stone-400" />
                          <span>{formatDateRange(booking.check_in_date, booking.check_out_date)}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5 text-stone-400" />
                          <span>Заезд: {apt?.check_in_time || "14:00"}</span>
                        </div>
                      </div>

                      {/* Cancellation Alert Banner */}
                      {isCancelled && (
                        <div className="mt-3 rounded-xl bg-rose-100/70 border border-rose-200 p-2.5 flex items-center gap-2 text-xs text-rose-800">
                          <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                          <span>Это бронирование отменено. Доступ к апартаментам закрыт, цифровые ключи отозваны.</span>
                        </div>
                      )}
                    </div>

                    {/* PIN & Actions Row */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
                      {/* Access Display: Smart Lock PIN OR Physical Keys */}
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          isCancelled ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-900"
                        }`}>
                          {apt?.ttlock_lock_id && apt.ttlock_lock_id !== "none" && apt.ttlock_lock_id !== "lock_default" && apt.ttlock_lock_id !== "" ? (
                            <KeyRound className="h-4 w-4" />
                          ) : (
                            <Key className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            {apt?.ttlock_lock_id && apt.ttlock_lock_id !== "none" && apt.ttlock_lock_id !== "lock_default" && apt.ttlock_lock_id !== ""
                              ? "Цифровой ПИН"
                              : "Способ доступа"}
                          </span>
                          <div className={`font-mono text-sm font-black tracking-wider ${isCancelled || isCheckedOut ? "text-stone-400" : "text-emerald-950"}`}>
                            {isCancelled
                              ? "Отменён"
                              : apt?.ttlock_lock_id && apt.ttlock_lock_id !== "none" && apt.ttlock_lock_id !== "lock_default" && apt.ttlock_lock_id !== ""
                              ? pinDisplay
                              : "🗝️ Ручные ключи"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-extrabold ${isCancelled ? "line-through text-stone-400" : "text-stone-900"}`}>
                          {formatKZT(booking.total_price)}
                        </span>

                        {!isCancelled && (
                          <>
                            {/* Review button - active only after checkout */}
                            {booking.status === "checked_out" || new Date(booking.check_out_date).getTime() <= Date.now() ? (
                              <button
                                type="button"
                                onClick={() => setReviewBooking(booking)}
                                className="flex items-center gap-1.5 rounded-2xl border border-amber-400 bg-amber-50/80 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                              >
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                <span>Оставить отзыв</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setReviewBooking(booking)}
                                className="flex items-center gap-1.5 rounded-2xl border border-sand-200 bg-sand-50 px-2.5 py-1.5 text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
                              >
                                <Clock className="h-3 w-3 text-stone-400" />
                                <span>Отзыв после выезда</span>
                              </button>
                            )}

                            <Link
                              href={`/guest/${booking.id}`}
                              className="flex items-center gap-1.5 rounded-2xl border border-emerald-800 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Консьерж</span>
                            </Link>

                            <Link
                              href={`/bookings/${booking.id}`}
                              className="flex items-center gap-1.5 rounded-2xl bg-emerald-900 px-4 py-2.5 text-xs font-bold text-cream-50 shadow-sm hover:bg-emerald-800 transition-all"
                            >
                              <span>Ключи и карта</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-sand-300 bg-white p-12 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-stone-500 mb-3">
              <Luggage className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {activeTab === "active"
                ? "У вас пока нет активных поездок"
                : activeTab === "history"
                ? "История поездок пуста"
                : "Нет отменённых бронирований"}
            </h3>
            <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
              {activeTab === "active"
                ? "Выберите подходящие апартаменты и забронируйте комфортное проживание."
                : "Все завершённые и отменённые поездки будут сохраняться здесь."}
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-6 py-3 text-xs font-bold text-cream-50 shadow-md hover:bg-emerald-800 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Найти апартаменты</span>
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={Boolean(reviewBooking)}
          onClose={() => setReviewBooking(null)}
          bookingId={reviewBooking.id}
          apartmentId={reviewBooking.apartment_id}
          apartmentName={reviewBooking.apartment?.name || "Апартаменты"}
          onReviewSubmitted={() => {
            setReviewBooking(null);
          }}
        />
      )}
    </div>
  );
}
