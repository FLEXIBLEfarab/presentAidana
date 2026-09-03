"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Star, MapPin, Sparkles, ShieldCheck, KeyRound,
  Key, Wifi, CheckCircle2, Share2, Heart,
  ChevronLeft, Grid, Users, BedDouble, Bath, Maximize2, ChevronDown, ChevronUp,
  Zap, Clock, Building2, Mountain, Flag, Wind, Tv, WashingMachine, UtensilsCrossed,
  Car, Coffee, Flame, HelpCircle, Camera, ImageOff
} from "lucide-react";
import { Apartment, Review } from "@/types/database.types";
import { BookingWidget } from "@/components/apartments/booking-widget";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

// Lazy-load heavy modals — only needed when user interacts
const GalleryModal = dynamic(() => import("@/components/apartments/gallery-modal").then(m => ({ default: m.GalleryModal })), { ssr: false });
const ReviewModal = dynamic(() => import("@/components/reviews/review-modal").then(m => ({ default: m.ReviewModal })), { ssr: false });
const ReportApartmentModal = dynamic(() => import("@/components/apartments/report-apartment-modal").then(m => ({ default: m.ReportApartmentModal })), { ssr: false });

const AMENITY_LABELS: Record<string, { label: string; icon?: any }> = {
  wifi: { label: "Высокоскоростной Wi-Fi", icon: Wifi },
  ac: { label: "Кондиционер", icon: Wind },
  tv: { label: "Smart TV / Кабельное ТВ", icon: Tv },
  washer: { label: "Стиральная машина", icon: WashingMachine },
  dishwasher: { label: "Посудомоечная машина", icon: UtensilsCrossed },
  parking: { label: "Парковочное место", icon: Car },
  coffee: { label: "Кофемашина / Чайник", icon: Coffee },
  balcony: { label: "Балкон / Панорамный вид", icon: Flame },
  kitchen: { label: "Оборудованная кухня и посуда", icon: UtensilsCrossed },
  fridge: { label: "Холодильник", icon: CheckCircle2 },
  iron: { label: "Утюг и гладильная доска", icon: CheckCircle2 },
  hairdryer: { label: "Фен для волос", icon: CheckCircle2 },
  lock: { label: "Бесконтактный умный замок (TTLock)", icon: KeyRound },
  ttlock: { label: "Бесконтактный умный замок (TTLock)", icon: KeyRound },
};

function formatAmenity(raw: string) {
  const key = raw.toLowerCase().trim();
  if (AMENITY_LABELS[key]) {
    return AMENITY_LABELS[key];
  }
  return { label: raw, icon: CheckCircle2 };
}

interface ApartmentDetailClientProps {
  apartment: Apartment;
  reviews: Review[];
}

