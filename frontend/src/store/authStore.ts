import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login({ email, password });
          const token = data.accessToken || data.tokens?.accessToken;
          const refresh = data.refreshToken || data.tokens?.refreshToken || token;
          if (token) localStorage.setItem('accessToken', token);
          if (refresh) localStorage.setItem('refreshToken', refresh);
          set({ user: data.user, accessToken: token || null });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.register({ name, email, password });
          const token = data.accessToken || data.tokens?.accessToken;
          const refresh = data.refreshToken || data.tokens?.refreshToken || token;
          if (token) localStorage.setItem('accessToken', token);
          if (refresh) localStorage.setItem('refreshToken', refresh);
          set({ user: data.user, accessToken: token || null });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* noop */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null });
      },

      fetchMe: async () => {
        try {
          const { data } = await authApi.me();
          set({ user: data });
        } catch {
          set({ user: null, accessToken: null });
        }
      },
    }),
    {
      name: 'confera-auth',
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
    }
  )
);
