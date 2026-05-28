import { useAuthStore } from '@shared/stores/authStore';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

// Response Interceptor: Unwrap ApiResponse.data & auto-refresh token on 401
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  }
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse.data
    return response.data?.data ?? response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized & trigger refresh flow
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Panggil refresh endpoint menggunakan instance axios mentah
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const apiResponse = response.data;
        const data = apiResponse?.data;
        const newToken = data?.token ?? data?.accessToken;
        const newRefreshToken = data?.refreshToken;
        const user = data?.user;

        if (newToken && newRefreshToken && user) {
          useAuthStore.getState().setAuth(newToken, newRefreshToken, user, user.isGuest);
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }

        throw new Error('Refresh token response structure is invalid');
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
