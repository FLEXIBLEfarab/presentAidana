"use client";

import { useState } from "react";
import { Mountain, Sparkles, Building2, Home, Briefcase, Heart, Award, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  onSelectCategory?: (category: string) => void;
}

export function CategoryTabs({ onSelectCategory }: CategoryTabsProps) {
  const [selected, setSelected] = useState("all");

  const categories = [
    { id: "all", label: "Все варианты", icon: Sparkles },
    { id: "mountain", label: "Вид на горы", icon: Mountain },
    { id: "luxury", label: "Люкс и VIP", icon: Award },
    { id: "studio", label: "Студии", icon: Layers },
    { id: "family", label: "Для семей", icon: Home },
    { id: "business", label: "Бизнес-трипы", icon: Briefcase },
    { id: "popular", label: "Гость рекомендует", icon: Heart },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    if (onSelectCategory) {
      onSelectCategory(id);
    }
  };

  return (
    <div className="w-full border-b border-sand-200/80 bg-cream-50/50 py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selected === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all shrink-0",
                  isActive
                    ? "bg-emerald-900 text-cream-50 shadow-sm"
                    : "bg-white/80 border border-sand-300 text-stone-600 hover:border-emerald-900/30 hover:text-emerald-950"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-amber-300" : "text-emerald-800")} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
