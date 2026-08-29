"use client";

import React, { useState } from "react";
import { X, Flag, AlertTriangle, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";

interface ReportApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  apartmentName: string;
}

const REPORT_REASONS = [
  "Недостоверные фото или удобства",
  "Неверный адрес / подозрение на мошенничество",
  "Хозяин требует оплату вне сервиса (в обход платформы)",
  "Нарушение санитарных норм / антисанитария",
  "Завышение цены или навязывание скрытых доплат",
  "Другая причина",
];

export function ReportApartmentModal({
  isOpen,
  onClose,
  apartmentId,
  apartmentName,
}: ReportApartmentModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [comment, setComment] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setComment("");
    setContact("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-sand-300 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-sand-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Flag size={20} />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                Пожаловаться на объявление
              </h3>
              <p className="text-[11px] text-stone-400 truncate max-w-[230px]">
                {apartmentName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-900">Жалоба принята на проверку</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Служба безопасности Ayaly Meken проверит данное объявление и примет меры в течение 15 минут. Спасибо за помощь в поддержании качества!
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full h-11 rounded-2xl bg-emerald-950 text-cream-50 text-xs font-bold shadow-md hover:bg-emerald-900 transition-all"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto py-3.5 space-y-3.5 pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                Причина жалобы:
              </label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedReason === r
                        ? "border-red-500 bg-red-50/60 text-red-950"
                        : "border-sand-200 hover:border-sand-300 text-stone-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                      className="text-red-600 accent-red-600 cursor-pointer"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Подробности (необязательно):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите, что именно не соответствует действительности..."
                rows={3}
                className="w-full p-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs text-stone-900 outline-none focus:bg-white focus:border-red-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Ваш телефон / email для обратной связи:
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+7 7XX XXX XX XX"
                className="w-full h-10 px-3.5 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-stone-900 outline-none focus:bg-white focus:border-red-500 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Отправка жалобы...
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} />
                    Отправить жалобу модераторам
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
