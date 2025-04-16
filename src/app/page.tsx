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
    <main>
      <h1>SOS AI</h1>
    </main>
  );
}
