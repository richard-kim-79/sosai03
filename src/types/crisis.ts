export interface CrisisContact {
  id: string;
  userId: string;
  name: string;
  contact: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrisisResponse {
  id: string;
  userId: string;
  message: string;
  riskLevel: 'LOW' | 'MID' | 'HIGH';
  status: 'pending' | 'resolved' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CrisisContactForm {
  name: string;
  contact: string;
  address?: string;
} 