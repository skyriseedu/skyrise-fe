import apiClient from '../client';
import axios from 'axios';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const apiBaseUrl =
      import.meta.env.MODE === 'development'
        ? '/api/v1'
        : import.meta.env.VITE_API_BASE_URL ||
          'https://be.skyriseedu.com/api/v1';

    const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {
      refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
