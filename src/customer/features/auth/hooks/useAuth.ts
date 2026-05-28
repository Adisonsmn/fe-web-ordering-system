import { useAuthStore } from '@shared/stores/authStore';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@shared/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth.api';

// Error response interface based on backend standard
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Data is already unwrapped by axios interceptor, so it's a LoginResponse
      const { accessToken, refreshToken, user } = data;

      if (user) {
        // Map UserProfileResponse to authStore UserProfile format, including isGuest which is false for regular login
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

      // Navigate to catalog on success
      navigate('/customer/katalog');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, ApiError, RegisterRequest>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Data is already unwrapped by axios interceptor, so it's a LoginResponse
      const { accessToken, refreshToken, user } = data;

      if (user) {
        // Map UserProfileResponse to authStore UserProfile format, including isGuest which is false for regular login
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

      // Navigate to catalog on success
      navigate('/customer/katalog');
    },
  });
};
