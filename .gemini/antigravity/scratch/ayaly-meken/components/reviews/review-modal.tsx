"use client";

import React, { useState } from "react";
import { X, Star, Sparkles, Check, Loader2, MessageSquare, ThumbsUp } from "lucide-react";
import { createReview } from "@/actions/reviews";
import { useGuestAuth } from "@/lib/auth-context";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  apartmentName: string;
  bookingId?: string;
  onReviewSubmitted?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Ужасно 😞",
  2: "Плохо 🙁",
  3: "Нормально 😐",
  4: "Очень хорошо 😊",
  5: "Превосходно! 🌟",
};

export function ReviewModal({
  isOpen,
  onClose,
  apartmentId,
  apartmentName,
  bookingId,
  onReviewSubmitted,
}: ReviewModalProps) {
  const { user } = useGuestAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [cleanliness, setCleanliness] = useState(5);
  const [checkin, setCheckin] = useState(5);
  const [location, setLocation] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Пожалуйста, напишите пару слов о вашем впечатлении.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createReview({
        apartmentId,
        bookingId,
        guestName: user?.name || "Гость Ayaly Meken",
        rating,
        comment,
        cleanlinessRating: cleanliness,
        checkinRating: checkin,
        locationRating: location,
      });

      if (res.success) {
        setIsSuccess(true);
        if (onReviewSubmitted) onReviewSubmitted();
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(res.error || "Не удалось сохранить отзыв.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all z-10"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-md">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-emerald-950">Спасибо за ваш отзыв!</h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Ваш отзыв помогает другим гостям делать правильный выбор и мотивирует хозяев поддерживать сервис на высоте.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 border border-amber-300 mb-2">
                <Sparkles size={12} className="text-amber-600" />
                <span>Отзыв гостя</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-emerald-950">
                Как прошло ваше проживание?
              </h2>
              <p className="text-xs text-stone-500 mt-1">{apartmentName}</p>
            </div>

            {/* Overall Rating Star Selector */}
            <div className="rounded-2xl border border-sand-200 bg-sand-50/60 p-4 text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Общая оценка
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-emerald-950 block">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>

            {/* Sub-Category Ratings */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Оценки по категориям:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Cleanliness */}
                <div className="p-3 rounded-xl border border-sand-200 bg-white">
                  <span className="font-semibold text-stone-700 block mb-1.5">🧹 Чистота</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCleanliness(s)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold ${
                          cleanliness >= s ? "bg-emerald-800 text-white" : "bg-sand-100 text-stone-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkin */}
                <div className="p-3 rounded-xl border border-sand-200 bg-white">
                  <span className="font-semibold text-stone-700 block mb-1.5">🔑 Заселение</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCheckin(s)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold ${
                          checkin >= s ? "bg-emerald-800 text-white" : "bg-sand-100 text-stone-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="p-3 rounded-xl border border-sand-200 bg-white">
                  <span className="font-semibold text-stone-700 block mb-1.5">📍 Район</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setLocation(s)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold ${
                          location >= s ? "bg-emerald-800 text-white" : "bg-sand-100 text-stone-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-[11px] font-bold text-stone-700 mb-1 block">
                Ваш комментарий *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Расскажите, что вам больше всего понравилось: вид, комфорт кровати, умный замок, чистота..."
                className="w-full rounded-2xl border border-sand-300 bg-sand-50/50 p-3.5 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all placeholder:font-normal placeholder:text-stone-400"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full h-11 rounded-2xl bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <>
                  <ThumbsUp size={14} className="text-amber-300" />
                  <span>Опубликовать отзыв</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
