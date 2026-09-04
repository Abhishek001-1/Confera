import client from './client';
import type { User, AuthResponse } from '@/types';

export interface RegisterPayload { name: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }

export const authApi = {
  register: (data: RegisterPayload) =>
    client.post<AuthResponse>('/auth/register', data),

  login: (data: LoginPayload) =>
    client.post<AuthResponse>('/auth/login', data),

  logout: () =>
    client.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    client.post<AuthResponse>('/auth/refresh', { refreshToken }),

  me: () =>
    client.get<User>('/users/me'),
};
