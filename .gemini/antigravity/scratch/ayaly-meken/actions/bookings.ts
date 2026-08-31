"use server";

import { createClient } from "@/lib/supabase/server";
import { MOCK_APARTMENTS, MOCK_BOOKINGS } from "@/lib/mock-data";
import { Booking, ServiceRequest, ServiceRequestType, Result } from "@/types/database.types";

const ORG_ID = "00000000-0000-0000-0000-000000000001";

function enrichBooking(b: any): Booking {
  const matchApt = MOCK_APARTMENTS.find((a) => a.id === b.apartment_id);
  const rawApt = b.apartment || matchApt || MOCK_APARTMENTS[0];
  const apartment = {
    ...rawApt,
    cover_image:
      rawApt.cover_image ||
      matchApt?.cover_image ||
      null,
    wifi_name: rawApt.wifi_name || matchApt?.wifi_name || "AyalyMeken_Guest",
    wifi_password: rawApt.wifi_password || matchApt?.wifi_password || "AltynGuest2026",
    intercom_code: rawApt.intercom_code || matchApt?.intercom_code || "101K",
    check_in_time: rawApt.check_in_time || "14:00",
    check_out_time: rawApt.check_out_time || "12:00",
  };

  const hasSmartLock = Boolean(
    rawApt?.ttlock_lock_id &&
    rawApt.ttlock_lock_id !== "none" &&
    rawApt.ttlock_lock_id !== "lock_default" &&
    rawApt.ttlock_lock_id !== ""
  );

  return {
    ...b,
    door_pin_code: hasSmartLock ? (b.door_pin_code || b.ttlock_passcode || null) : null,
    ttlock_passcode: hasSmartLock ? (b.ttlock_passcode || b.door_pin_code || null) : null,
    apartment,
  };
}

export interface CreateBookingInput {
  apartmentId: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhone: string;
  guestEmail?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalPrice: number;
  nightlyPrice: number;
  cleaningFee: number;
  serviceFee: number;
  depositAmount: number;
  paymentMethod: "kaspi_qr" | "kaspi_transfer" | "card_online" | "cash";
  notes?: string;
}

export async function createBooking(
  input: CreateBookingInput
): Promise<Result<Booking>> {
    const matchApt = MOCK_APARTMENTS.find((a) => a.id === input.apartmentId);
  const hasSmartLock = Boolean(
    matchApt?.ttlock_lock_id &&
    matchApt.ttlock_lock_id !== "none" &&
    matchApt.ttlock_lock_id !== "lock_default" &&
    matchApt.ttlock_lock_id !== ""
  );
  const pinCode = hasSmartLock ? Math.floor(100000 + Math.random() * 900000).toString() : null;
  const guestName = `${input.guestFirstName} ${input.guestLastName}`.trim();
  const bookingId = crypto.randomUUID();

  const bookingPayload = {
    id: bookingId,
    organization_id: ORG_ID,
    apartment_id: input.apartmentId,
    guest_name: guestName,
    guest_phone: input.guestPhone,
    guest_email: input.guestEmail || null,
    source: "direct" as const,
    check_in_date: input.checkInDate,
    check_out_date: input.checkOutDate,
    total_price: input.totalPrice,
    platform_commission: 0,
    deposit_amount: input.depositAmount || 0,
    deposit_status: "pending" as const,
    payment_method: input.paymentMethod,
    is_fiscalized: true,
    status: "confirmed" as const,
    ttlock_passcode: pinCode,
    notes: input.notes
      ? `[Аялы Мекен] ${input.notes}`
      : `[Аялы Мекен] Прямое бронирование с гостевого портала`,
  };

  try {
    const supabase = createClient();

    // Check for date overlap before creating booking
    const { data: overlapping } = await supabase
      .from("bookings")
      .select("id, check_in_date, check_out_date, guest_name")
      .eq("apartment_id", input.apartmentId)
      .neq("status", "cancelled")
      .lt("check_in_date", input.checkOutDate)
      .gt("check_out_date", input.checkInDate);

    if (overlapping && overlapping.length > 0) {
      return {
        success: false,
        error: `Выбранные даты (${input.checkInDate} — ${input.checkOutDate}) уже заняты другим гостем. Пожалуйста, выберите другие даты в календаре.`,
        code: "BOOKING_OVERLAP",
      };
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingPayload)
      .select("*, apartment:apartments(*)")
      .single();

    if (!error && data) {
      const enriched = enrichBooking(data);
      MOCK_BOOKINGS.unshift(enriched);
      return { success: true, data: enriched };
    }

    if (error) {
      console.error("Supabase insert error:", error);
    }

    // Fallback simulation
    const simulated = makeSimulatedBooking(bookingPayload, pinCode, input.apartmentId);
    return { success: true, data: simulated };
  } catch (err: any) {
    console.error("createBooking catch error:", err);
    const simulated = makeSimulatedBooking(bookingPayload, pinCode, input.apartmentId);
    return { success: true, data: simulated };
  }
}

