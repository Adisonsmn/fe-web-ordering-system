import { apiClient } from '@shared/lib/axios';
import type { LoginRequest, LoginResponse } from '@shared/types';

export const loginAdmin = async (payload: LoginRequest): Promise<LoginResponse> => {
  const data = await apiClient.post<unknown, LoginResponse>('/auth/login', payload);
  return data;
};
