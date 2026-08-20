export interface GuestUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: GuestUser | null;
  isLoading: boolean;
}
