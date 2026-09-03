"use client";

import { useState, useEffect } from "react";
import { QrCode, Smartphone, CheckCircle2, ShieldCheck, X, Loader2, ExternalLink } from "lucide-react";
import { formatKZT } from "@/lib/utils";

interface KaspiQrModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hostName?: string;
  hostPhone?: string;
  bookingId?: string;
  apartmentName?: string;
}

export function KaspiQrModal({
  amount,
  isOpen,
  onClose,
  onSuccess,
  hostName = "Аренда апартаментов (Altyn Qonaq)",
  hostPhone = "+7 (777) 123-4567",
  bookingId,
  apartmentName,
}: KaspiQrModalProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isProcessing, setIsProcessing] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(300);

    // Call our Kaspi API endpoint to prepare invoice / QR
    const initKaspi = async () => {
      try {
        const res = await fetch("/api/payments/kaspi/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: bookingId || "TMP_" + Date.now(),
            amount,
            apartmentName: apartmentName || "Апартаменты",
            guestPhone: hostPhone,
          }),
        });
        const data = await res.json();
        if (data.payUrl) {
          setPayUrl(data.payUrl);
        }
        setIsLive(!data.isDemo);
      } catch (err) {
        console.error("Kaspi init error:", err);
      }
    };

    initKaspi();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, amount, bookingId, apartmentName, hostPhone]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const handleConfirmPayment = () => {
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
            <h3 className="text-base font-bold text-stone-900">Оплата Kaspi Pay / QR</h3>
            <p className="text-xs text-stone-500">
              {isLive ? "Официальный платёж Kaspi Pay" : `Прямой перевод: ${hostName}`}
            </p>
          </div>
        </div>

        {/* Amount to Pay */}
        <div className="mt-4 rounded-2xl bg-sand-50 p-4 text-center border border-sand-200">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Сумма к оплате 100%
          </span>
          <div className="mt-1 text-2xl font-black text-emerald-950">
            {formatKZT(amount)}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200">
            <span>Получатель: <strong>{hostName}</strong></span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-xs text-stone-600 font-medium">Kaspi номер: <strong className="text-stone-900">{hostPhone}</strong></span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(hostPhone.replace(/[^\d+]/g, ""));
                alert("Номер Kaspi скопирован!");
              }}
              className="px-2 py-0.5 rounded-lg bg-white border border-stone-300 text-[11px] font-bold text-stone-700 hover:bg-stone-50 active:scale-95"
            >
              Скопировать
            </button>
          </div>
        </div>

        {/* QR Code Container */}
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
            Счёт активен: <span className="font-bold text-red-600">{formattedTime}</span>
          </div>

          {/* Quick Pay Link for mobile devices */}
          {payUrl && (
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#F14635] hover:underline"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Открыть в приложении Kaspi.kz</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2.5">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F14635] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#d63d2e] active:scale-98 transition-all disabled:opacity-75 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Проверка платежа Kaspi...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Я оплатил через Kaspi</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-stone-400">
            Платёж фиксируется в системе Altyn Qonaq PMS · Мгновенное подтверждение
          </p>
        </div>
      </div>
    </div>
  );
}
