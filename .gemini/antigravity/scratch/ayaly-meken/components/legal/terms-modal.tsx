"use client";

import React from "react";
import { X, ShieldCheck, FileText, CheckCircle2, Lock, Scale, AlertTriangle } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-sand-300 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sand-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-emerald-950">
                Условия использования и правила
              </h3>
              <p className="text-[11px] text-stone-500">
                Публичная оферта сервиса «Ayaly Meken» & «Алтын Қонақ» (РК)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-5 text-xs text-stone-700 leading-relaxed pr-2">
          {/* Section 1 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <ShieldCheck size={16} className="text-emerald-700" />
              1. Общие положения и предмет оферты
            </h4>
            <p>
              Настоящий документ является публичной офертой в соответствии со статьей 395 Гражданского кодекса Республики Казахстан. Сервис <strong>«Ayaly Meken»</strong> предоставляет онлайн-платформу для поиска, безопасного бронирования и бесконтактного заселения в проверенные апартаменты.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <Lock size={16} className="text-emerald-700" />
              2. Возрастное ограничение (16+) и верификация
            </h4>
            <p>
              Регистрация и самостоятельное бронирование доступны гражданам, достигшим <strong>16 лет</strong>. При бронировании гость подтверждает достоверность предоставленных персональных данных (ФИО, номер телефона, возраст). В случае выявления недостоверных сведений сервис оставляет за собой право аннулировать бронь.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <CheckCircle2 size={16} className="text-emerald-700" />
              3. Бесконтактный заезд по TTLock и правила проживания
            </h4>
            <p>
              После успешной оплаты гостю генерируется индивидуальный цифровой ПИН-код от электронного замка TTLock, действующий строго на период бронирования (стандартный заезд — с 14:00, выезд — до 12:00).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li><strong>Категорически запрещено курение</strong> (включая вейпы, кальян и электронные сигареты) внутри квартир и на балконах. Штраф — в размере страхового депозита.</li>
              <li><strong>Запрещено проведение вечеринок</strong>, шумных мероприятий и нарушение закона о тишине с 22:00 до 09:00 (ст. 437 КоАП РК).</li>
              <li>Проживание с домашними животными разрешено только при предварительном согласовании с арендодателем.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <Scale size={16} className="text-emerald-700" />
              4. Оплата, гарантия брони и страховой депозит
            </h4>
            <p>
              Оплата проживания и страхового депозита осуществляется безналичным способом через Kaspi QR или банковские карты. Страховой депозит возвращается гостю в полном объеме в течение <strong>2 часов после выезда</strong> и проверки апартаментов клининговой службой при отсутствии повреждений имущества.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <AlertTriangle size={16} className="text-emerald-700" />
              5. Защита персональных данных
            </h4>
            <p>
              Обработка персональных данных осуществляется в строгом соответствии с Законом РК «О персональных данных и их защите» от 21 мая 2013 года № 94-V. Данные используются исключительно для оформления проживания, генерации ключей доступа и обеспечения безопасности.
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-sand-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-cream-50 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Понятно, я принимаю условия
          </button>
        </div>
      </div>
    </div>
  );
}
