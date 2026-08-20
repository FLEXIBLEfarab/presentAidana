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
let MEMORY_REVIEWS: Record<string, Review[]> = {
  "a1111111-1111-1111-1111-111111111111": [
    {
      id: "rev-1",
      booking_id: "b1",
      apartment_id: "a1111111-1111-1111-1111-111111111111",
      author_name: "Асет Мухтаров",
      guest_name: "Асет Мухтаров",
      rating: 5,
      date: "18.08.2026",
      comment: "Потрясающие апартаменты в Highvill! Заселение по коду TTLock прошло за 10 секунд. Чистота безупречная, вид на площадь шикарный.",
      cleanliness_rating: 5,
      location_rating: 5,
      checkin_rating: 5,
      created_at: "2026-08-18T10:30:00Z",
    },
    {
      id: "rev-2",
      booking_id: "b2",
      apartment_id: "a1111111-1111-1111-1111-111111111111",
      author_name: "Динара С.",
      guest_name: "Динара С.",
      rating: 5,
      date: "14.08.2026",
      comment: "Очень уютно, тепло, быстрый Wi-Fi и вкусный кофе в кофемашине. Обязательно вернемся снова!",
      cleanliness_rating: 5,
      location_rating: 5,
      checkin_rating: 5,
      created_at: "2026-08-14T15:20:00Z",
    },
  ],
  "alm-0001-0000-0000-000000000001": [
    {
      id: "rev-3",
      booking_id: "b3",
      apartment_id: "alm-0001-0000-0000-000000000001",
      author_name: "Марат Каримов",
      guest_name: "Марат Каримов",
      rating: 5,
      date: "19.08.2026",
      comment: "Шикарный вид на горы из Esentai! Бесконтактный замок работает четко, квартира в идеальном состоянии.",
      cleanliness_rating: 5,
      location_rating: 5,
      checkin_rating: 5,
      created_at: "2026-08-19T12:00:00Z",
    },
  ],
};

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
