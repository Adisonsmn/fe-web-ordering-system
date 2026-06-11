import { useAuthStore } from '@shared/stores/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ChangePasswordRequest,
  changePassword,
  getAdminProfile,
  type UpdateProfileRequest,
  updateAdminProfile,
} from '../api/profile.api';

export const adminProfileKeys = {
  all: ['adminProfile'] as const,
};

export const useAdminProfile = () => {
  return useQuery({
    queryKey: adminProfileKeys.all,
    queryFn: getAdminProfile,
    staleTime: 1000 * 60 * 15, // Profil jarang berubah, stale time 15 menit
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => {
      console.log('[useUpdateAdminProfile] Updating profile with:', request);
      return updateAdminProfile(request);
    },
    onSuccess: (data) => {
      console.log('[useUpdateAdminProfile] Success:', data);
      queryClient.invalidateQueries({ queryKey: adminProfileKeys.all });

      // Sinkronkan ke authStore agar navbar terupdate
      const setUser = useAuthStore.getState().setUser;
      setUser({
        id: data.userId,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        statusMember: data.statusMember,
        totalPoint: data.totalPoint,
        avatarUrl: data.avatarUrl,
        createdAt: data.createdAt,
        isGuest: false,
      });
    },
    onError: (error) => {
      console.error('[useUpdateAdminProfile] Error:', error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => {
      console.log('[useChangePassword] Changing password');
      return changePassword(request);
    },
    onSuccess: () => {
      console.log('[useChangePassword] Password successfully changed');
    },
    onError: (error) => {
      console.error('[useChangePassword] Error changing password:', error);
    },
  });
};
