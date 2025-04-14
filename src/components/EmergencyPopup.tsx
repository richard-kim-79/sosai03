import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useRiskStore } from '@/store/riskStore';
import { UserInfo } from '@/types/risk';

export default function EmergencyPopup() {
  const { showEmergencyPopup, setShowEmergencyPopup, setUserInfo } = useRiskStore();
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    contact: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfo(formData);
    setShowEmergencyPopup(false);
    // TODO: 서버로 데이터 전송
  };

  return (
    <Dialog
      open={showEmergencyPopup}
      onClose={() => setShowEmergencyPopup(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            긴급 연락처 정보
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름 또는 별명
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                연락처 (전화번호/이메일)
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                주소/학교 (선택)
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                제출하기
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 