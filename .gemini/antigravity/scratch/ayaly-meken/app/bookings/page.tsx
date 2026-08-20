import { BookingsClient } from "./bookings-client";
import { getBookings } from "@/actions/bookings";

export const metadata = {
  title: "Мои поездки — Ayaly Meken",
  description: "Управляйте бронированиями, смотрите цифровые ПИН-коды и данные для Wi-Fi.",
};

export default async function BookingsPage() {
  const result = await getBookings();
  const initialBookings = result.data || [];

  return <BookingsClient initialBookings={initialBookings} />;
}
