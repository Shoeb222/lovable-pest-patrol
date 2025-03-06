
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
