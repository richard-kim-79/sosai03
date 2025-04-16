import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonitoringData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  requestCount: number;
  errorRate: number;
}

const MonitoringDashboard: React.FC = () => {
  const [data, setData] = useState<MonitoringData[]>([]);

  useEffect(() => {
    // 모니터링 데이터를 가져오는 함수
    const fetchMonitoringData = async () => {
      try {
        const response = await fetch('/api/monitoring');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('모니터링 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    // 초기 데이터 로드
    fetchMonitoringData();

    // 5초마다 데이터 갱신
    const interval = setInterval(fetchMonitoringData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">시스템 모니터링 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU 사용률</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.length > 0 ? `${data[data.length - 1].cpuUsage}%` : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>메모리 사용률</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.length > 0 ? `${data[data.length - 1].memoryUsage}%` : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>초당 요청 수</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.length > 0 ? data[data.length - 1].requestCount : '0'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>에러율</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.length > 0 ? `${data[data.length - 1].errorRate}%` : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>CPU 및 메모리 사용률 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" name="CPU 사용률" />
                  <Line type="monotone" dataKey="memoryUsage" stroke="#82ca9d" name="메모리 사용률" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>요청 수 및 에러율 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requestCount" stroke="#ffc658" name="요청 수" />
                  <Line type="monotone" dataKey="errorRate" stroke="#ff7300" name="에러율" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitoringDashboard; 