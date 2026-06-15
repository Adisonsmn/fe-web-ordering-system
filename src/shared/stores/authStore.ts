import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'ADMIN' | 'CLIENT';
  statusMember: 'REGULAR' | 'PREMIUM' | null;
  totalPoint: number | null;
  avatarUrl: string | null;
  createdAt: string;
  isGuest: boolean;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isGuest: boolean;
  /** Timestamp Unix (ms) kapan sesi berakhir. null = tidak ada expiry */
  loginExpiresAt: number | null;
  isSessionInvalidated: boolean;
  setAuth: (
    token: string,
    refreshToken: string,
    user: UserProfile | null,
    isGuest: boolean,
    loginExpiresAt?: number,
  ) => void;
  setUser: (user: UserProfile | null) => void;
  setSessionInvalidated: (val: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isGuest: false,
      loginExpiresAt: null,
      isSessionInvalidated: false,
      setAuth: (token, refreshToken, user, isGuest, loginExpiresAt) =>
        set((state) => {
          state.token = token;
          state.refreshToken = refreshToken;
          state.user = user;
          state.isGuest = isGuest;
          // Hanya update loginExpiresAt jika eksplisit diberikan (login baru).
          // Saat dipanggil dari refresh token flow (tanpa arg ke-5),
          // nilai lama dipertahankan agar expiry tidak berubah.
          if (loginExpiresAt !== undefined) {
            state.loginExpiresAt = loginExpiresAt;
          }
          // Reset status invalidasi jika sukses login/refresh baru
          state.isSessionInvalidated = false;
        }),
      setUser: (user) =>
        set((state) => {
          state.user = user;
        }),
      setSessionInvalidated: (val) =>
        set((state) => {
          state.isSessionInvalidated = val;
        }),
      clearAuth: () =>
        set((state) => {
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.isGuest = false;
          state.loginExpiresAt = null;
          state.isSessionInvalidated = false;
        }),
    })),
    {
      name: 'aroma-senja-auth',
    },
  ),
);
