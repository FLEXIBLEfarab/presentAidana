"use client";

import { useI18n, type Lang } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  const langs: { id: Lang; label: string }[] = [
    { id: "ru", label: t.language.ru },
    { id: "kz", label: t.language.kz },
    { id: "en", label: t.language.en },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-sand-300 bg-white p-0.5 shadow-sm">
      {langs.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setLang(item.id)}
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-bold transition-all cursor-pointer",
            lang === item.id
              ? "bg-emerald-900 text-cream-50 shadow-sm"
              : "text-stone-500 hover:text-stone-900 hover:bg-sand-100/60"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
