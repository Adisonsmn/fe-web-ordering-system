import { apiClient } from '@shared/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@shared/types';

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const data = await apiClient.post<unknown, LoginResponse>('/auth/login', payload);
  return data;
};

export const registerUser = async (payload: RegisterRequest): Promise<LoginResponse> => {
  const data = await apiClient.post<unknown, LoginResponse>('/auth/register', payload);
  return data;
};