export function ApartmentDetailClient({ apartment, reviews }: ApartmentDetailClientProps) {
  const { t } = useI18n();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const images = apartment.images && apartment.images.length > 0
    ? apartment.images
    : (apartment.cover_image ? [apartment.cover_image] : []);

  const amenities = apartment.amenities && apartment.amenities.length > 0 ? apartment.amenities : [];
  const landmarks = apartment.nearby_landmarks && apartment.nearby_landmarks.length > 0 ? apartment.nearby_landmarks : [];
  const houseRules = apartment.house_rules && apartment.house_rules.length > 0 ? apartment.house_rules : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-950">
          <ChevronLeft className="h-4 w-4" />
          <span>{t.nav.back_to_search}</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (navigator.share) navigator.share({ title: apartment.name, url: window.location.href }); }}
            className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-sand-100 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{t.nav.share}</span>
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-sand-100 cursor-pointer"
          >
            <Heart className={cn("h-3.5 w-3.5", isSaved ? "fill-rose-500 text-rose-500" : "")} />
            <span>{isSaved ? t.nav.saved_badge : t.nav.save}</span>
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
            Мгновенное бронирование
          </span>
          {apartment.ttlock_lock_id && apartment.ttlock_lock_id !== "none" && apartment.ttlock_lock_id !== "lock_default" && apartment.ttlock_lock_id !== "" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <KeyRound className="h-3 w-3" />
              {t.apartment.self_checkin}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-50 border border-sand-300 px-3 py-1 text-[11px] font-bold text-stone-700">
              <Key className="h-3 w-3 text-amber-600" />
              {t.apartment.manual_keys}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 border border-sand-300 px-3 py-1 text-[11px] font-bold text-stone-700">
            <ShieldCheck className="h-3 w-3 text-emerald-700" />
            Платформа Altyn Qonaq & Ayaly Meken
          </span>
        </div>
      </div>

      {/* Photo Showcase */}
      {images.length > 0 ? (
        <div className="relative mt-2 overflow-hidden rounded-3xl">
          {images.length >= 3 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[360px] sm:h-[440px]">
              <div onClick={() => setIsGalleryOpen(true)} className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden bg-sand-200 rounded-l-3xl">
                <Image src={images[0]} alt={apartment.name} fill priority className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              {images.slice(1, 5).map((img, idx) => (
                <div key={idx} onClick={() => setIsGalleryOpen(true)} className={cn("relative cursor-pointer overflow-hidden bg-sand-200", idx === 1 && "rounded-tr-3xl", idx === 3 && "rounded-br-3xl")}>
                  <Image src={img} alt={`${apartment.name} ${idx + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div onClick={() => setIsGalleryOpen(true)} className="relative h-[320px] sm:h-[420px] w-full rounded-3xl overflow-hidden cursor-pointer bg-sand-200">
              <Image src={images[0]} alt={apartment.name} fill priority className="object-cover hover:scale-102 transition-transform duration-500" />
            </div>
          )}

          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2 text-xs font-bold text-stone-900 shadow-md backdrop-blur-md hover:bg-white active:scale-95 cursor-pointer"
          >
            <Grid className="h-4 w-4" />
            <span>Показать все фото ({images.length})</span>
          </button>
        </div>
      ) : (
        <div className="mt-2 h-64 rounded-3xl border-2 border-dashed border-sand-300 bg-sand-100/60 flex flex-col items-center justify-center text-stone-400 gap-2 p-6 text-center">
          <Camera size={36} className="text-stone-300" />
          <p className="text-sm font-bold text-stone-600">Фотографии скоро будут загружены владельцем</p>
          <p className="text-xs text-stone-400 max-w-sm">
            Апартаменты добавлены в систему. Вы можете связаться с хозяином или поддержкой для уточнения деталей.
          </p>
        </div>
      )}

      {/* Main Grid: Left Details (2 cols) | Right Sticky Booking Widget (1 col) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Specs */}
          <div className="flex flex-wrap gap-6 rounded-3xl border border-sand-300 bg-white p-5 shadow-soft">
            {[
              { icon: Users, label: `${apartment.max_guests || 2} гостей`, sub: "Вместимость" },
              { icon: BedDouble, label: `${apartment.bedrooms || apartment.rooms_count || 1} комн.`, sub: "Планировка" },
              { icon: Bath, label: `${apartment.bathrooms || 1} санузел`, sub: "Полный санузел" },
              { icon: Maximize2, label: `${apartment.area_sqm || 45} м²`, sub: apartment.floor ? `Этаж ${apartment.floor}` : "Площадь" },
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

          {/* Description (Only if filled by owner) */}
          {apartment.description && (
            <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-stone-900">Об этом жилье</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {apartment.description}
              </p>
            </div>
          )}

          {/* Amenities (Only real items from owner) */}
          {amenities.length > 0 && (
            <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-stone-900">Что есть в этом жилье</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenities.map((item, i) => {
                  const formatted = formatAmenity(item);
                  const Icon = formatted.icon || CheckCircle2;
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-stone-800 font-medium">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200/50">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{formatted.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nearby Landmarks (Only if filled by owner) */}
          {landmarks.length > 0 && (
            <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-stone-900">Рядом с апартаментами</h3>
              <div className="mt-4 space-y-2.5">
                {landmarks.map((lm, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-stone-700 font-semibold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <span>{lm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules (Only if filled by owner) */}
          {houseRules.length > 0 && (
            <div className="rounded-3xl border border-sand-300 bg-white p-6 shadow-soft">
              <button
                type="button"
                onClick={() => setIsRulesOpen(!isRulesOpen)}
                className="flex w-full items-center justify-between font-serif text-lg font-bold text-stone-900 cursor-pointer text-left"
              >
                <span>Правила дома</span>
                {isRulesOpen ? <ChevronUp className="h-5 w-5 text-stone-400" /> : <ChevronDown className="h-5 w-5 text-stone-400" />}
              </button>
              {isRulesOpen && (
                <ul className="mt-4 space-y-2 text-xs text-stone-600 list-disc pl-5">
                  {houseRules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
              <span>{t.apartment.report}</span>
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

      {/* Gallery Modal */}
      {images.length > 0 && (
        <GalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={images}
          apartmentName={apartment.name}
        />
      )}

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
