export interface GuestUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  avatar_url?: string;
  promocodes?: string[];
  bonus_balance?: number;
  created_at: string;
}

export interface AuthState {
  user: GuestUser | null;
  isLoading: boolean;
}
