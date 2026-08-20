import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ayaly Meken — Апартаменты в Казахстане",
  description: "Умные апартаменты с бесконтактным заездом в Алматы, Астане и Шымкенте. Мгновенное бронирование, цифровой ПИН-код, гостиничный уровень сервиса.",
  keywords: ["аренда апартаментов Алматы", "посуточно Астана", "TTLock бесконтактный заезд", "Аялы Мекен"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ayaly Meken",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jakartaSans.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50 font-sans antialiased text-stone-800">
        <AuthProvider>
          <I18nProvider>
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <AuthModal />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
