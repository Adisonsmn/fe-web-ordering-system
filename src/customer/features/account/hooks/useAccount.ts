import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@shared/stores/authStore';
import { getMyProfile, logoutUser, updateMyProfile, type UpdateProfilePayload } from '../api/account.api';

export const accountKeys = {
  profile: ['account', 'profile'] as const,
};

/** Fetch profil terkini dari server */
export const useMyProfile = () => {
  const isGuest = useAuthStore((s) => s.isGuest);
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: accountKeys.profile,
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, // 5 menit
    enabled: !!token && !isGuest,
    retry: 1,
  });
};

/** Mutation untuk update profil (nama, nomor hp, avatar) */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updatedProfile) => {
      // Invalidate cache profile agar data fresh
      queryClient.invalidateQueries({ queryKey: accountKeys.profile });

      // Sync authStore supaya tampilan di tempat lain langsung update
      if (currentUser) {
        setUser({
          ...currentUser,
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          avatarUrl: updatedProfile.avatarUrl,
        });
      }
    },
  });
};

/** Mutation untuk logout */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshToken, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    },
    onSuccess: () => {
      // Hapus semua cache query agar data user lama tidak tersisa
      queryClient.clear();
      clearAuth();
      navigate('/customer/welcome', { replace: true });
    },
    onError: () => {
      // Tetap logout lokal meskipun server gagal
      queryClient.clear();
      clearAuth();
      navigate('/customer/welcome', { replace: true });
    },
  });
};
