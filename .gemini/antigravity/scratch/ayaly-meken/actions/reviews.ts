"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Result, Review } from "@/types/database.types";

export interface CreateReviewParams {
  apartmentId: string;
  bookingId?: string;
  guestName: string;
  rating: number;
  comment: string;
  cleanlinessRating?: number;
  locationRating?: number;
  checkinRating?: number;
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

export async function createReview(params: CreateReviewParams): Promise<Result<Review>> {
  try {
    const now = new Date();
    const newReview: Review = {
      id: crypto.randomUUID(),
      apartment_id: params.apartmentId,
      booking_id: params.bookingId || null,
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

    revalidatePath(`/apartments/${params.apartmentId}`);
    if (params.bookingId) {
      revalidatePath(`/bookings/${params.bookingId}`);
      revalidatePath(`/guest/${params.bookingId}`);
    }
    revalidatePath("/bookings");

    return { success: true, data: newReview };
  } catch (e: any) {
    return { success: false, error: e?.message || "Ошибка сохранения отзыва" };
  }
}
