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
    const { token, loginExpiresAt, setSessionInvalidated } = useAuthStore.getState();

    // Cek apakah sesi sudah kedaluwarsa sebelum kirim request
    if (loginExpiresAt !== null && Date.now() > loginExpiresAt) {
      setSessionInvalidated(true);
      return Promise.reject(new Error('Sesi telah berakhir. Silakan login kembali.'));
    }

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
      // Jika sudah ada proses refresh yang berjalan, tambahkan ke antrian
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

      // Jika tidak ada refresh token (misal guest atau belum login), jangan paksa logout
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        // Hanya clear auth jika memang ada token di store (bukan request anonim)
        const currentToken = useAuthStore.getState().token;
        if (currentToken) {
          useAuthStore.getState().setSessionInvalidated(true);
        }
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

        if (newToken) {
          // Refresh berhasil — update store dengan data baru
          useAuthStore.getState().setAuth(
            newToken,
            newRefreshToken ?? refreshToken, // Gunakan refresh token lama jika tidak ada yang baru
            user ?? useAuthStore.getState().user, // Pertahankan user lama jika tidak ada user baru
            useAuthStore.getState().isGuest,
          );
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }

        throw new Error('Refresh token response structure is invalid');
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Set invalid state instead of clearing immediately!
        useAuthStore.getState().setSessionInvalidated(true);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
