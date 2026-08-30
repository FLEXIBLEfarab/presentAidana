import { notFound } from "next/navigation";
import { getApartmentById } from "@/actions/apartments";
import { getApartmentReviews } from "@/actions/reviews";
import { ApartmentDetailClient } from "./apartment-detail-client";

interface ApartmentPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ApartmentPageProps) {
  const result = await getApartmentById(params.id);
  if (!result.success || !result.data) {
    return { title: "Апартамент не найден — Ayaly Meken" };
  }
  return {
    title: `${result.data.name} — Ayaly Meken`,
    description: result.data.description,
  };
}

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const [aptResult, reviewsResult] = await Promise.all([
    getApartmentById(params.id),
    getApartmentReviews(params.id),
  ]);

  if (!aptResult.success || !aptResult.data) {
    notFound();
  }

  const apartment = aptResult.data;
  const reviews = reviewsResult.success && reviewsResult.data ? reviewsResult.data : [];

  return <ApartmentDetailClient apartment={apartment} reviews={reviews} />;
}
