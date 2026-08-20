"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Phone,
  User,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
  Building2,
  MessageCircle,
} from "lucide-react";
import { useGuestAuth } from "@/lib/auth-context";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useGuestAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 (778) 555-1234");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Астана");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 11) {
      setError("Пожалуйста, введите корректный номер телефона");
      return;
    }

    if (tab === "register" && !name.trim()) {
      setError("Пожалуйста, введите ваше имя и фамилию");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("otp");
      setOtpCode("1234"); // Auto-fill 1234 demo code for frictionless UX
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode.trim() || otpCode.length < 4) {
      setError("Введите 4-значный код из SMS / WhatsApp");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (tab === "register") {
        register(name, phone, email, city);
      } else {
        login(phone, name, email);
      }
      setStep("form");
    }, 500);
  };

  const handleQuickLogin = (demoName: string, demoPhone: string, demoEmail: string) => {
    setName(demoName);
    setPhone(demoPhone);
    setEmail(demoEmail);
    login(demoPhone, demoName, demoEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 overflow-hidden">
        {/* Ambient background styling */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            setStep("form");
            closeAuthModal();
          }}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center pb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950 text-cream-50 shadow-lg shadow-emerald-950/30 mb-3 border border-amber-400/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-950">
            {step === "otp"
              ? "Подтверждение входа"
              : tab === "register"
              ? "Регистрация гостя"
              : "Вход в аккаунт"}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            {step === "otp"
              ? `Мы отправили код подтверждения на ${phone}`
              : "Управляйте бронированиями, открывайте умные замки и заказывайте консьерж-сервис"}
          </p>
        </div>

        {/* STEP 1: FORM */}
        {step === "form" && (
          <>
            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-sand-100/90 p-1 mb-5 border border-sand-200">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  tab === "login"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Вход по номеру
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  tab === "register"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Регистрация
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 animate-in fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-3.5">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-emerald-700" />
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Азамат Касымов"
                    className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-700" />
                  Номер телефона (WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 flex items-center gap-1">
                    🇰🇿
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (778) 555-1234"
                    className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 pl-10 pr-4 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all"
                  />
                </div>
              </div>

              {tab === "register" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-emerald-700" />
                      Email для квитанций и договоров (необязательно)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="guest@mail.kz"
                      className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                      <Building2 size={13} className="text-emerald-700" />
                      Город проживания
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all"
                    >
                      <option value="Астана">Астана</option>
                      <option value="Алматы">Алматы</option>
                      <option value="Шымкент">Шымкент</option>
                      <option value="Караганда">Караганда</option>
                      <option value="Актау">Актау</option>
                      <option value="Атырау">Атырау</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <>
                    <span>{tab === "register" ? "Зарегистрироваться" : "Получить код входа"}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Profiles */}
            <div className="mt-5 pt-4 border-t border-sand-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-center mb-2">
                Быстрый демо-вход:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("Фараби", "+7 701 123 4567", "farabi@ayaly.kz")}
                  className="p-2 rounded-xl bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left transition-all"
                >
                  <div className="font-bold text-xs text-emerald-950">Фараби</div>
                  <div className="text-[10px] text-stone-400">+7 701 123 4567</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("Азамат Касымов", "+7 778 555 1234", "azamat@ayaly.kz")}
                  className="p-2 rounded-xl bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left transition-all"
                >
                  <div className="font-bold text-xs text-emerald-950">Азамат Касымов</div>
                  <div className="text-[10px] text-stone-400">+7 778 555 1234</div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Код из SMS / WhatsApp</span>
                <span className="text-[10px] text-emerald-700 font-normal">Демо-код: 1234</span>
              </label>
              <input
                type="text"
                maxLength={4}
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full h-12 text-center tracking-[0.6em] text-lg font-black rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-emerald-950 focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Подтвердить и войти</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full py-2 text-xs font-bold text-stone-500 hover:text-emerald-950 transition-colors"
            >
              ← Изменить номер телефона
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] font-medium text-stone-400">
          <ShieldCheck size={13} className="text-emerald-700" />
          <span>Безопасная авторизация • Данные защищены шифрованием</span>
        </div>
      </div>
    </div>
  );
}