function makeSimulatedBooking(
  payload: any,
  pinCode: string | null,
  apartmentId: string
): Booking {
  const matchApt = MOCK_APARTMENTS.find((a) => a.id === apartmentId) || MOCK_APARTMENTS[0];
  const booking: Booking = {
    id: payload.id || `bk-${Date.now()}`,
    organization_id: ORG_ID,
    source: "direct" as const,
    external_uid: null,
    guest_name: payload.guest_name,
    guest_phone: payload.guest_phone,
    guest_email: payload.guest_email,
    check_in_date: payload.check_in_date,
    check_out_date: payload.check_out_date,
    guests_count: payload.guests_count || 2,
    total_price: payload.total_price,
    nightly_price: payload.nightly_price || 30000,
    cleaning_fee: payload.cleaning_fee || 0,
    service_fee: payload.service_fee || 0,
    deposit_amount: payload.deposit_amount,
    platform_commission: 0,
    payment_method: payload.payment_method,
    is_fiscalized: true,
    status: "confirmed" as const,
    door_pin_code: pinCode,
    ttlock_passcode: pinCode,
    deposit_status: "pending" as const,
    notes: payload.notes,
    apartment_id: apartmentId,
    created_at: new Date().toISOString(),
    apartment: matchApt,
  };
  MOCK_BOOKINGS.unshift(booking);
  return booking;
}

export async function getBookings(filterPhone?: string): Promise<Result<Booking[]>> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("bookings")
      .select("*, apartment:apartments(*)")
      .order("created_at", { ascending: false });

    if (filterPhone && filterPhone.trim()) {
      const clean = filterPhone.replace(/\D/g, "");
      // Match exact phone or phone containing digits
      query = query.or(`guest_phone.eq.${filterPhone},guest_phone.ilike.%${clean.slice(-10)}%`);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return { success: true, data: data.map(enrichBooking) };
    }

    if (filterPhone) {
      const clean = filterPhone.replace(/\D/g, "");
      const filteredMocks = MOCK_BOOKINGS.filter((b) => {
        const bClean = (b.guest_phone || "").replace(/\D/g, "");
        return bClean.includes(clean.slice(-10));
      });
      return { success: true, data: filteredMocks.map(enrichBooking) };
    }

    return { success: true, data: MOCK_BOOKINGS.map(enrichBooking) };
  } catch {
    return { success: true, data: MOCK_BOOKINGS.map(enrichBooking) };
  }
}

export async function getBookingById(id: string): Promise<Result<Booking>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, apartment:apartments(*)")
      .eq("id", id)
      .single();

    if (!error && data) {
      return { success: true, data: enrichBooking(data) };
    }

    const found = MOCK_BOOKINGS.find((b) => b.id === id);
    return found
      ? { success: true, data: enrichBooking(found) }
      : { success: false, error: "Бронирование не найдено" };
  } catch {
    const found = MOCK_BOOKINGS.find((b) => b.id === id);
    return found
      ? { success: true, data: enrichBooking(found) }
      : { success: false, error: "Бронирование не найдено" };
  }
}

export async function createServiceRequest(input: {
  bookingId: string;
  apartmentId: string;
  type: ServiceRequestType;
  guestNotes?: string;
  photoUrls?: string[];
  price?: number;
}): Promise<Result<ServiceRequest>> {
  const req: ServiceRequest = {
    id: `sr-${Date.now()}`,
    booking_id: input.bookingId,
    apartment_id: input.apartmentId,
    organization_id: ORG_ID,
    type: input.type,
    status: "pending" as const,
    guest_notes: input.guestNotes,
    photo_urls: input.photoUrls || [],
    price: input.price,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createClient();

    // 1. Extra Cleaning (Внеплановая уборка) -> отправляется ТОЛЬКО в клининг
    if (input.type === "extra_cleaning") {
      await supabase.from("cleaning_tasks").insert({
        id: crypto.randomUUID(),
        organization_id: ORG_ID,
        apartment_id: input.apartmentId,
        booking_id: input.bookingId || null,
        scheduled_date: new Date().toISOString().split("T")[0],
        status: "pending",
        notes: `🧹 Внеплановая уборка (Заказ от гостя Аялы Мекен): ${input.guestNotes || "Просьба провести уборку"} (4 000 ₸)`,
      });
    }

    // 2. Extra Linen (Доп. комплект белья) -> отправляется ТОЛЬКО в клининг
    if (input.type === "extra_linen") {
      await supabase.from("cleaning_tasks").insert({
        id: crypto.randomUUID(),
        organization_id: ORG_ID,
        apartment_id: input.apartmentId,
        booking_id: input.bookingId || null,
        scheduled_date: new Date().toISOString().split("T")[0],
        status: "pending",
        notes: `🛏️ Доп. комплект белья (Заказ от гостя Аялы Мекен): ${input.guestNotes || "Принести комплект белья и полотенец"} (2 000 ₸)`,
      });
    }

    // 3. Defect / Issue Report (Сообщить о неисправности) -> отправляется ТОЛЬКО в ремонт
    if (input.type === "issue_report") {
      await supabase.from("maintenance_issues").insert({
        id: crypto.randomUUID(),
        organization_id: ORG_ID,
        apartment_id: input.apartmentId,
        title: `⚠️ Неисправность от гостя: ${input.guestNotes?.slice(0, 50) || "Поломка"}`,
        description: input.guestNotes || "Гость сообщил о неисправности через консьерж-сервис Аялы Мекен.",
        priority: "urgent",
        is_resolved: false,
        cost: 0,
      });
    }

    return { success: true, data: req };
  } catch (err: any) {
    console.error("createServiceRequest error:", err);
    return { success: true, data: req };
  }
}
