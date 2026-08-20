"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Heart, MapPin, ChevronLeft, ChevronRight, Sparkles, Users, BedDouble, ArrowUpRight } from "lucide-react";
import { Apartment } from "@/types/database.types";
import { formatKZT, cn } from "@/lib/utils";

interface ApartmentCardProps {
  apartment: Apartment;
  isHighlighted?: boolean;
}

export function ApartmentCard({ apartment, isHighlighted }: ApartmentCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const images =
    apartment.images && apartment.images.length > 0
      ? apartment.images
      : [
          apartment.cover_image ||
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
        ];

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
        "group relative flex flex-col rounded-3xl bg-white p-3 border shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1",
        isHighlighted
          ? "border-emerald-800 ring-2 ring-emerald-800/20 shadow-float"
          : "border-sand-200/90 hover:border-emerald-700/40"
      )}
    >
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand-100">
        <Link href={`/apartments/${apartment.id}`} className="block h-full w-full">
          <Image
            src={images[currentImageIndex]}
            alt={apartment.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          onClick={handleLike}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950/40 backdrop-blur-md text-white transition-all hover:bg-emerald-950/70 hover:scale-110 active:scale-95 border border-white/20"
        >
          <Heart className={cn("h-4 w-4", isLiked ? "fill-rose-500 text-rose-500" : "text-white")} />
        </button>

        {/* Brand Badge */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-emerald-950/85 px-2.5 py-1 text-[10px] font-bold text-cream-50 shadow-md backdrop-blur-md border border-amber-400/30">
          <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />
          <span>Ayaly Selection</span>
        </div>

        {/* Gallery Carousel Arrows */}
        {images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md hover:bg-white active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md hover:bg-white active:scale-95 transition-transform"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Gallery Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentImageIndex ? "w-4 bg-white shadow-xs" : "w-1.5 bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/apartments/${apartment.id}`} className="mt-3.5 flex flex-1 flex-col justify-between px-1">
        <div>
          {/* Location & Rating Header */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-900 font-bold">
              <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{apartment.city}{apartment.district ? ` · ${apartment.district}` : ""}</span>
            </span>
            <div className="flex items-center gap-1 text-stone-900 font-bold shrink-0">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{apartment.rating || "4.95"}</span>
              <span className="text-stone-400 font-normal">({apartment.reviews_count || 32})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 font-serif text-base font-bold text-emerald-950 line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {apartment.name}
          </h3>

          {/* Details */}
          <div className="mt-2 flex items-center gap-2.5 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-stone-400" />
              до {apartment.max_guests || 2} гостей
            </span>
            <span className="text-sand-300">•</span>
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-stone-400" />
              {apartment.rooms_count || apartment.bedrooms || 1} комн. · {apartment.area_sqm || 45} м²
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 flex items-center justify-between border-t border-sand-200/80 pt-3">
          <div>
            <span className="text-base font-extrabold text-emerald-950 font-serif">
              {formatKZT(apartment.base_night_price)}
            </span>
            <span className="text-xs text-stone-500 font-normal"> / ночь</span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
            <span>Смотреть</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </div>
  );
}
