import { useAuthStore } from '@shared/stores/authStore';
import type { LoginRequest, LoginResponse } from '@shared/types';
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

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: async (payload: LoginRequest) => {
      const data = await loginAdmin(payload);
      if (data.user && data.user.role !== 'ADMIN') {
        throw new Error('Anda tidak memiliki akses sebagai Admin');
      }
      return data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data;

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
        );
      }

      // Navigate to dashboard on success
      navigate('/dashboard');
    },
  });
};
