import { useAuthStore } from '@shared/stores/authStore';
import type { LoginResponse } from '@shared/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/auth.api';

// Error response interface based on backend standard
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Extend LoginRequest lokal dengan rememberMe
interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, ApiError, AdminLoginRequest>({
    mutationFn: async (payload: AdminLoginRequest) => {
      const data = await loginAdmin({ email: payload.email, password: payload.password });
      if (data.user && data.user.role !== 'ADMIN') {
        throw new Error('Anda tidak memiliki akses sebagai Admin');
      }
      return data;
    },
    onSuccess: (data, variables) => {
      const { accessToken, refreshToken, user } = data;

      // Hitung kapan sesi berakhir berdasarkan pilihan "Ingat perangkat ini"
      const loginExpiresAt = variables.rememberMe
        ? Date.now() + SEVEN_DAYS_MS  // 7 hari jika diingat
        : Date.now() + TWO_HOURS_MS;  // 2 jam jika tidak diingat

      if (user) {
        setAuth(
          accessToken,
          refreshToken || '',
          {
            id: user.userId,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            statusMember: user.statusMember,
            totalPoint: user.totalPoint,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            isGuest: false,
          },
          false,
          loginExpiresAt,
        );
      }

      // Navigate to dashboard on success
      navigate('/dashboard');
    },
  });
};
