"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Sparkles, ShieldCheck, KeyRound, Wifi, CheckCircle2, Share2, Heart,
  ChevronLeft, Grid, Users, BedDouble, Bath, Maximize2, ChevronDown, ChevronUp,
  Zap, Clock, Building2, Mountain, Flag
} from "lucide-react";
import { Apartment, Review } from "@/types/database.types";
import { BookingWidget } from "@/components/apartments/booking-widget";
import { GalleryModal } from "@/components/apartments/gallery-modal";
import { ReviewModal } from "@/components/reviews/review-modal";
import { ReportApartmentModal } from "@/components/apartments/report-apartment-modal";
import { cn } from "@/lib/utils";

interface ApartmentDetailClientProps {
  apartment: Apartment;
  reviews: Review[];
}

export function ApartmentDetailClient({ apartment, reviews }: ApartmentDetailClientProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const images = apartment.images && apartment.images.length > 0
    ? apartment.images
    : [apartment.cover_image || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-950">
          <ChevronLeft className="h-4 w-4" />
          <span>Назад к поиску</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (navigator.share) navigator.share({ title: apartment.name, url: window.location.href }); }}
            className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-sand-100"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Поделиться</span>
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-sand-100"
          >
            <Heart className={cn("h-3.5 w-3.5", isSaved ? "fill-rose-500 text-rose-500" : "")} />
            <span>{isSaved ? "Сохранено" : "Сохранить"}</span>
          </button>
        </div>
      </div>

      {/* Title & Meta */}
      <div className="pb-4">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl lg:text-4xl text-stone-950">{apartment.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-stone-600">
          {reviews.length > 0 ? (
            <div className="flex items-center gap-1 font-bold text-stone-900">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{(reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)}</span>
              <span className="text-stone-400">({reviews.length} {reviews.length === 1 ? "отзыв" : reviews.length < 5 ? "отзыва" : "отзывов"})</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
              <Sparkles className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>Новинка · 0 отзывов</span>
            </div>
          )}
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            {apartment.address}, {apartment.city}
          </span>
        </div>

        {/* Feature Badges Row */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
            <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
            Мгновенное подтверждение
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-800">
            <KeyRound className="h-3 w-3" />
            Самостоятельный заезд 24/7
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 border border-sand-300 px-3 py-1 text-[11px] font-bold text-stone-700">
            <ShieldCheck className="h-3 w-3 text-emerald-700" />
            Проверено Altyn Qonaq
          </span>
        </div>
      </div>

      {/* Photo 5-Grid Collage */}
      <div className="relative mt-2 overflow-hidden rounded-3xl">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[380px] sm:h-[440px]">
          {/* Main Large */}
          <div onClick={() => setIsGalleryOpen(true)} className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden bg-sand-200 rounded-l-3xl">
            <Image src={images[0]} alt={apartment.name} fill priority className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          {/* Side 4 */}
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} onClick={() => setIsGalleryOpen(true)} className={cn("relative cursor-pointer overflow-hidden bg-sand-200", idx === 1 && "rounded-tr-3xl", idx === 3 && "rounded-br-3xl")}>
              <Image src={img} alt={`${apartment.name} ${idx + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>

        {/* Show All Button */}
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2 text-xs font-bold text-stone-900 shadow-md backdrop-blur-md hover:bg-white active:scale-95"
        >
          <Grid className="h-4 w-4" />
          <span>Показать все фото ({images.length})</span>
        </button>
      </div>

      <GalleryModal images={images} apartmentName={apartment.name} isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

      {/* Details + Booking Grid */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* LEFT: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Specs */}
          <div className="flex flex-wrap gap-6 rounded-3xl border border-sand-300 bg-white p-5 shadow-soft">
            {[
              { icon: Users, label: `${apartment.max_guests || 2} гостей`, sub: "Вместимость" },
              { icon: BedDouble, label: `${apartment.bedrooms || 1} спальня`, sub: `${apartment.beds || 2} кровати` },
              { icon: Bath, label: `${apartment.bathrooms || 1} ванная`, sub: "Полный санузел" },
              { icon: Maximize2, label: `${apartment.area_sqm || 55} м²`, sub: `Этаж ${apartment.floor || 5}` },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 text-xs text-stone-700">
                <Icon className="h-5 w-5 text-emerald-800" />
                <div>
                  <span className="block font-bold text-stone-900">{label}</span>
                  <span className="text-[11px] text-stone-400">{sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stay Highlights */}
          <div className="space-y-4 rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-lg font-bold text-stone-900">Преимущества этого жилья</h3>
            <div className="space-y-4">
              {[
                { icon: KeyRound, title: "Самостоятельный заезд с цифровым кодом", body: "Заезжайте в любое время после 14:00 по вашему ПИН-коду." },
                { icon: Wifi, title: "Быстрый выделенный Wi-Fi", body: "Протестированный интернет 500+ Мбит/с, идеален для удалённой работы." },
                { icon: ShieldCheck, title: "Гостиничный стандарт чистоты", body: "Профессиональная уборка перед каждым заездом с отчётом." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-900 shrink-0"><Icon className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-lg font-bold text-stone-900">Об этом жилье</h3>
            <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {apartment.description || "Добро пожаловать в уютные апартаменты высокого класса."}
            </p>
          </div>

          {/* Amenities */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-lg font-bold text-stone-900">Что есть в этом жилье</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(apartment.amenities || ["Бесконтактный заезд (TTLock)", "Wi-Fi высокоскоростной", "Кондиционер", "Стиральная машина", "Кухня", "Кофемашина"]).map((amenity, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Landmarks */}
          {apartment.nearby_landmarks && apartment.nearby_landmarks.length > 0 && (
            <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-stone-900">Рядом с апартаментами</h3>
              <div className="mt-3 space-y-2">
                {apartment.nearby_landmarks.map((lm, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>{lm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules Accordion */}
          <div className="rounded-3xl border border-sand-300 bg-white shadow-soft overflow-hidden">
            <button
              onClick={() => setIsRulesOpen(!isRulesOpen)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
            >
              <h3 className="font-serif text-lg font-bold text-stone-900">Правила дома</h3>
              {isRulesOpen ? <ChevronUp className="h-5 w-5 text-stone-500" /> : <ChevronDown className="h-5 w-5 text-stone-500" />}
            </button>

            {isRulesOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-sand-200 pt-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-cream-50 p-3">
                    <span className="font-bold text-emerald-900">Заезд</span>
                    <p className="text-stone-700 mt-0.5">После {apartment.check_in_time || "14:00"}</p>
                  </div>
                  <div className="rounded-2xl bg-cream-50 p-3">
                    <span className="font-bold text-emerald-900">Выезд</span>
                    <p className="text-stone-700 mt-0.5">До {apartment.check_out_time || "12:00"}</p>
                  </div>
                  <div className="rounded-2xl bg-cream-50 p-3 col-span-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Тихий час
                    </span>
                    <p className="text-stone-700 mt-0.5">С 23:00 до 08:00</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  {(apartment.house_rules || [
                    "Курение строго запрещено в помещении (штраф 25 000 ₸)",
                    "Без вечеринок и шумных мероприятий",
                    "Паспорт обязателен для регистрации"
                  ]).map((rule, i) => <li key={i}>{rule}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {reviews.length > 0
                    ? `${(reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)} · ${reviews.length} ${reviews.length === 1 ? "отзыв" : reviews.length < 5 ? "отзыва" : "отзывов"} гостей`
                    : "Отзывы гостей"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-sand-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 border border-sand-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span>Написать отзыв</span>
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="mt-6 space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        {rev.author_name || rev.guest_name || "Гость"} {rev.author_city ? `· ${rev.author_city}` : ""}
                      </span>
                      <span className="text-[11px] text-stone-400">{rev.date || (rev.created_at ? new Date(rev.created_at).toLocaleDateString("ru-RU") : "Недавно")}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
                  <Sparkles size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">У этой квартиры пока нет отзывов</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Это новое жилье на платформе. Вы можете стать первым гостем, кто остановится здесь и поделится своими впечатлениями!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Report Apartment Listing Link */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Flag size={13} />
              <span>Пожаловаться на объявление</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingWidget apartment={apartment} />
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        apartmentId={apartment.id}
        apartmentName={apartment.name}
      />

      {/* Report Apartment Modal */}
      <ReportApartmentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        apartmentId={apartment.id}
        apartmentName={apartment.name}
      />
    </div>
  );
}
