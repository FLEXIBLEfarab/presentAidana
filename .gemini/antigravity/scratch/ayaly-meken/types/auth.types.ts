export interface GuestUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
}

export interface AuthState {
  user: GuestUser | null;
  isLoading: boolean;
}
