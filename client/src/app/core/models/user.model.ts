export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
