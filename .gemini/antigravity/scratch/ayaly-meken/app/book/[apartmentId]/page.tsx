import { notFound } from "next/navigation";
import { format, addDays } from "date-fns";
import { getApartmentById } from "@/actions/apartments";
import { BookingClient } from "./booking-client";

interface BookPageProps {
  params: {
    apartmentId: string;
  };
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export async function generateMetadata({ params }: BookPageProps) {
  const res = await getApartmentById(params.apartmentId);
  return {
    title: `Book ${res.data?.name || "Stay"} — Ayaly Meken`,
  };
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const result = await getApartmentById(params.apartmentId);

  if (!result.success || !result.data) {
    notFound();
  }

  const today = new Date();
  const defaultCheckIn = format(addDays(today, 1), "yyyy-MM-dd");
  const defaultCheckOut = format(addDays(today, 4), "yyyy-MM-dd");

  const checkIn = searchParams.checkIn || defaultCheckIn;
  const checkOut = searchParams.checkOut || defaultCheckOut;
  const guests = searchParams.guests ? Math.max(1, Number(searchParams.guests)) : 2;

  return (
    <BookingClient
      apartment={result.data}
      checkIn={checkIn}
      checkOut={checkOut}
      guests={guests}
    />
  );
}
