"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import kz from "./kz";
import ru from "./ru";

export type Lang = "ru" | "kz";
export type Translations = typeof ru;

const dictionaries = { ru, kz };

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

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
