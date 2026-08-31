"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, KeyRound, Wifi, HeartHandshake } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-sand-300 bg-sand-50/70 pb-20 pt-12 md:pb-12 text-sand-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-sand-200">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">{t.footer.prop_1_title}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{t.footer.prop_1_sub}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">{t.footer.prop_2_title}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{t.footer.prop_2_sub}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 shrink-0">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">{t.footer.prop_3_title}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{t.footer.prop_3_sub}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">{t.footer.prop_4_title}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{t.footer.prop_4_sub}</p>
            </div>
          </div>
        </div>

        {/* Links and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <span className="font-semibold text-emerald-950">Ayaly Meken Stays</span>
            <span className="text-stone-400">{t.footer.powered_by}</span>
          </div>

          <div className="flex items-center gap-6 text-stone-500 font-medium">
            <Link href="/?city=Almaty" className="hover:text-emerald-900 transition-colors">{t.search.almaty}</Link>
            <Link href="/?city=Astana" className="hover:text-emerald-900 transition-colors">{t.search.astana}</Link>
            <Link href="/?city=Shymkent" className="hover:text-emerald-900 transition-colors">{t.search.shymkent}</Link>
            <Link href="/bookings" className="hover:text-emerald-900 transition-colors">{t.nav.trips}</Link>
            <Link href="/map" className="hover:text-emerald-900 transition-colors">{t.home.on_map}</Link>
          </div>

          <p className="text-stone-400">
            © {new Date().getFullYear()} Ayaly Meken Inc. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
