import { useState } from 'react';
import { z } from 'zod';

const emergencyInfoSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  contact: z.string().min(1, '연락처를 입력해주세요'),
  address: z.string().optional(),
});

type EmergencyInfo = z.infer<typeof emergencyInfoSchema>;

interface EmergencyInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: EmergencyInfo) => void;
}

export default function EmergencyInfoPopup({ isOpen, onClose, onSubmit }: EmergencyInfoPopupProps) {
  const [formData, setFormData] = useState<EmergencyInfo>({
    name: '',
    contact: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EmergencyInfo, string>>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = emergencyInfoSchema.parse(formData);
      onSubmit(validatedData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof EmergencyInfo, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof EmergencyInfo] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">긴급 연락처 정보</h2>
        <p className="text-gray-600 mb-4">
          위기 상황에 대응하기 위해 아래 정보를 입력해주세요. 모든 정보는 암호화되어 안전하게 보관됩니다.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">이름 또는 별명</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="이름을 입력해주세요"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">연락처</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="전화번호 또는 이메일"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">주소 또는 학교 (선택)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="주소 또는 학교를 입력해주세요"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 