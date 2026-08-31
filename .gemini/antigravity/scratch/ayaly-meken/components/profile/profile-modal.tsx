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
  Ticket,
  Gift,
  Coins,
  ArrowRight,
  Tag,
} from "lucide-react";
import { useGuestAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { formatKZT } from "@/lib/utils";
import { SupportChatModal } from "@/components/support/support-chat-modal";

export function ProfileModal() {
  const { t } = useI18n();
  const {
    user,
    isProfileModalOpen,
    closeProfileModal,
    updateProfile,
    applyPromoCode,
    logout,
    deleteAccount,
    openAuthModal,
  } = useGuestAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Астана");
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setCity(user.city || "Астана");
      setSaveSuccess(false);
      setIsDeleteConfirmOpen(false);
      setPromoMessage(null);
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
            className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-900 text-cream-50 mb-3">
            <User className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="font-serif text-xl font-bold text-emerald-950">{t.profile.not_auth_title}</h2>
          <p className="text-xs text-stone-500 mt-1 mb-5">
            {t.profile.not_auth_sub}
          </p>
          <button
            type="button"
            onClick={openAuthModal}
            className="w-full h-11 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-cream-50 text-xs font-bold shadow-md cursor-pointer"
          >
            {t.profile.login_reg_btn}
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

  const handleApplyPromo = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const codeToUse = customCode || promoInput;
    if (!codeToUse.trim()) {
      setPromoMessage({ type: "error", text: t.profile.promo_required });
      return;
    }

    setIsApplyingPromo(true);
    setPromoMessage(null);

    setTimeout(() => {
      const res = applyPromoCode(codeToUse);
      setIsApplyingPromo(false);
      if (res.success) {
        setPromoMessage({ type: "success", text: res.message });
        setPromoInput("");
      } else {
        setPromoMessage({ type: "error", text: res.message });
      }
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
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-sand-100 transition-all z-10 cursor-pointer"
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
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                {t.profile.premium_badge}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                <Coins size={11} className="text-amber-600" />
                {formatKZT(user.bonus_balance || 5000)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 gap-2.5 py-4 border-b border-sand-200">
          <Link
            href="/bookings"
            onClick={closeProfileModal}
            className="flex items-center gap-3 p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/90 border border-sand-200/80 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 text-cream-50 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Calendar size={16} className="text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-xs text-emerald-950 block">{t.profile.trips_card}</span>
              <span className="text-[10px] text-stone-400">{t.profile.trips_card_sub}</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/90 border border-sand-200/80 transition-all group cursor-pointer text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <MessageCircle size={16} />
            </div>
            <div>
              <span className="font-bold text-xs text-emerald-950 block">{t.profile.support_card}</span>
              <span className="text-[10px] text-stone-400">{t.profile.support_card_sub}</span>
            </div>
          </button>
        </div>

        {/* PROMOCODE SECTION */}
        <div className="py-4 border-b border-sand-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket size={13} className="text-amber-500" />
              {t.profile.promocodes_title}
            </h3>
            <span className="text-[11px] font-bold text-emerald-800">
              {t.profile.balance_label} {formatKZT(user.bonus_balance || 5000)}
            </span>
          </div>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder={t.profile.promo_placeholder}
                className="w-full h-10 rounded-xl border border-sand-300 bg-sand-50/50 pl-8 pr-3 text-xs font-bold uppercase tracking-wider text-emerald-950 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isApplyingPromo || !promoInput.trim()}
              className="h-10 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-cream-50 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isApplyingPromo ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
              ) : (
                <>
                  <span>{t.profile.apply_btn}</span>
                  <ArrowRight size={13} className="text-amber-300" />
                </>
              )}
            </button>
          </form>

          {/* Promo feedback message */}
          {promoMessage && (
            <div
              className={`mt-2.5 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in ${
                promoMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {promoMessage.type === "success" ? (
                <Check size={14} className="text-emerald-600 shrink-0" />
              ) : (
                <span>⚠️</span>
              )}
              <span>{promoMessage.text}</span>
            </div>
          )}
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              {t.profile.personal_data}
            </h3>
            {saveSuccess && (
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                <Check size={13} /> {t.profile.data_saved}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-600 mb-1 block">
                {t.profile.full_name}
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
                {t.profile.whatsapp_phone}
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
                {t.profile.receipt_email}
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
                {t.profile.main_city}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 rounded-xl border border-sand-300 bg-sand-50/50 px-3 text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-none transition-all"
              >
                <option value="Астана">{t.search.astana}</option>
                <option value="Алматы">{t.search.almaty}</option>
                <option value="Шымкент">{t.search.shymkent}</option>
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
                <span>{t.profile.saved_success}</span>
              </>
            ) : (
              t.profile.save_changes
            )}
          </button>
        </form>

        {/* Confirmation card for delete account */}
        {isDeleteConfirmOpen ? (
          <div className="pt-4 mt-4 border-t border-red-200 p-4 rounded-2xl bg-red-50/90 border space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
              <span>⚠️</span>
              <span>{t.profile.delete_confirm_title}</span>
            </div>
            <p className="text-[11px] text-red-700 leading-snug">
              {t.profile.delete_confirm_sub}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
              >
                {t.profile.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                {t.profile.delete_btn}
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
              <span>{t.profile.logout}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{t.profile.delete_account}</span>
            </button>
          </div>
        )}
      </div>

      {/* Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
