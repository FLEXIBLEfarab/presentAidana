"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Heart, MapPin, ChevronLeft, ChevronRight, Sparkles, Users, BedDouble } from "lucide-react";
import { Apartment } from "@/types/database.types";
import { formatKZT, cn } from "@/lib/utils";

interface ApartmentCardProps {
  apartment: Apartment;
  isHighlighted?: boolean;
}

export function ApartmentCard({ apartment, isHighlighted }: ApartmentCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const images = apartment.images && apartment.images.length > 0
    ? apartment.images
    : [apartment.cover_image || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      id={`card-${apartment.id}`}
      className={cn(
        "group relative flex flex-col rounded-3xl bg-white p-3 border shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-0.5",
        isHighlighted ? "border-emerald-800 ring-2 ring-emerald-800/20 shadow-float" : "border-sand-300/80"
      )}
    >
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand-200">
        <Link href={`/apartments/${apartment.id}`} className="block h-full w-full">
          <Image
            src={images[currentImageIndex]}
            alt={apartment.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          onClick={handleLike}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white transition-all hover:bg-black/50 active:scale-90"
        >
          <Heart className={cn("h-4 w-4", isLiked ? "fill-rose-500 text-rose-500" : "")} />
        </button>

        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-cream-50/95 px-2.5 py-1 text-[11px] font-bold text-emerald-950 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
          <span>Ayaly Meken</span>
        </div>

        {images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md hover:bg-white active:scale-95">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md hover:bg-white active:scale-95">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all", i === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/60")} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/apartments/${apartment.id}`} className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-900 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-emerald-700" />
              {apartment.city}{apartment.district ? ` · ${apartment.district}` : ""}
            </span>
            <div className="flex items-center gap-1 text-stone-900 font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{apartment.rating || "4.95"}</span>
              <span className="text-stone-400 font-normal">({apartment.reviews_count || 32})</span>
            </div>
          </div>

          <h3 className="mt-1.5 font-serif text-base font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-900 transition-colors">
            {apartment.name}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-stone-400" />
              до {apartment.max_guests || 2} гостей
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-stone-400" />
              {apartment.bedrooms || 1} сп. · {apartment.area_sqm || 45} м²
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-sand-200/80 pt-2.5">
          <div>
            <span className="text-lg font-extrabold text-emerald-950">{formatKZT(apartment.base_night_price)}</span>
            <span className="text-xs text-stone-500 font-normal"> / ночь</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 hover:underline">Подробнее →</span>
        </div>
      </Link>
    </div>
  );
}
