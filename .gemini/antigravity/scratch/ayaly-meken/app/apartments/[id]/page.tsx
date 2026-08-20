import { notFound } from "next/navigation";
import { getApartmentById } from "@/actions/apartments";
import { MOCK_REVIEWS } from "@/lib/mock-data";
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
  const result = await getApartmentById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const apartment = result.data;
  const reviews = MOCK_REVIEWS[apartment.id] || [
    {
      id: "rev-default-1",
      apartment_id: apartment.id,
      author_name: "Айжан М.",
      author_city: "Алматы",
      rating: 5,
      date: "Август 2026",
      comment: "Безупречно чисто, уютно и современно. Бесконтактный заезд с пин-кодом — это удобно и безопасно. Обязательно вернусь!",
    },
    {
      id: "rev-default-2",
      apartment_id: apartment.id,
      author_name: "Тимур С.",
      author_city: "Астана",
      rating: 5,
      date: "Июль 2026",
      comment: "Удобная кровать, быстрый интернет для работы и потрясающий вид. Рекомендую всем коллегам в командировках.",
    },
  ];

  return <ApartmentDetailClient apartment={apartment} reviews={reviews} />;
}
