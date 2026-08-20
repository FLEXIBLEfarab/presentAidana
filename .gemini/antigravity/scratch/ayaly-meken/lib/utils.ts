import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, isWeekend, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to Kazakhstani Tenge (KZT ₸)
 * Example: formatKZT(28500) -> "28 500 ₸"
 */
export function formatKZT(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${formatted} ₸`;
}

/**
 * Pricing breakdown between checkIn and checkOut dates
 */
export interface PriceCalculation {
  nights: number;
  basePrice: number;
  baseTotal: number;
  weekendSurgeTotal: number;
  cleaningFee: number;
  serviceFee: number;
  discountTotal: number;
  depositAmount: number;
  total: number;
  discountPercent: number;
}

export function calculateBookingPrice({
  baseNightPrice,
  checkIn,
  checkOut,
}: {
  baseNightPrice: number;
  checkIn?: string | Date;
  checkOut?: string | Date;
  weekendSurgePercent?: number;
  weekendSurgeEnabled?: boolean;
  cleaningFee?: number;
  serviceFeePercent?: number;
  longStayDiscountEnabled?: boolean;
  depositAmount?: number;
}): PriceCalculation {
  if (!checkIn || !checkOut) {
    return {
      nights: 1,
      basePrice: baseNightPrice,
      baseTotal: baseNightPrice,
      weekendSurgeTotal: 0,
      cleaningFee: 0,
      serviceFee: 0,
      discountTotal: 0,
      depositAmount: 0,
      discountPercent: 0,
      total: baseNightPrice,
    };
  }

  const inDate = typeof checkIn === "string" ? parseISO(checkIn) : checkIn;
  const outDate = typeof checkOut === "string" ? parseISO(checkOut) : checkOut;

  const diffDays = Math.max(1, differenceInDays(outDate, inDate));
  const finalTotal = baseNightPrice * diffDays;

  return {
    nights: diffDays,
    basePrice: baseNightPrice,
    baseTotal: finalTotal,
    weekendSurgeTotal: 0,
    cleaningFee: 0,
    serviceFee: 0,
    discountTotal: 0,
    discountPercent: 0,
    depositAmount: 0,
    total: finalTotal,
  };
}

export function formatDateRange(checkIn?: string, checkOut?: string): string {
  if (!checkIn && !checkOut) return "Выберите даты";
  if (checkIn && !checkOut) return format(parseISO(checkIn), "d MMM");
  if (checkIn && checkOut) {
    const d1 = parseISO(checkIn);
    const d2 = parseISO(checkOut);
    return `${format(d1, "d MMM")} — ${format(d2, "d MMM yyyy")}`;
  }
  return "Выберите даты";
}

export function formatDateShort(date: string): string {
  return format(parseISO(date), "d MMM yyyy");
}

/** Check if current time is within the check-in window */
export function isWithinCheckinWindow(
  checkInDate: string,
  checkOutDate: string
): boolean {
  const now = new Date();
  const [checkInHour] = "14:00".split(":").map(Number);
  const [checkOutHour] = "12:00".split(":").map(Number);

  const checkIn = parseISO(checkInDate);
  const checkOut = parseISO(checkOutDate);

  // Window: from checkIn date at 14:00 to checkOut date at 12:00
  const windowStart = new Date(checkIn);
  windowStart.setHours(checkInHour, 0, 0, 0);

  const windowEnd = new Date(checkOut);
  windowEnd.setHours(checkOutHour, 0, 0, 0);

  return now >= windowStart && now <= windowEnd;
}

/** Build WhatsApp deep-link with pre-filled Kazakh/Russian message */
export function buildWhatsAppLink({
  phone,
  apartmentName,
  dates,
  bookingId,
}: {
  phone: string;
  apartmentName: string;
  dates: string;
  bookingId: string;
}): string {
  const message = encodeURIComponent(
    `Сәлеметсіз бе! Мен «${apartmentName}» пәтерін ${dates} күндеріне брондадым. Бронь ID: #${bookingId}. Төлем жасау үшін Kaspi реквизиттерін жібересіз бе?`
  );
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
