import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface EmergencyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmergencyInfo) => void;
}

interface EmergencyInfo {
  name: string;
  contact: string;
  address?: string;
}

const EmergencyPopup: React.FC<EmergencyPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EmergencyInfo>({
    name: '',
    contact: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 이메일 알림 전송
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo: formData,
          adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        }),
      });

      if (!response.ok) {
        throw new Error('이메일 알림 전송에 실패했습니다.');
      }

      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('알림 전송 중 오류가 발생했습니다:', error);
      // 오류가 발생해도 사용자 정보는 저장
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>긴급 지원이 필요합니다</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름 또는 별명
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="이름 또는 별명을 입력해주세요"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact" className="text-sm font-medium">
              연락처
            </label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="전화번호 또는 이메일을 입력해주세요"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              주소 또는 학교 (선택)
            </label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="주소 또는 학교를 입력해주세요"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
              도움 요청하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyPopup; 