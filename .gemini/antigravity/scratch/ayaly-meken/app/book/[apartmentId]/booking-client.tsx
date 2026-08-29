"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ShieldCheck, CreditCard, QrCode, Sparkles, Lock, Phone, Mail,
  User, CheckCircle, Loader2, AlertCircle, MessageCircle, Send, Users
} from "lucide-react";
import { Apartment } from "@/types/database.types";
import {
  calculateBookingPrice,
  formatKZT,
  formatDateRange,
  buildWhatsAppLink,
  validateGuestAge,
  getBirthDateFromIin,
} from "@/lib/utils";
import { BookingSummary } from "@/components/booking/booking-summary";
import { KaspiQrModal } from "@/components/booking/kaspi-qr-modal";
import { createBooking } from "@/actions/bookings";

import { useGuestAuth } from "@/lib/auth-context";

interface BookingClientProps {
  apartment: Apartment;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function BookingClient({ apartment, checkIn, checkOut, guests }: BookingClientProps) {
  const router = useRouter();
  const { user, login } = useGuestAuth();

  const [firstName, setFirstName] = useState(user?.name ? user.name.split(" ")[0] || "" : "");
  const [lastName, setLastName] = useState(user?.name ? user.name.split(" ").slice(1).join(" ") || "" : "");
  const [phone, setPhone] = useState(user?.phone || "+7 ");
  const [email, setEmail] = useState(user?.email || "");
  const [birthDate, setBirthDate] = useState("");
  const [iin, setIin] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [guestsCount, setGuestsCount] = useState(guests);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"kaspi_qr" | "kaspi_transfer" | "card_online" | "cash">("kaspi_qr");
  const [isKaspiModalOpen, setIsKaspiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const priceInfo = calculateBookingPrice({
    baseNightPrice: apartment.base_night_price,
    checkIn,
    checkOut,
  });

  const ageCheck = validateGuestAge({ birthDate, iin });

  const handleIinChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 12);
    setIin(clean);
    if (clean.length === 12) {
      const parsedDob = getBirthDateFromIin(clean);
      if (parsedDob && !birthDate) {
        setBirthDate(parsedDob);
      }
    }
  };

