"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  KeyRound,
  Sparkles,
  LogOut,
  Check,
  Loader2,
  ShieldCheck,
  ChevronLeft,
  MessageCircle,
  Clock,
  Heart,
} from "lucide-react";
import { useGuestAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, updateProfile, logout, deleteAccount, openAuthModal } = useGuestAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Астана");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setCity(user.city || "Астана");
      setIsDeleteConfirmOpen(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <div className="rounded-3xl bg-white p-8 border border-sand-300 shadow-soft space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950 text-cream-50 shadow-md">
            <User className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-emerald-950">Личный кабинет гостя</h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Войдите или зарегистрируйтесь, чтобы просматривать свои поездки, получать цифровые ключи и скидки.
          </p>
          <button
            type="button"
            onClick={openAuthModal}
            className="w-full h-11 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-md cursor-pointer"
          >
            Войти / Регистрация
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (fullName[0] || "Г").toUpperCase();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-950 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>На главную</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-sand-300 shadow-soft space-y-6">
        {/* Profile Hero Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-sand-200">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-cream-50 font-serif text-3xl font-bold shadow-lg border border-amber-400/30">
            {getInitials(user.name)}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-stone-950 shadow-xs">
              <Sparkles size={13} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-2xl font-bold text-emerald-950 truncate">
              {user.name}
            </h1>
            <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mt-0.5">
              <span>{user.phone}</span>
              {user.city && (
                <>
                  <span>•</span>
                  <span>{user.city}</span>
                </>
              )}
            </p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
              💎 Премиум гость • Аялы Мекен
            </span>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/bookings"
            className="flex items-center gap-3 p-4 rounded-2xl bg-sand-50 hover:bg-sand-100/90 border border-sand-200/80 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900 text-cream-50 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Calendar size={18} className="text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-sm text-emerald-950 block">Мои поездки</span>
              <span className="text-xs text-stone-400">Бронирования и ключи</span>
            </div>
          </Link>

          <Link
            href="https://wa.me/77001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-sand-50 hover:bg-sand-100/90 border border-sand-200/80 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <MessageCircle size={18} />
            </div>
            <div>
              <span className="font-bold text-sm text-emerald-950 block">Служба заботы</span>
              <span className="text-xs text-stone-400">WhatsApp поддержка 24/7</span>
            </div>
          </Link>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-sand-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Личные данные гостя
            </h2>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                <Check size={14} /> Данные успешно обновлены
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-600 mb-1 block">
                Имя и фамилия *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 mb-1 block">
                Телефон WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-600 mb-1 block">
                Email для квитанций и чеков
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@mail.kz"
                className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 mb-1 block">
                Город проживания
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 rounded-2xl border border-sand-300 bg-sand-50/50 px-4 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              >
                <option value="Астана">Астана</option>
                <option value="Алматы">Алматы</option>
                <option value="Шымкент">Шымкент</option>
                <option value="Караганда">Караганда</option>
                <option value="Актау">Актау</option>
                <option value="Атырау">Атырау</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full h-11 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Изменения сохранены!</span>
              </>
            ) : (
              "Сохранить изменения"
            )}
          </button>
        </form>

        {/* Confirmation card for delete account */}
        {isDeleteConfirmOpen ? (
          <div className="pt-4 border-t border-red-200 p-4 rounded-2xl bg-red-50/90 border space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
              <span>⚠️</span>
              <span>Вы уверены, что хотите удалить аккаунт?</span>
            </div>
            <p className="text-xs text-red-700 leading-snug">
              Все сохраненные данные вашего профиля и активная сессия будут безвозвратно удалены.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Да, удалить аккаунт
              </button>
            </div>
          </div>
        ) : (
          /* Account Actions: Logout & Delete */
          <div className="pt-6 border-t border-sand-200 flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-sand-300 text-stone-600 hover:bg-sand-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Выйти</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Удалить аккаунт</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
