export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserProfileResponse {
  userId: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'ADMIN' | 'CLIENT';
  statusMember: 'REGULAR' | 'PREMIUM' | null;
  totalPoint: number | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresIn: number;
  user: UserProfileResponse | null;
}