  const validate = () => {
    if (!firstName.trim()) return "Введите ваше имя";
    if (!lastName.trim()) return "Введите вашу фамилию";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 11) return "Введите корректный номер телефона (+7...)";
    if (!birthDate && !iin) return "Укажите дату рождения для подтверждения возраста (16+ лет)";
    if (!ageCheck.isValid) return ageCheck.error || "Бронирование доступно только лицам от 16 лет";
    if (!ageConfirmed) return "Пожалуйста, подтвердите, что вам исполнилось 16 лет";
    return null;
  };

  const handleBookingSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const err = validate();
    if (err) { setErrorMessage(err); return; }
    setErrorMessage("");
    if (paymentMethod === "kaspi_qr") { setIsKaspiModalOpen(true); return; }
    await finalizeBooking();
  };

  const finalizeBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await createBooking({
        apartmentId: apartment.id,
        guestFirstName: firstName,
        guestLastName: lastName,
        guestPhone: phone,
        guestEmail: email || undefined,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount,
        totalPrice: priceInfo.total,
        nightlyPrice: apartment.base_night_price,
        cleaningFee: priceInfo.cleaningFee,
        serviceFee: priceInfo.serviceFee,
        depositAmount: priceInfo.depositAmount,
        paymentMethod,
        notes: notes || undefined,
      });

      if (res.success && res.data) {
        // Persist guest session
        login(phone, `${firstName} ${lastName}`.trim(), email || undefined);
        setIsKaspiModalOpen(false);
        router.push(`/bookings/${res.data.id}`);
      } else {
        setErrorMessage(res.error || "Не удалось подтвердить бронирование. Попробуйте снова.");
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage("Произошла непредвиденная ошибка. Попробуйте снова.");
      setIsSubmitting(false);
    }
  };

  // WhatsApp confirmation link (requires a booking ID — generated upon submission)
  const whatsappDraftLink = buildWhatsAppLink({
    phone: "77001234567",
    apartmentName: apartment.name,
    dates: formatDateRange(checkIn, checkOut),
    bookingId: "ПРЕДВАРИТЕЛЬНАЯ",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-sand-300">
        <Link href={`/apartments/${apartment.id}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 bg-white text-stone-700 hover:bg-sand-100">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Подтверждение и оплата</h1>
          <p className="text-xs text-stone-500">Ayaly Meken · Мгновенное цифровое бронирование</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* LEFT: Form */}
        <form onSubmit={handleBookingSubmit} className="lg:col-span-7 space-y-8">
          {/* Guest Details */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-stone-900">1. Данные гостя</h2>
              <span className="text-xs text-emerald-800 font-semibold">Для ПИН-кода двери</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700">Имя <span className="text-red-500">*</span></label>
                <div className="mt-1 flex items-center rounded-2xl border border-sand-300 bg-cream-50/50 px-3.5 py-2.5">
                  <User className="h-4 w-4 text-stone-400 mr-2 shrink-0" />
                  <input type="text" required placeholder="Арман" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-stone-900 outline-none" />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700">Фамилия <span className="text-red-500">*</span></label>
                <div className="mt-1 flex items-center rounded-2xl border border-sand-300 bg-cream-50/50 px-3.5 py-2.5">
                  <User className="h-4 w-4 text-stone-400 mr-2 shrink-0" />
                  <input type="text" required placeholder="Нургалиев" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-stone-900 outline-none" />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-700">WhatsApp / Телефон <span className="text-red-500">*</span></label>
              <div className="mt-1 flex items-center rounded-2xl border border-sand-300 bg-cream-50/50 px-3.5 py-2.5">
                <Phone className="h-4 w-4 text-stone-400 mr-2 shrink-0" />
                <input type="tel" required placeholder="+7 (777) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-stone-900 outline-none" />
              </div>
              <p className="mt-1 text-[11px] text-stone-400">Сюда придёт цифровой ПИН-код двери и информация по Wi-Fi через WhatsApp/SMS.</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-stone-700">Email (необязательно)</label>
              <div className="mt-1 flex items-center rounded-2xl border border-sand-300 bg-cream-50/50 px-3.5 py-2.5">
                <Mail className="h-4 w-4 text-stone-400 mr-2 shrink-0" />
                <input type="email" placeholder="arman@example.kz" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-stone-900 outline-none" />
              </div>
            </div>

            {/* Guests Count */}
            <div>
              <label className="block text-xs font-bold text-stone-700">Количество гостей</label>
              <div className="mt-1 flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-cream-50/50 px-3.5 py-2.5">
                  <Users className="h-4 w-4 text-stone-400" />
                  <button type="button" onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))} className="flex h-6 w-6 items-center justify-center rounded-full border border-sand-300 text-stone-700 font-bold text-sm hover:bg-sand-100">-</button>
                  <span className="font-bold text-stone-800 min-w-[1ch] text-center text-sm">{guestsCount}</span>
                  <button type="button" onClick={() => setGuestsCount(Math.min(apartment.max_guests || 6, guestsCount + 1))} className="flex h-6 w-6 items-center justify-center rounded-full border border-sand-300 text-stone-700 font-bold text-sm hover:bg-sand-100">+</button>
                </div>
                <span className="text-xs text-stone-500">Макс. {apartment.max_guests || 6} гостей</span>
              </div>
            </div>

            {/* Age & Identity Verification (16+ Rule) */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Подтверждение возраста (16+)</span>
                </div>
                {ageCheck.isValid && (birthDate || iin) ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    {ageCheck.age ? `${ageCheck.age} лет (16+ подтверждено)` : "16+ подтверждено"}
                  </span>
                ) : !ageCheck.isValid ? (
                  <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    Младше 16 лет
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-500 font-semibold">Бронирование доступно с 16 лет</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Birth Date */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700">
                    Дата рождения <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex items-center rounded-2xl border border-sand-300 bg-white px-3 py-2">
                    <input
                      type="date"
                      required
                      max="2010-12-31"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-stone-900 outline-none"
                    />
                  </div>
                </div>

                {/* Kazakhstani IIN (Optional auto-calculator) */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700">
                    ИИН / ЖСН РК (12 цифр)
                  </label>
                  <div className="mt-1 flex items-center rounded-2xl border border-sand-300 bg-white px-3 py-2">
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="080512501234"
                      value={iin}
                      onChange={(e) => handleIinChange(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-stone-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {!ageCheck.isValid && (
                <div className="text-[11px] font-bold text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {ageCheck.error}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700">Особые пожелания / время прибытия</label>
              <textarea rows={2} placeholder="Например: приеду около 18:00, нужна детская кроватка..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-2xl border border-sand-300 bg-cream-50/50 p-3 text-xs text-stone-900 outline-none resize-none" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft space-y-4">
            <h2 className="font-serif text-base font-bold text-stone-900">2. Способ оплаты</h2>
            <div className="space-y-2.5">
              {[
                {
                  id: "kaspi_qr" as const,
                  label: "Kaspi QR (Рекомендуется)",
                  sub: "Сканируйте QR в Kaspi.kz · Мгновенный ПИН",
                  badge: "0% Комиссия",
                  icon: <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F14635] text-white font-black text-sm shrink-0">K</div>,
                },
                {
                  id: "card_online" as const,
                  label: "Банковская карта (Visa / Mastercard)",
                  sub: "Халык, Фридом, Центркредит, Apple Pay",
                  badge: null,
                  icon: <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-800 text-white shrink-0"><CreditCard className="h-4 w-4" /></div>,
                },
                {
                  id: "cash" as const,
                  label: "Оплата при заселении",
                  sub: "Наличными или Kaspi-переводом при заезде",
                  badge: null,
                  icon: <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-900 text-amber-300 shrink-0"><Sparkles className="h-4 w-4" /></div>,
                },
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${paymentMethod === pm.id ? "border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/20" : "border-sand-300 hover:border-emerald-700/50"}`}
                >
                  <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="sr-only" />
                  {pm.icon}
                  <div className="flex-1">
                    <span className="text-xs font-bold text-stone-900">{pm.label}</span>
                    <p className="text-[11px] text-stone-500">{pm.sub}</p>
                  </div>
                  {pm.badge && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#F14635]">{pm.badge}</span>}
                  <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${paymentMethod === pm.id ? "border-emerald-800 bg-emerald-800" : "border-sand-300"}`} />
                </label>
              ))}
            </div>
          </div>

          {/* WhatsApp Confirmation Card */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-950">WhatsApp подтверждение за 1 клик</h3>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  После бронирования нажмите кнопку ниже — хозяин получит вашу заявку с Kaspi-реквизитами на казахском языке.
                </p>
              </div>
            </div>
            <a
              href={whatsappDraftLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 active:scale-98 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Написать хозяину в WhatsApp</span>
            </a>
          </div>

          {/* Cancellation Policy */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-sm font-bold text-stone-900">Условия отмены</h3>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              <strong>Бесплатная отмена</strong> до 24 часов до заезда. При отмене менее чем за 24 часа — первая ночь невозвратная.
            </p>
          </div>

          {/* Age and Terms Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none rounded-2xl border border-sand-300 bg-white p-3.5 shadow-2xs hover:bg-sand-50/50 transition-all">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-emerald-800 border-sand-400 focus:ring-emerald-800 shrink-0 cursor-pointer"
            />
            <span className="text-[11px] text-stone-700 leading-snug">
              Мне исполнилось <strong>16 лет</strong>. Я подтверждаю достоверность данных и принимаю правила проживания и публичную оферту.
            </span>
          </label>

          {/* Error */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={isSubmitting || !ageCheck.isValid} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 py-4 text-sm font-bold text-cream-50 shadow-md transition-all hover:bg-emerald-800 active:scale-98 disabled:opacity-70 cursor-pointer">
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /><span>Обработка бронирования...</span></>
            ) : (
              <><Lock className="h-4 w-4 text-amber-300" /><span>Завершить бронирование · {formatKZT(priceInfo.total)}</span></>
            )}
          </button>
        </form>

        {/* RIGHT: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <BookingSummary apartment={apartment} priceInfo={priceInfo} checkIn={checkIn} checkOut={checkOut} guests={guestsCount} />
          </div>
        </div>
      </div>

      <KaspiQrModal
        amount={priceInfo.total}
        isOpen={isKaspiModalOpen}
        onClose={() => setIsKaspiModalOpen(false)}
        onSuccess={finalizeBooking}
        hostName={apartment.custom_kaspi_name || `Владелец «${apartment.name}»`}
        hostPhone={apartment.custom_kaspi_phone || "+7 (777) 123-4567"}
      />
    </div>
  );
}
