import axios, { AxiosError } from 'axios';
import { describe, test, expect, vi } from 'vitest';

// API 호출 실패 시나리오 테스트
describe('API 실패 시나리오', () => {
  test('잘못된 URL로 API 호출 시 404 에러 발생', async () => {
    try {
      await axios.get('http://localhost:3000/api/nonexistent');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(404);
    }
  });

  test('잘못된 요청 데이터로 API 호출 시 400 에러 발생', async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/login', {
        email: 'invalid-email',
        password: '123'
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(400);
    }
  });

  test('인증되지 않은 사용자가 보호된 API 호출 시 401 에러 발생', async () => {
    try {
      await axios.get('http://localhost:3000/api/protected', {
        headers: {
          Authorization: 'Bearer invalid-token'
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(401);
    }
  });

  test('서버 에러 발생 시 500 에러 처리', async () => {
    const mockAxios = vi.spyOn(axios, 'get');
    mockAxios.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      }
    });

    try {
      await axios.get('http://localhost:3000/api/error');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(500);
      expect(axiosError.response?.data).toEqual({ message: 'Internal Server Error' });
    }

    mockAxios.mockRestore();
  });

  test('필수 데이터 누락 시 400 에러 발생', async () => {
    try {
      await axios.post('http://localhost:3000/api/encrypt', {});
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(400);
    }
  });
}); 