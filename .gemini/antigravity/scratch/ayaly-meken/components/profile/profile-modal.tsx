"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
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
  ExternalLink,
  MessageCircle,
  FileText,
  Clock,
  Heart,
} from "lucide-react";
import { useGuestAuth } from "@/lib/auth-context";

export function ProfileModal() {
  const { user, isProfileModalOpen, closeProfileModal, updateProfile, logout, deleteAccount, openAuthModal } =
    useGuestAuth();

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
      setSaveSuccess(false);
      setIsDeleteConfirmOpen(false);
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-in fade-in">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-sand-300">
          <button
            type="button"
            onClick={closeProfileModal}
            className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-900 text-cream-50 mb-3">
            <User className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="font-serif text-xl font-bold text-emerald-950">Вы не авторизованы</h2>
          <p className="text-xs text-stone-500 mt-1 mb-5">
            Войдите в аккаунт, чтобы просматривать свои поездки и управлять профилем.
          </p>
          <button
            type="button"
            onClick={openAuthModal}
            className="w-full h-11 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-md"
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

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (fullName[0] || "Г").toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 overflow-y-auto max-h-[90vh]">
        {/* Ambient background decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeProfileModal}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Profile Hero Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-sand-200">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-cream-50 font-serif text-2xl font-bold shadow-lg border border-amber-400/30">
            {getInitials(user.name)}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-stone-950 shadow-xs">
              <Sparkles size={11} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-emerald-950 truncate">
                {user.name}
              </h2>
            </div>
            <p className="text-xs font-semibold text-stone-500 flex items-center gap-1 mt-0.5">
              <span>{user.phone}</span>
              {user.city && (
                <>
                  <span>•</span>
                  <span>{user.city}</span>
                </>
              )}
            </p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
              💎 Премиум гость • Аялы Мекен
            </span>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 gap-2.5 py-5 border-b border-sand-200">
          <Link
            href="/bookings"
            onClick={closeProfileModal}
            className="flex items-center gap-3 p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/90 border border-sand-200/80 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 text-cream-50 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Calendar size={16} className="text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-xs text-emerald-950 block">Мои поездки</span>
              <span className="text-[10px] text-stone-400">Брони и ключи</span>
            </div>
          </Link>

          <Link
            href="https://wa.me/77001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/90 border border-sand-200/80 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <MessageCircle size={16} />
            </div>
            <div>
              <span className="font-bold text-xs text-emerald-950 block">Служба заботы</span>
              <span className="text-[10px] text-stone-400">WhatsApp 24/7</span>
            </div>
          </Link>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Личные данные гостя
            </h3>
            {saveSuccess && (
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                <Check size={13} /> Данные сохранены
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-600 mb-1 block">
                Имя и фамилия *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-sand-300 bg-sand-50/50 px-3 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 mb-1 block">
                Телефон WhatsApp *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 rounded-xl border border-sand-300 bg-sand-50/50 px-3 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-600 mb-1 block">
                Email для квитанций
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@mail.kz"
                className="w-full h-10 rounded-xl border border-sand-300 bg-sand-50/50 px-3 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 mb-1 block">
                Основной город
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 rounded-xl border border-sand-300 bg-sand-50/50 px-3 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
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
            className="w-full h-10 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Сохранено!</span>
              </>
            ) : (
              "Сохранить изменения"
            )}
          </button>
        </form>

        {/* Confirmation card for delete account */}
        {isDeleteConfirmOpen ? (
          <div className="pt-4 mt-4 border-t border-red-200 p-4 rounded-2xl bg-red-50/90 border space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
              <span>⚠️</span>
              <span>Вы уверены, что хотите удалить аккаунт?</span>
            </div>
            <p className="text-[11px] text-red-700 leading-snug">
              Все сохраненные данные профиля и активная сессия будут удалены с этого устройства.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Да, удалить аккаунт
              </button>
            </div>
          </div>
        ) : (
          /* Account Actions: Logout & Delete */
          <div className="pt-5 mt-5 border-t border-sand-200 flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-xl border border-sand-300 text-stone-600 hover:bg-sand-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>Выйти</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Удалить аккаунт</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
