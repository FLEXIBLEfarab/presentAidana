import { notFound } from "next/navigation";
import { getBookingById } from "@/actions/bookings";
import { BookingPassClient } from "./booking-pass-client";

interface BookingPassPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookingPassPageProps) {
  return {
    title: `Digital Pass #${params.id.slice(-6).toUpperCase()} — Ayaly Meken`,
  };
}

export default async function BookingPassPage({ params }: BookingPassPageProps) {
  const result = await getBookingById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <BookingPassClient booking={result.data} />;
}
