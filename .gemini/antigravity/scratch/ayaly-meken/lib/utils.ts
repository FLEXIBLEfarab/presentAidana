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

/**
 * Validates that the guest is at least 16 years old based on Birth Date and/or Kazakhstani IIN (ЖСН).
 */
export function validateGuestAge({
  birthDate,
  iin,
}: {
  birthDate?: string;
  iin?: string;
}): { isValid: boolean; error: string | null; age?: number } {
  const minAge = 16;
  const now = new Date();

  // 1. Validate by IIN if provided
  if (iin) {
    const cleanIin = iin.replace(/\D/g, "");
    if (cleanIin.length === 12) {
      const yy = parseInt(cleanIin.substring(0, 2), 10);
      const mm = parseInt(cleanIin.substring(2, 4), 10);
      const dd = parseInt(cleanIin.substring(4, 6), 10);
      const centuryDigit = parseInt(cleanIin.substring(6, 7), 10);

      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        let fullYear = 1900 + yy;
        if (centuryDigit === 5 || centuryDigit === 6 || yy <= 30) {
          fullYear = 2000 + yy;
        }

        const dobFromIin = new Date(fullYear, mm - 1, dd);
        let ageFromIin = now.getFullYear() - dobFromIin.getFullYear();
        const m = now.getMonth() - dobFromIin.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dobFromIin.getDate())) {
          ageFromIin--;
        }

        if (ageFromIin < minAge) {
          return {
            isValid: false,
            error: `По данным ИИН ваш возраст (${ageFromIin} лет) меньше 16. Бронирование разрешено только с 16 лет.`,
            age: ageFromIin,
          };
        }
        return { isValid: true, error: null, age: ageFromIin };
      }
    }
  }

  // 2. Validate by direct birth date
  if (birthDate) {
    const dob = parseISO(birthDate);
    if (!isNaN(dob.getTime())) {
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age--;
      }

      if (age < minAge) {
        return {
          isValid: false,
          error: `Бронирование доступно гостям от 16 лет. Вам должно исполниться 16 лет.`,
          age,
        };
      }
      return { isValid: true, error: null, age };
    }
  }

  return { isValid: true, error: null };
}

/**
 * Extracts formatted birth date string from 12-digit IIN (YYYY-MM-DD).
 */
export function getBirthDateFromIin(iin: string): string | null {
  const clean = iin.replace(/\D/g, "");
  if (clean.length !== 12) return null;

  const yy = parseInt(clean.substring(0, 2), 10);
  const mm = parseInt(clean.substring(2, 4), 10);
  const dd = parseInt(clean.substring(4, 6), 10);
  const century = parseInt(clean.substring(6, 7), 10);

  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  let fullYear = 1900 + yy;
  if (century === 5 || century === 6 || yy <= 30) {
    fullYear = 2000 + yy;
  }

  const mmStr = String(mm).padStart(2, "0");
  const ddStr = String(dd).padStart(2, "0");
  return `${fullYear}-${mmStr}-${ddStr}`;
}
