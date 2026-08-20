"use client";

import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-sand-300 bg-white p-0.5 shadow-sm">
      <button
        onClick={() => setLang("ru")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-bold transition-all",
          lang === "ru"
            ? "bg-emerald-900 text-cream-50 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        )}
      >
        {t.language.ru}
      </button>
      <button
        onClick={() => setLang("kz")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-bold transition-all",
          lang === "kz"
            ? "bg-emerald-900 text-cream-50 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        )}
      >
        {t.language.kz}
      </button>
    </div>
  );
}
