"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";
import { useGuestAuth } from "@/lib/auth-context";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithEmail,
    registerGuest,
    requestPasswordReset,
    resetPassword,
  } = useGuestAuth();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [city, setCity] = useState("Астана");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password flow
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "reset" | "success">("request");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryHint, setRecoveryHint] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithEmail(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || "Неверный логин или пароль");
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = registerGuest({
        name,
        email,
        password,
        phone,
        city,
      });
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || "Ошибка регистрации");
      }
    }, 400);
  };

  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = requestPasswordReset(forgotEmail);
      if (res.success) {
        setRecoveryHint(res.hint || null);
        setForgotStep("reset");
      } else {
        setErrorMessage(res.error || "Ошибка запроса кода");
      }
    }, 400);
  };

  const handleForgotReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = resetPassword(forgotEmail, recoveryCode, newPassword);
      if (res.success) {
        setForgotStep("success");
        setPassword(newPassword);
        setEmail(forgotEmail);
      } else {
        setErrorMessage(res.error || "Неверный код подтверждения");
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setIsForgotMode(false);
            setErrorMessage(null);
            closeAuthModal();
          }}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center pb-5 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-white font-sans font-black text-lg tracking-tight shadow-md mx-auto border border-emerald-600/30">
            AM
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-950">
            {isForgotMode
              ? "Восстановление пароля"
              : tab === "login"
              ? "Вход в Ayaly Meken"
              : "Регистрация гостя"}
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {isForgotMode
              ? "Сбросьте пароль для доступа к вашим бронированиям"
              : "Единый гостевой портал: ключи TTLock, бронирования и консьерж-сервис"}
          </p>
        </div>

        {/* FORGOT PASSWORD MODE */}
        {isForgotMode ? (
          <div className="space-y-4">
            {forgotStep === "request" && (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1.5 block">
                    Электронная почта
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="alex@example.kz"
                      required
                      className="w-full h-11 pl-9 pr-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setErrorMessage(null);
                    }}
                    className="flex-1 h-11 rounded-2xl border border-sand-300 text-stone-700 text-xs font-bold hover:bg-sand-50 transition-all"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isLoading ? <Loader2 size={15} className="animate-spin text-amber-300" /> : "Получить код"}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === "reset" && (
              <form onSubmit={handleForgotReset} className="space-y-4">
                {recoveryHint && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 font-medium">
                    {recoveryHint}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1.5 block">
                    Код подтверждения
                  </label>
                  <input
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="Введите код"
                    required
                    className="w-full h-11 px-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-bold text-center tracking-widest text-emerald-950 outline-none focus:bg-white focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1.5 block">
                    Новый пароль (от 6 символов)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 pl-3 pr-10 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep("request")}
                    className="flex-1 h-11 rounded-2xl border border-sand-300 text-stone-700 text-xs font-bold hover:bg-sand-50 transition-all"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isLoading ? <Loader2 size={15} className="animate-spin text-amber-300" /> : "Сменить пароль"}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === "success" && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-sm font-bold text-emerald-950">Пароль успешно обновлен!</h3>
                <p className="text-xs text-stone-500">
                  Теперь вы можете войти в аккаунт с новым паролем.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setTab("login");
                  }}
                  className="w-full h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-cream-50 text-xs font-bold shadow-md transition-all"
                >
                  Вернуться ко входу
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD LOGIN & REGISTER TABS */
          <div className="space-y-4">
            {/* Tab buttons */}
            <div className="flex rounded-2xl bg-sand-100 p-1 border border-sand-200">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  tab === "login"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMessage(null);
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

            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1.5 block">
                    Электронная почта
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.kz"
                      required
                      className="w-full h-11 pl-9 pr-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-700">Пароль</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotStep("request");
                        setIsForgotMode(true);
                      }}
                      className="text-[11px] font-semibold text-emerald-800 hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 pl-9 pr-10 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-amber-300" />
                      Вход в систему...
                    </>
                  ) : (
                    <>
                      Войти в кабинет
                      <ArrowRight size={15} className="text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1 block">
                    Имя и фамилия *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Арман Касымов"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1 block">
                    Электронная почта *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arman@gmail.com"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1 block">
                    Телефон WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 778 000 0000"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 mb-1 block">
                    Пароль (от 6 символов) *
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-10 pl-9 pr-10 rounded-2xl border border-sand-300 bg-sand-50/50 text-xs font-semibold text-emerald-950 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-amber-300" />
                      Создание аккаунта...
                    </>
                  ) : (
                    <>
                      Зарегистрироваться
                      <ArrowRight size={15} className="text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
