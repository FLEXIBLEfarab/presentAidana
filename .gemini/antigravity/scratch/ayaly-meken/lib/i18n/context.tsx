"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import ru from "./ru";
import kz from "./kz";
import en from "./en";

export type Lang = "ru" | "kz" | "en";
export type Translations = typeof ru;

const dictionaries: Record<Lang, Translations> = { ru, kz, en };

interface I18nContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "ru",
  t: ru,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ayaly_lang") as Lang;
      if (saved && (saved === "ru" || saved === "kz" || saved === "en")) {
        setLangState(saved);
      }
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("ayaly_lang", l);
    } catch {}
  }, []);

  const currentDict = dictionaries[lang] || ru;

  return (
    <I18nContext.Provider value={{ lang, t: currentDict, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
