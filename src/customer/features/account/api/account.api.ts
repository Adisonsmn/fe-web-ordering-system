import { apiClient } from '@shared/lib/axios';
import type { UserProfileResponse } from '@shared/types';

/** Ambil profil pengguna yang sedang login */
export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const data = await apiClient.get<unknown, UserProfileResponse>('/auth/me');
  return data;
};

/** Logout — revoke refresh token di server */
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout', { refreshToken });
};

export interface UpdateProfilePayload {
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

/** Update profil pengguna (name, phone, avatarUrl) */
export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfileResponse> => {
  const data = await apiClient.put<unknown, UserProfileResponse>('/auth/me', {
    name: payload.name,
    phone: payload.phone ?? null,
    avatarUrl: payload.avatarUrl ?? null,
  });
  return data;
};
