export type RiskLevel = 'LOW' | 'MID' | 'HIGH';

export interface UserInfo {
  name: string;
  contact: string;
  address?: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  keywords: string[];
  timestamp: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
} 