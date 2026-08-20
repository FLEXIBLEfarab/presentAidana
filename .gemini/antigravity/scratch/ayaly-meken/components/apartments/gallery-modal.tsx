"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react";

interface GalleryModalProps {
  images: string[];
  apartmentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({
  images,
  apartmentName,
  isOpen,
  onClose,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-white">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{apartmentName}</span>
          <span className="text-xs text-white/50">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="relative h-full max-h-[80vh] w-full max-w-5xl">
          <Image
            src={images[currentIndex]}
            alt={`${apartmentName} photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur-md hover:bg-white/30 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur-md hover:bg-white/30 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto p-4 border-t border-white/10 no-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
              i === currentIndex ? "ring-2 ring-amber-400 scale-105" : "opacity-50 hover:opacity-100"
            }`}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
