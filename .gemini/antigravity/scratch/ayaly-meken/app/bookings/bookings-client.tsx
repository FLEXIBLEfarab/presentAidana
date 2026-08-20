"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGuestAuth } from "@/lib/auth-context";
import { getBookings } from "@/actions/bookings";
import { Booking } from "@/types/database.types";
import { formatKZT, formatDateRange } from "@/lib/utils";
import {
  Luggage, Calendar, KeyRound, ChevronRight, Sparkles, MapPin, Clock, MessageCircle, User, LogIn, Loader2, Star, ThumbsUp
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
  const { user, isLoading: isAuthLoading, openAuthModal } = useGuestAuth();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
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

      {/* Bookings List */}
      <div className="mt-8 space-y-6">
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
        ) : bookings.length > 0 ? (
          bookings.map((booking) => {
            const apt = booking.apartment;
            const cover =
              apt?.cover_image ||
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop";
            const statusLabel = statusLabels[booking.status] || booking.status;
            const isCheckedOut = booking.status === "checked_out";
            const pinDisplay = isCheckedOut
              ? "Отозван"
              : booking.door_pin_code || booking.ttlock_passcode || "—";

            return (
              <div
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-sand-300 bg-white p-5 shadow-soft transition-all hover:shadow-card sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Property Thumbnail */}
                  <div className="relative h-44 sm:h-36 sm:w-48 shrink-0 overflow-hidden rounded-2xl bg-sand-200">
                    <Image
                      src={cover}
                      alt={apt?.name || "Apartment"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute left-2 top-2 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-cream-50 backdrop-blur-md">
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
                    </div>

                    {/* PIN & Actions Row */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
                          <KeyRound className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Цифровой ПИН
                          </span>
                          <div className={`font-mono text-sm font-black tracking-wider ${isCheckedOut ? "text-stone-400" : "text-emerald-950"}`}>
                            {pinDisplay}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-stone-900">
                          {formatKZT(booking.total_price)}
                        </span>

                        {/* Review button */}
                        <button
                          type="button"
                          onClick={() => setReviewBooking(booking)}
                          className="flex items-center gap-1.5 rounded-2xl border border-amber-400 bg-amber-50/80 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all cursor-pointer"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>Отзыв</span>
                        </button>

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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-sand-300 bg-white p-12 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 mb-3">
              <Luggage className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Поездок пока нет</h3>
            <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
              Выберите понравившиеся апартаменты в Алматы, Астане или Шымкенте и забронируйте онлайн в 1 клик.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-6 py-3 text-xs font-bold text-cream-50 shadow-md hover:bg-emerald-800"
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
          isOpen={true}
          onClose={() => setReviewBooking(null)}
          apartmentId={reviewBooking.apartment_id}
          apartmentName={reviewBooking.apartment?.name || "Апартаменты"}
          bookingId={reviewBooking.id}
        />
      )}
    </div>
  );
}
