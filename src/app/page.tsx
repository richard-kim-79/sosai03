'use client';

import { useState } from 'react';
import EmergencyAlertForm from '@/components/EmergencyAlertForm';
import EmergencyContacts from '@/components/EmergencyContacts';
import AlertList from '@/components/AlertList';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'alert' | 'contacts' | 'history'>('alert');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">SOSAI - 비상 상황 알림 시스템</h1>
      
      <div className="flex justify-center mb-8">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'alert' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('alert')}
          >
            비상 신고
          </button>
          <button
            className={`tab ${activeTab === 'contacts' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            연락처 관리
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            알림 내역
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'alert' && <EmergencyAlertForm />}
        {activeTab === 'contacts' && <EmergencyContacts />}
        {activeTab === 'history' && <AlertList />}
      </div>
    </div>
  );
}
