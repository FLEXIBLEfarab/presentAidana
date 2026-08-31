"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Result, Review, Booking } from "@/types/database.types";
import { getBookings, getBookingById } from "@/actions/bookings";

export interface CreateReviewParams {
  apartmentId: string;
  bookingId?: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  rating: number;
  comment: string;
  cleanlinessRating?: number;
  locationRating?: number;
  checkinRating?: number;
}

export interface ReviewEligibility {
  canReview: boolean;
  status: "eligible" | "not_logged_in" | "no_booking" | "stay_in_progress";
  message: string;
  bookingId?: string;
  checkOutDate?: string;
}

// In-memory persistent cache fallback for reviews
let MEMORY_REVIEWS: Record<string, Review[]> = {};

export async function getApartmentReviews(apartmentId: string): Promise<Result<Review[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("apartment_id", apartmentId)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return { success: true, data: data as Review[] };
    }

    const fallback = MEMORY_REVIEWS[apartmentId] || [];
    return { success: true, data: fallback };
  } catch {
    const fallback = MEMORY_REVIEWS[apartmentId] || [];
    return { success: true, data: fallback };
  }
}

export async function checkReviewEligibility(
  apartmentId: string,
  guestPhone?: string,
  guestEmail?: string,
  bookingId?: string
): Promise<Result<ReviewEligibility>> {
  try {
    const now = new Date();

    // 1. Direct booking ID check
    if (bookingId) {
      const bRes = await getBookingById(bookingId);
      if (bRes.success && bRes.data) {
        const b = bRes.data;
        const checkOut = new Date(b.check_out_date);
        checkOut.setHours(12, 0, 0, 0);

        const isEnded =
          (b.status as string) === "checked_out" ||
          now.getTime() >= checkOut.getTime();

        if (isEnded) {
          return {
            success: true,
            data: {
              canReview: true,
              status: "eligible",
              message: "Проживание завершено. Вы можете оставить отзыв.",
              bookingId: b.id,
              checkOutDate: b.check_out_date,
            },
          };
        } else {
          return {
            success: true,
            data: {
              canReview: false,
              status: "stay_in_progress",
              message: "Ваше проживание еще не завершено. Оставить отзыв можно будет после окончания брони (" + b.check_out_date + " после 12:00).",
              bookingId: b.id,
              checkOutDate: b.check_out_date,
            },
          };
        }
      }
    }

    // 2. Not logged in
    if (!guestPhone && !guestEmail) {
      return {
        success: true,
        data: {
          canReview: false,
          status: "not_logged_in",
          message: "Войдите в аккаунт гостя, чтобы подтвердить проживание и оставить отзыв.",
        },
      };
    }

    // 3. Query bookings for this phone/guest
    const bookingsRes = await getBookings(guestPhone);
    const userBookings = (bookingsRes.success && bookingsRes.data ? bookingsRes.data : []).filter(
      (b) => b.apartment_id === apartmentId || (b.apartment && b.apartment.id === apartmentId)
    );

    if (userBookings.length === 0) {
      return {
        success: true,
        data: {
          canReview: false,
          status: "no_booking",
          message: "Отзывы доступны только гостям, завершившим проживание в данных апартаментах.",
        },
      };
    }

    // 4. Find if any booking has ended
    const completedBooking = userBookings.find((b) => {
      if ((b.status as string) === "checked_out") return true;
      const checkOut = new Date(b.check_out_date);
      checkOut.setHours(12, 0, 0, 0);
      return now.getTime() >= checkOut.getTime();
    });

    if (completedBooking) {
      return {
        success: true,
        data: {
          canReview: true,
          status: "eligible",
          message: "Проживание подтверждено. Вы можете оставить отзыв.",
          bookingId: completedBooking.id,
          checkOutDate: completedBooking.check_out_date,
        },
      };
    }

    // 5. Booking exists but checkout date is in the future
    const activeBooking = userBookings[0];
    return {
      success: true,
      data: {
        canReview: false,
        status: "stay_in_progress",
        message: "Ваше проживание еще продолжается. Оставить отзыв можно будет после выезда (" + activeBooking.check_out_date + " после 12:00).",
        bookingId: activeBooking.id,
        checkOutDate: activeBooking.check_out_date,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Ошибка проверки права на отзыв",
    };
  }
}

export async function createReview(params: CreateReviewParams): Promise<Result<Review>> {
  try {
    // Check eligibility strictly before creating review
    const eligibilityRes = await checkReviewEligibility(
      params.apartmentId,
      params.guestPhone,
      params.guestEmail,
      params.bookingId
    );

    if (eligibilityRes.success && eligibilityRes.data && !eligibilityRes.data.canReview) {
      return {
        success: false,
        error: eligibilityRes.data.message || "Оставить отзыв можно только после окончания срока бронирования (после даты выезда).",
      };
    }

    const now = new Date();
    const newReview: Review = {
      id: crypto.randomUUID(),
      apartment_id: params.apartmentId,
      booking_id: params.bookingId || eligibilityRes.data?.bookingId || null,
      author_name: params.guestName.trim() || "Гость",
      guest_name: params.guestName.trim() || "Гость",
      rating: Math.max(1, Math.min(5, params.rating)),
      date: now.toLocaleDateString("ru-RU"),
      comment: params.comment.trim(),
      cleanliness_rating: params.cleanlinessRating || params.rating,
      location_rating: params.locationRating || params.rating,
      checkin_rating: params.checkinRating || params.rating,
      created_at: now.toISOString(),
    };

    // Store in memory cache
    if (!MEMORY_REVIEWS[params.apartmentId]) {
      MEMORY_REVIEWS[params.apartmentId] = [];
    }
    MEMORY_REVIEWS[params.apartmentId].unshift(newReview);

    // Try storing in Supabase if table exists
    try {
      const supabase = createClient();
      await supabase.from("reviews").insert(newReview);
    } catch {
      // ignore if schema table not present
    }

    revalidatePath("/apartments/" + params.apartmentId);
    if (params.bookingId) {
      revalidatePath("/bookings/" + params.bookingId);
      revalidatePath("/guest/" + params.bookingId);
    }
    revalidatePath("/bookings");

    return { success: true, data: newReview };
  } catch (e: any) {
    return { success: false, error: e?.message || "Ошибка сохранения отзыва" };
  }
}
