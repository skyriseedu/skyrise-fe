import axios from 'axios';
import { showErrorNotification } from '../errorNotification';

const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? '/api/v1'
    : import.meta.env.VITE_API_BASE_URL || 'https://be.skyriseedu.com/api/v1';

// axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000, // need to change back to 10000 - 10ms later
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skyrise_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API called successfully:', response);

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 429 errors (Too Many Requests)
    if (error.response?.status === 429) {
      showErrorNotification(
        'Too Many Requests',
        'You have made too many requests. Please try again later.'
      );
      return Promise.reject(error);
    }

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('skyrise_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;
            localStorage.setItem('skyrise_access_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('skyrise_refresh_token', newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('skyrise_access_token');
        localStorage.removeItem('skyrise_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }

      localStorage.removeItem('skyrise_access_token');
      localStorage.removeItem('skyrise_refresh_token');
      window.location.href = '/login';
    }

    const message =
      error.response?.data?.message || error.message || 'An error occurred';
    console.error(
      `${error.response?.status || 'Network Error'} ${error.config?.url}:`,
      message
    );
    throw new Error(message);
  }
);

export default apiClient;
