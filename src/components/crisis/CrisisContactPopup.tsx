'use client';

import { useState } from 'react';
import useCrisisStore from '@/store/crisisStore';
import { CrisisContactForm } from '@/types/crisis';

interface CrisisContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisContactPopup({ isOpen, onClose }: CrisisContactPopupProps) {
  const { submitContact, isLoading, error } = useCrisisStore();
  const [form, setForm] = useState<CrisisContactForm>({
    name: '',
    contact: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">연락처 정보 입력</h2>
        <p className="text-sm text-gray-600 mb-4">
          위기 상황에 대응하기 위해 연락처 정보가 필요합니다. 
          입력하신 정보는 암호화되어 안전하게 보관됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름 또는 별명
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              연락처 (전화번호 또는 이메일)
            </label>
            <input
              type="text"
              id="contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              주소 또는 학교 (선택사항)
            </label>
            <input
              type="text"
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '제출 중...' : '제출'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 