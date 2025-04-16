import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 알림 데이터를 가져오는 함수
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const result = await response.json();
        setAlerts(result.data);
        setUnreadCount(result.data.filter((alert: Alert) => !alert.isRead).length);
      } catch (error) {
        console.error('알림 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    // 초기 데이터 로드
    fetchAlerts();

    // 10초마다 데이터 갱신
    const interval = setInterval(fetchAlerts, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/read`, {
        method: 'POST',
      });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error('알림을 읽음으로 표시하는데 실패했습니다:', error);
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold">알림</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                새로운 알림이 없습니다.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-b ${!alert.isRead ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getAlertColor(alert.type)}`}>
                        {alert.type === 'error' ? '에러' : alert.type === 'warning' ? '경고' : '정보'}
                      </span>
                      <p className="mt-2 text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        읽음
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSystem; 