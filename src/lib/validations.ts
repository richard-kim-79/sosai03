import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  name: z.string().min(1, '이름을 입력해주세요.').optional(),
});

export const emergencyContactSchema = z.object({
  userId: z.string().min(1, '사용자 ID가 필요합니다.'),
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.string().regex(/^01[0-9]{1}-[0-9]{3,4}-[0-9]{4}$/, '유효한 전화번호를 입력해주세요.'),
  relationship: z.string().min(1, '관계를 입력해주세요.'),
});

export const emergencyAlertSchema = z.object({
  userId: z.string().min(1, '사용자 ID가 필요합니다.'),
  location: z.string().min(1, '위치를 입력해주세요.').optional(),
});

export const emergencyAlertUpdateSchema = z.object({
  id: z.string().min(1, '알림 ID가 필요합니다.'),
  status: z.enum(['pending', 'resolved', 'cancelled'], {
    errorMap: () => ({ message: '유효하지 않은 상태입니다.' }),
  }),
}); 