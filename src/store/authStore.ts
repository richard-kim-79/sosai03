'use client';

import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterData, User } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const user = await response.json();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      const user = await response.json();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore; 