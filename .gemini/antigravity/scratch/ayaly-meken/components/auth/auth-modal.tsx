"use client";

import React, { useState } from "react";
import { X, Sparkles, Phone, User, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useGuestAuth } from "@/lib/auth-context";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useGuestAuth();
  const [tab, setTab] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 11) {
      setError("Введите корректный номер телефона (11 цифр)");
      return;
    }

    if (tab === "register" && !name.trim()) {
      setError("Пожалуйста, введите ваше имя");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (tab === "register") {
        register(name, phone, email);
      } else {
        login(phone, name, email);
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center pb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-900 text-cream-50 shadow-md mb-3">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-950">
            {tab === "register" ? "Регистрация гостя" : "Вход в аккаунт"}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Сохраняйте свои поездки, получайте ПИН-коды от замков и заказывайте консьерж-сервис
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-sand-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "register" ? "bg-white text-emerald-950 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Регистрация
          </button>
          <button
            type="button"
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "login" ? "bg-white text-emerald-950 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Быстрый вход
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "register" && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Ваше имя *
              </label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Например: Азамат Касымов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 focus:bg-white"
                  required={tab === "register"}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
              Номер телефона (WhatsApp) *
            </label>
            <div className="relative flex items-center">
              <Phone size={15} className="absolute left-3.5 text-stone-400" />
              <input
                type="tel"
                placeholder="+7 (701) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 focus:bg-white"
                required
              />
            </div>
          </div>

          {tab === "register" && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Email (для электронных чеков)
              </label>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3.5 text-stone-400" />
                <input
                  type="email"
                  placeholder="guest@mail.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-cream-50 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <Loader2 size={15} className="animate-spin text-amber-300" />
              ) : (
                <>
                  <span>{tab === "register" ? "Зарегистрироваться и сохранить" : "Войти по номеру"}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-emerald-700" />
            Ваши данные конфиденциальны и синхронизированы с Altyn Qonaq
          </p>
        </div>
      </div>
    </div>
  );
}
