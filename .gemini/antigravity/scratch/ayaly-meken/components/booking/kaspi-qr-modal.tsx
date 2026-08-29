"use client";

import { useState, useEffect } from "react";
import { QrCode, Smartphone, CheckCircle2, ShieldCheck, X, Loader2 } from "lucide-react";
import { formatKZT } from "@/lib/utils";

interface KaspiQrModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hostName?: string;
  hostPhone?: string;
}

export function KaspiQrModal({
  amount,
  isOpen,
  onClose,
  onSuccess,
  hostName = "Аренда апартаментов (Altyn Qonaq Host)",
  hostPhone = "+7 (777) 123-4567",
}: KaspiQrModalProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-sand-100 hover:text-stone-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Kaspi Red Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F14635] text-white font-black text-xl shadow-md">
            K
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Оплата Kaspi QR / Перевод</h3>
            <p className="text-xs text-stone-500">Прямой перевод владельцу: <strong>{hostName}</strong></p>
          </div>
        </div>

        {/* Amount to Pay */}
        <div className="mt-4 rounded-2xl bg-sand-50 p-4 text-center border border-sand-200">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Сумма к оплате
          </span>
          <div className="mt-1 text-2xl font-black text-emerald-950">
            {formatKZT(amount)}
          </div>
          <div className="mt-1 text-[11px] font-medium text-emerald-700">
            Прямой перевод на Kaspi: <strong>{hostPhone}</strong>
          </div>
        </div>

        {/* Simulated QR Code Box */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="relative flex h-52 w-52 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 p-4">
            <div className="flex h-40 w-40 flex-col items-center justify-center rounded-xl bg-white p-2 shadow-inner">
              <QrCode className="h-32 w-32 text-stone-900" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                <span>Kaspi QR</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold text-stone-500">
            QR-код действителен: <span className="font-bold text-red-600">{formattedTime}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2.5">
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F14635] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#d63d2e] active:scale-98 transition-all disabled:opacity-75"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Подтверждение оплаты...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Я оплатил через Kaspi QR (Симуляция)</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-stone-400">
            Защищённая транзакция через систему Altyn Qonaq PMS
          </p>
        </div>
      </div>
    </div>
  );
}
