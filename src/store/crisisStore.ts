'use client';

import { create } from 'zustand';
import { CrisisContact, CrisisContactForm, CrisisResponse } from '@/types/crisis';

interface CrisisStore {
  contact: CrisisContact | null;
  responses: CrisisResponse[];
  isLoading: boolean;
  error: string | null;
  setContact: (contact: CrisisContact | null) => void;
  setResponses: (responses: CrisisResponse[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  submitContact: (form: CrisisContactForm) => Promise<void>;
  submitResponse: (message: string) => Promise<void>;
  fetchResponses: () => Promise<void>;
}

const useCrisisStore = create<CrisisStore>((set) => ({
  contact: null,
  responses: [],
  isLoading: false,
  error: null,

  setContact: (contact) => set({ contact }),
  setResponses: (responses) => set({ responses }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  submitContact: async (form) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/crisis/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('연락처 정보 제출에 실패했습니다.');
      }

      const contact = await response.json();
      set({ contact });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  submitResponse: async (message) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/crisis/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('응답 제출에 실패했습니다.');
      }

      const newResponse = await response.json();
      set((state) => ({
        responses: [...state.responses, newResponse],
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResponses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/crisis/responses');
      if (!response.ok) {
        throw new Error('응답 목록을 불러오는데 실패했습니다.');
      }
      const responses = await response.json();
      set({ responses });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCrisisStore; 