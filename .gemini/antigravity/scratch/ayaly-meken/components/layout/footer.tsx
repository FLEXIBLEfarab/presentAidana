import Link from "next/link";
import { Sparkles, ShieldCheck, KeyRound, Wifi, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-sand-300 bg-sand-50/70 pb-20 pt-12 md:pb-12 text-sand-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-sand-200">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">Бесконтактный заезд</h4>
              <p className="text-xs text-stone-500 mt-0.5">Персональный ПИН-код двери приходит мгновенно после бронирования.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">Гостиничный стандарт</h4>
              <p className="text-xs text-stone-500 mt-0.5">Профессиональная уборка и гостиничное бельё перед каждым заездом.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">Быстрый Wi-Fi</h4>
              <p className="text-xs text-stone-500 mt-0.5">Проверенное высокоскоростное интернет-соединение в каждой резиденции.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-950">Поддержка 24/7</h4>
              <p className="text-xs text-stone-500 mt-0.5">Оперативная помощь через WhatsApp и консьерж-сервис.</p>
            </div>
          </div>
        </div>

        {/* Links and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <span className="font-semibold text-emerald-950">Ayaly Meken Stays</span>
            <span>• На базе Altyn Qonaq PMS</span>
          </div>

          <div className="flex items-center gap-6 text-stone-500">
            <Link href="/?city=Almaty" className="hover:text-emerald-900 transition-colors">Алматы</Link>
            <Link href="/?city=Astana" className="hover:text-emerald-900 transition-colors">Астана</Link>
            <Link href="/?city=Shymkent" className="hover:text-emerald-900 transition-colors">Шымкент</Link>
            <Link href="/bookings" className="hover:text-emerald-900 transition-colors">Мои поездки</Link>
            <Link href="/map" className="hover:text-emerald-900 transition-colors">На карте</Link>
          </div>

          <p className="text-stone-400">
            © {new Date().getFullYear()} Ayaly Meken Inc. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
