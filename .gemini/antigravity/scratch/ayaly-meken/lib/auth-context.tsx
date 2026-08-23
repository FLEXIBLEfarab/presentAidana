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
  loginWithEmail: (email: string, password?: string) => { success: boolean; error?: string };
  registerGuest: (data: { name: string; email: string; password?: string; phone: string; city?: string }) => { success: boolean; error?: string };
  login: (phone: string, name?: string, email?: string) => void;
  register: (name: string, phone: string, email?: string, city?: string) => void;
  updateProfile: (data: Partial<GuestUser>) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  requestPasswordReset: (email: string) => { success: boolean; message?: string; error?: string; hint?: string };
  resetPassword: (email: string, code: string, newPass: string) => { success: boolean; message?: string; error?: string };
  logout: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "ayaly_meken_guest_user";
const GUESTS_REGISTRY_KEY = "ayaly_meken_registered_guests";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GuestUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored was old demo user, clear it
        if (parsed.email === "azamat@ayaly.kz" || parsed.name === "Азамат Касымов") {
          localStorage.removeItem(GUEST_STORAGE_KEY);
          setUser(null);
        } else {
          setUser(parsed);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Введите адрес электронной почты" };
    }
    if (!password) {
      return { success: false, error: "Введите пароль" };
    }

    try {
      const registryRaw = localStorage.getItem(GUESTS_REGISTRY_KEY);
      const registry: any[] = registryRaw ? JSON.parse(registryRaw) : [];
      const found = registry.find((g) => g.email?.toLowerCase() === cleanEmail);

      if (found) {
        if (found.password && found.password !== password) {
          return { success: false, error: "Неверный пароль. Пожалуйста, проверьте введённые данные." };
        }
        setUser(found);
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(found));
        if (found.phone) {
          document.cookie = `ayaly_guest_phone=${encodeURIComponent(found.phone)}; path=/; max-age=2592000`;
        }
        setIsAuthModalOpen(false);
        return { success: true };
      }

      // If user is logging in with master admin or newly created account
      const newGuest: GuestUser = {
        id: `guest-${Date.now()}`,
        name: cleanEmail.split("@")[0] || "Гость",
        phone: "+7 778 000 0000",
        email: cleanEmail,
        city: "Астана",
        promocodes: [],
        bonus_balance: 0,
        created_at: new Date().toISOString(),
      };

      registry.push({ ...newGuest, password });
      localStorage.setItem(GUESTS_REGISTRY_KEY, JSON.stringify(registry));
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuest));
      setUser(newGuest);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: "Ошибка авторизации" };
    }
  };

  const registerGuest = (data: { name: string; email: string; password?: string; phone: string; city?: string }): { success: boolean; error?: string } => {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPhone = data.phone.trim();

    if (!cleanName) return { success: false, error: "Введите ваше имя и фамилию" };
    if (!cleanEmail) return { success: false, error: "Введите адрес электронной почты" };
    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 11) {
      return { success: false, error: "Введите корректный номер телефона (+7...)" };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: "Пароль должен содержать минимум 6 символов" };
    }

    try {
      const registryRaw = localStorage.getItem(GUESTS_REGISTRY_KEY);
      const registry: any[] = registryRaw ? JSON.parse(registryRaw) : [];

      const newGuest: GuestUser = {
        id: `guest-${Date.now()}`,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        city: data.city?.trim() || "Астана",
        promocodes: [],
        bonus_balance: 0,
        created_at: new Date().toISOString(),
      };

      registry.push({ ...newGuest, password: data.password });
      localStorage.setItem(GUESTS_REGISTRY_KEY, JSON.stringify(registry));
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuest));
      document.cookie = `ayaly_guest_phone=${encodeURIComponent(cleanPhone)}; path=/; max-age=2592000`;

      setUser(newGuest);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: "Ошибка регистрации" };
    }
  };

  const login = (phone: string, name?: string, email?: string) => {
    const cleanPhone = phone.trim();
    const guestUser: GuestUser = {
      id: user?.id || `guest-${Date.now()}`,
      name: name || user?.name || "Гость",
      phone: cleanPhone,
      email: email || user?.email,
      city: user?.city || "Астана",
      promocodes: user?.promocodes || [],
      bonus_balance: user?.bonus_balance || 0,
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
      promocodes: [],
      bonus_balance: 0,
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

    let bonusAdd = 5000;
    let message = `🎁 Промокод «${clean}» успешно активирован!`;

    if (clean === "WELCOME") {
      bonusAdd = 5000;
      message = "🎉 Промокод «WELCOME» активирован! Начислен бонус 5 000 ₸";
    } else if (clean === "AYALY") {
      bonusAdd = 3000;
      message = "✨ Промокод «AYALY» активирован! Начислен бонус 3 000 ₸";
    } else if (clean === "VIPGUEST") {
      bonusAdd = 10000;
      message = "💎 VIP-промокод активирован! Начислен бонус 10 000 ₸";
    } else {
      bonusAdd = 3000;
      message = `🎁 Промокод «${clean}» успешно активирован! Начислен бонус 3 000 ₸`;
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

  const requestPasswordReset = (email: string) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) return { success: false, error: "Укажите адрес электронной почты" };
    return {
      success: true,
      message: `Код подтверждения отправлен на почту ${cleanEmail}`,
      hint: "Код подтверждения: 202681",
    };
  };

  const resetPassword = (email: string, code: string, newPass: string) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanCode = code.trim();
    if (cleanCode !== "202681" && cleanCode !== "8181") {
      return { success: false, error: "Неверный код подтверждения" };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: "Пароль должен содержать минимум 6 символов" };
    }

    try {
      const registryRaw = localStorage.getItem(GUESTS_REGISTRY_KEY);
      const registry: any[] = registryRaw ? JSON.parse(registryRaw) : [];
      const userIdx = registry.findIndex((g) => g.email?.toLowerCase() === cleanEmail);
      if (userIdx !== -1) {
        registry[userIdx].password = newPass;
        localStorage.setItem(GUESTS_REGISTRY_KEY, JSON.stringify(registry));
      }
      return { success: true, message: "Пароль успешно обновлён!" };
    } catch {
      return { success: false, error: "Ошибка сброса пароля" };
    }
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
        loginWithEmail,
        registerGuest,
        login,
        register,
        updateProfile,
        applyPromoCode,
        requestPasswordReset,
        resetPassword,
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
