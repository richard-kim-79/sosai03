import { create } from 'zustand';
import { RiskLevel, RiskAssessment, UserInfo } from '@/types/risk';

interface RiskState {
  riskLevel: RiskLevel;
  assessment: RiskAssessment | null;
  userInfo: UserInfo | null;
  showEmergencyPopup: boolean;
  setRiskLevel: (level: RiskLevel) => void;
  setAssessment: (assessment: RiskAssessment) => void;
  setUserInfo: (info: UserInfo) => void;
  setShowEmergencyPopup: (show: boolean) => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  riskLevel: 'LOW',
  assessment: null,
  userInfo: null,
  showEmergencyPopup: false,
  setRiskLevel: (level) => set({ riskLevel: level }),
  setAssessment: (assessment) => set({ assessment }),
  setUserInfo: (info) => set({ userInfo: info }),
  setShowEmergencyPopup: (show) => set({ showEmergencyPopup: show }),
})); 