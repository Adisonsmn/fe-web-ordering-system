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
  setAuth: (
    token: string,
    refreshToken: string,
    user: UserProfile | null,
    isGuest: boolean,
  ) => void;
  setUser: (user: UserProfile | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isGuest: false,
      setAuth: (token, refreshToken, user, isGuest) =>
        set((state) => {
          state.token = token;
          state.refreshToken = refreshToken;
          state.user = user;
          state.isGuest = isGuest;
        }),
      setUser: (user) =>
        set((state) => {
          state.user = user;
        }),
      clearAuth: () =>
        set((state) => {
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.isGuest = false;
        }),
    })),
    {
      name: 'aroma-senja-auth',
    },
  ),
);
