"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Luggage, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    {
      label: t.nav.explore,
      href: "/" as string,
      icon: Search,
      active: pathname === "/" || pathname.startsWith("/apartments") || pathname.startsWith("/search"),
      external: false,
    },
    {
      label: t.nav.saved,
      href: "/#saved" as string,
      icon: Heart,
      active: false,
      external: false,
    },
    {
      label: t.nav.trips,
      href: "/bookings" as string,
      icon: Luggage,
      active: pathname.startsWith("/bookings") || pathname.startsWith("/guest"),
      external: false,
    },
    {
      label: t.nav.support,
      href: "https://wa.me/77001234567" as string,
      icon: MessageCircle,
      active: false,
      external: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-sand-200/80 bg-white/95 px-2 pb-safe backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          const inner = (
            <>
              <div className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-2xl transition-all",
                item.active ? "bg-emerald-100 scale-110" : ""
              )}>
                <Icon className={cn("h-5 w-5", item.active && "stroke-[2.5px]")} />
              </div>
              <span className={cn("text-[10px] tracking-tight leading-none", item.active && "font-bold")}>
                {item.label}
              </span>
            </>
          );

          const itemClass = cn(
            "flex flex-col items-center gap-1 min-w-0 flex-1 py-1 transition-colors",
            item.active ? "text-emerald-800" : "text-stone-400 hover:text-stone-600"
          );

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
              >
                {inner}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={itemClass}>
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
