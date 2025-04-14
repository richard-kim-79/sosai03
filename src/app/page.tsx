'use client';

import { useEffect } from 'react';
import Image from "next/image";
import EmergencyPopup from '@/components/EmergencyPopup';
import ChatInterface from '@/components/ChatInterface';
import { useRiskStore } from '@/store/riskStore';

export default function Home() {
  const { riskLevel, setRiskLevel, setShowEmergencyPopup } = useRiskStore();

  useEffect(() => {
    // 위험 감지 로직 (예시)
    const checkRiskLevel = () => {
      // TODO: 실제 위험 감지 로직 구현
      if (riskLevel === 'HIGH') {
        setShowEmergencyPopup(true);
      }
    };

    checkRiskLevel();
  }, [riskLevel, setShowEmergencyPopup]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          익명 기반 위기 대응 AI 챗봇
        </h1>
        <ChatInterface />
      </div>
      <EmergencyPopup />
    </main>
  );
}
