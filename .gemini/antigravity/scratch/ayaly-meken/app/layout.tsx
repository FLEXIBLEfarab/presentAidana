import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { ProfileModal } from "@/components/profile/profile-modal";

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
  metadataBase: new URL("https://ayaly-meken.kz"),
  title: {
    default: "Ayaly Meken — Аренда посуточных апартаментов в Казахстане | Бесконтактный заезд",
    template: "%s | Ayaly Meken",
  },
  description: "Ayaly Meken (Аялы Мекен) — премиальные посуточные апартаменты в Алматы и Астане. Мгновенное бронирование, бесконтактный доступ по PIN-коду (TTLock), гостиничный сервис и идеальная чистота.",
  keywords: [
    "Ayaly Meken",
    "Аялы Мекен",
    "ayaly-meken.kz",
    "аренда квартир посуточно Алматы",
    "посуточно Астана",
    "апартаменты посуточно Казахстан",
    "бесконтактное заселение Алматы",
    "умные замки апартаменты",
    "квартиры посуточно Highvill",
    "квартиры посуточно",
  ],
  authors: [{ name: "Ayaly Meken", url: "https://ayaly-meken.kz" }],
  creator: "Ayaly Meken",
  publisher: "Ayaly Meken",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    url: "https://ayaly-meken.kz",
    title: "Ayaly Meken — Умные апартаменты в Казахстане",
    description: "Премиальные квартиры с бесконтактным заездом в Алматы и Астане. Мгновенное бронирование, электронные PIN-коды, гостиничный сервис.",
    siteName: "Ayaly Meken",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "Ayaly Meken Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayaly Meken — Аренда апартаментов в Казахстане",
    description: "Бесконтактный заезд по PIN-коду в Алматы и Астане — Ayaly Meken («Аялы Мекен»)",
    images: ["/icons/icon-512.png"],
  },
  alternates: {
    canonical: "https://ayaly-meken.kz",
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Ayaly Meken",
  "url": "https://ayaly-meken.kz",
  "description": "Премиальные посуточные апартаменты с умными замками и бесконтактным заселением в Казахстане.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KZ"
  },
  "priceRange": "15000 - 60000 KZT"
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
            <ProfileModal />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
