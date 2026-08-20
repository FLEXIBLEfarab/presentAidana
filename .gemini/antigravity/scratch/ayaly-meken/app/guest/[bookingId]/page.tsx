import { notFound } from "next/navigation";
import { getBookingById } from "@/actions/bookings";
import { GuestHubClient } from "./guest-hub-client";

interface GuestHubPageProps {
  params: { bookingId: string };
}

export async function generateMetadata({ params }: GuestHubPageProps) {
  return { title: `Консьерж · #${params.bookingId.slice(-6).toUpperCase()} — Ayaly Meken` };
}

export default async function GuestHubPage({ params }: GuestHubPageProps) {
  const result = await getBookingById(params.bookingId);
  if (!result.success || !result.data) notFound();
  return <GuestHubClient booking={result.data} />;
}
