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
