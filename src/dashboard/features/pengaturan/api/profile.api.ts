import { apiClient } from '@shared/lib/axios';
import type { UserProfileResponse } from '@shared/types/auth.types';

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export const getAdminProfile = async (): Promise<UserProfileResponse> => {
  const data = await apiClient.get<unknown, UserProfileResponse>('/auth/me');
  return data;
};

export const updateAdminProfile = async (
  request: UpdateProfileRequest,
): Promise<UserProfileResponse> => {
  const data = await apiClient.put<unknown, UserProfileResponse>('/auth/me', request);
  return data;
};

export const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
  await apiClient.patch('/auth/me/password', request);
};
