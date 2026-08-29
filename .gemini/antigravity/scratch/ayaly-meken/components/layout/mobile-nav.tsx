"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Luggage, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { useGuestAuth } from "@/lib/auth-context";
import { SupportChatModal } from "@/components/support/support-chat-modal";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, openAuthModal, openProfileModal } = useGuestAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleProfileClick = () => {
    if (user) {
      openProfileModal();
    } else {
      openAuthModal();
    }
  };

  const navItems = [
    {
      label: t.nav.explore,
      href: "/" as string,
      icon: Search,
      active: pathname === "/" || pathname.startsWith("/apartments") || pathname.startsWith("/search"),
      onClick: undefined,
    },
    {
      label: t.nav.trips,
      href: "/bookings" as string,
      icon: Luggage,
      active: pathname.startsWith("/bookings") || pathname.startsWith("/guest"),
      onClick: undefined,
    },
    {
      label: "Поддержка",
      href: "#support" as string,
      icon: MessageCircle,
      active: isSupportOpen,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSupportOpen(true);
      },
    },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-sand-200/90 bg-white/95 backdrop-blur-xl md:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 22px), 22px)",
        }}
      >
        <div className="flex items-center justify-around pt-2 pb-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const inner = (
              <>
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-2xl transition-all",
                    item.active ? "bg-emerald-100 text-emerald-900 scale-105" : ""
                  )}
                >
                  <Icon className={cn("h-5 w-5", item.active && "stroke-[2.5px]")} />
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-tight leading-none pt-0.5",
                    item.active ? "font-bold text-emerald-950" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </>
            );

            const itemClass = cn(
              "flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1 transition-colors cursor-pointer",
              item.active ? "text-emerald-900" : "text-stone-400 hover:text-stone-600"
            );

            if (item.onClick) {
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={item.onClick}
                  className={itemClass}
                >
                  {inner}
                </button>
              );
            }

            return (
              <Link key={item.label} href={item.href} className={itemClass}>
                {inner}
              </Link>
            );
          })}

          {/* Profile Button */}
          <button
            type="button"
            onClick={handleProfileClick}
            className="flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-2xl transition-all">
              <User className="h-5 w-5" />
              {user && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none pt-0.5 font-medium">
              {user ? (user.name?.split(" ")[0] || "Профиль") : "Войти"}
            </span>
          </button>
        </div>
      </nav>

      {/* In-App Live Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </>
  );
}
