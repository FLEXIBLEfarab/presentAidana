/**
 * Ayaly Meken — Extended Database Types
 * Aligned with Altyn Qonaq PMS Supabase schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ApartmentStatus = 'active' | 'maintenance' | 'archived';

export type ChannelSource =
  | 'airbnb'
  | 'booking'
  | 'sutochno'
  | 'ostrovok'
  | 'krisha'
  | 'olx'
  | 'direct'
  | 'other';

export type PaymentMethod =
  | 'kaspi_qr'
  | 'kaspi_transfer'
  | 'cash'
  | 'card_online'
  | 'platform_collected';

export type BookingStatus =
  | 'pending'
  | 'pending_payment'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled';

export type DepositStatus = 'pending' | 'received' | 'refunded' | 'retained';

export type ServiceRequestType =
  | 'extra_cleaning'
  | 'extra_linen'
  | 'late_checkout'
  | 'issue_report'
  | 'other';

export type ServiceRequestStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'declined';

export interface Apartment {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  city?: string;
  district?: string;
  lat?: number;
  lng?: number;
  rooms_count: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  floor?: number | string;
  area_sqm?: number;
  max_guests?: number;
  base_night_price: number;
  rent_price_to_owner: number;
  owner_payment_day: number;
  ttlock_lock_id: string | null;
  default_cleaner_id?: string | null;
  wifi_name?: string;
  wifi_password?: string;
  intercom_code?: string;
  weekend_surge_percent?: number;
  weekend_surge_enabled?: boolean;
  holiday_surge_percent?: number;
  holiday_surge_enabled?: boolean;
  long_stay_discounts_enabled?: boolean;
  deposit_default?: number;
  check_in_time?: string;
  check_out_time?: string;
  amenities?: string[];
  cover_image?: string;
  images?: string[];
  rating?: number;
  reviews_count?: number;
  description?: string;
  house_rules?: string[];
  nearby_landmarks?: string[];
  property_type?: 'studio' | 'apartment' | 'penthouse' | 'villa';
  status: ApartmentStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  organization_id: string;
  apartment_id: string;
  source: ChannelSource;
  external_uid: string | null;
  guest_name: string;
  guest_phone: string | null;
  guest_email?: string | null;
  check_in_date: string;   // 'YYYY-MM-DD'
  check_out_date: string;  // 'YYYY-MM-DD'
  guests_count?: number;
  total_price: number;
  nightly_price?: number;
  cleaning_fee?: number;
  service_fee?: number;
  discount_amount?: number;
  deposit_amount?: number;
  platform_commission: number;
  payment_method: PaymentMethod;
  is_fiscalized: boolean;
  status: BookingStatus;
  door_pin_code: string | null;
  ttlock_passcode?: string | null;
  ttlock_passcode_id?: number | null;
  deposit_status?: DepositStatus;
  deposit_notes?: string | null;
  is_checked_in_online?: boolean;
  guest_id_photos?: string[];
  signature_url?: string | null;
  checked_in_at?: string | null;
  notes: string | null;
  created_at: string;
  apartment?: Apartment;
}

export interface ServiceRequest {
  id: string;
  booking_id: string;
  apartment_id: string;
  organization_id: string;
  type: ServiceRequestType;
  status: ServiceRequestStatus;
  guest_notes?: string;
  photo_urls?: string[];
  price?: number;
  scheduled_for?: string;
  created_at: string;
}

export interface Review {
  id: string;
  apartment_id: string;
  booking_id?: string | null;
  author_name: string;
  guest_name?: string;
  author_avatar?: string;
  author_city?: string;
  rating: number;
  date?: string;
  created_at?: string;
  comment: string;
  cleanliness_rating?: number;
  location_rating?: number;
  checkin_rating?: number;
}

export interface SearchFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  amenities?: string[];
  sortBy?: SortOption;
  searchQuery?: string;
}

export type SortOption =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc';

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
