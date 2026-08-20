"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { GuestUser } from "@/types/auth.types";

interface AuthContextType {
  user: GuestUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  login: (phone: string, name?: string, email?: string) => void;
  register: (name: string, phone: string, email?: string, city?: string) => void;
  updateProfile: (data: Partial<GuestUser>) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  logout: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "ayaly_meken_guest_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GuestUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default demo guest for frictionless testing if empty
        const defaultGuest: GuestUser = {
          id: "guest-default-1",
          name: "Азамат Касымов",
          phone: "+7 778 555 1234",
          email: "azamat@ayaly.kz",
          city: "Астана",
          promocodes: ["WELCOME"],
          bonus_balance: 5000,
          created_at: new Date().toISOString(),
        };
        setUser(defaultGuest);
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(defaultGuest));
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (phone: string, name?: string, email?: string) => {
    const cleanPhone = phone.trim();
    const guestUser: GuestUser = {
      id: user?.id || `guest-${Date.now()}`,
      name: name || user?.name || "Гость",
      phone: cleanPhone,
      email: email || user?.email,
      city: user?.city || "Астана",
      promocodes: user?.promocodes || ["WELCOME"],
      bonus_balance: user?.bonus_balance || 5000,
      created_at: user?.created_at || new Date().toISOString(),
    };
    setUser(guestUser);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    document.cookie = `ayaly_guest_phone=${encodeURIComponent(cleanPhone)}; path=/; max-age=2592000`;
    setIsAuthModalOpen(false);
  };

  const register = (name: string, phone: string, email?: string, city?: string) => {
    const cleanPhone = phone.trim();
    const guestUser: GuestUser = {
      id: `guest-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      email: email?.trim(),
      city: city?.trim() || "Астана",
      promocodes: ["WELCOME"],
      bonus_balance: 5000,
      created_at: new Date().toISOString(),
    };
    setUser(guestUser);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    document.cookie = `ayaly_guest_phone=${encodeURIComponent(cleanPhone)}; path=/; max-age=2592000`;
    setIsAuthModalOpen(false);
  };

  const updateProfile = (data: Partial<GuestUser>) => {
    if (!user) return;
    const updated: GuestUser = {
      ...user,
      ...data,
    };
    setUser(updated);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
    if (updated.phone) {
      document.cookie = `ayaly_guest_phone=${encodeURIComponent(updated.phone)}; path=/; max-age=2592000`;
    }
  };

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    if (!user) {
      return { success: false, message: "Войдите в аккаунт для активации промокода" };
    }
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: "Пожалуйста, введите промокод" };
    }

    const currentCodes = user.promocodes || [];
    if (currentCodes.includes(clean)) {
      return { success: false, message: `Промокод «${clean}» уже активирован на вашем аккаунте` };
    }

    let bonusAdd = 0;
    let message = `Промокод «${clean}» успешно активирован!`;

    if (clean === "WELCOME") {
      bonusAdd = 5000;
      message = "🎉 Промокод «WELCOME» активирован! Начислен бонус 5 000 ₸";
    } else if (clean === "AYALY2026" || clean === "AYALY") {
      bonusAdd = 3000;
      message = "✨ Промокод «AYALY» активирован! Начислен бонус 3 000 ₸";
    } else if (clean === "VIPGUEST") {
      bonusAdd = 10000;
      message = "💎 VIP-промокод активирован! Начислен бонус 10 000 ₸";
    } else {
      bonusAdd = 2000;
      message = `🎁 Промокод «${clean}» успешно активирован! Начислен бонус 2 000 ₸`;
    }

    const updatedUser: GuestUser = {
      ...user,
      promocodes: [...currentCodes, clean],
      bonus_balance: (user.bonus_balance || 0) + bonusAdd,
    };

    setUser(updatedUser);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedUser));
    return { success: true, message };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    document.cookie = "ayaly_guest_phone=; path=/; max-age=0";
    setIsProfileModalOpen(false);
  };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    document.cookie = "ayaly_guest_phone=; path=/; max-age=0";
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        isProfileModalOpen,
        openAuthModal: () => {
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        openProfileModal: () => {
          setIsAuthModalOpen(false);
          setIsProfileModalOpen(true);
        },
        closeProfileModal: () => setIsProfileModalOpen(false),
        login,
        register,
        updateProfile,
        applyPromoCode,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useGuestAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useGuestAuth must be used within an AuthProvider");
  }
  return context;
}
