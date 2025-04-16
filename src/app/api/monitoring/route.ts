import { NextResponse } from 'next/server';
import os from 'os';

// 모니터링 데이터를 저장할 배열
let monitoringData: any[] = [];

// 시스템 리소스 사용량을 가져오는 함수
function getSystemMetrics() {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  // CPU 사용률 계산
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    const idle = cpu.times.idle;
    return acc + (1 - idle / total);
  }, 0) / cpus.length * 100;

  // 메모리 사용률 계산
  const memoryUsage = (usedMemory / totalMemory) * 100;

  return {
    cpuUsage: Math.round(cpuUsage * 100) / 100,
    memoryUsage: Math.round(memoryUsage * 100) / 100,
  };
}

// 요청 카운터
let requestCount = 0;
let errorCount = 0;

export async function GET() {
  try {
    requestCount++;
    
    // 시스템 메트릭스 가져오기
    const systemMetrics = getSystemMetrics();
    
    // 현재 시간
    const timestamp = new Date().toISOString();
    
    // 에러율 계산 (임의의 값으로 설정)
    const errorRate = Math.random() * 5;
    if (errorRate > 3) {
      errorCount++;
    }
    
    // 새로운 모니터링 데이터 추가
    const newData = {
      timestamp,
      ...systemMetrics,
      requestCount,
      errorRate: Math.round(errorRate * 100) / 100,
    };
    
    monitoringData.push(newData);
    
    // 최근 100개의 데이터만 유지
    if (monitoringData.length > 100) {
      monitoringData = monitoringData.slice(-100);
    }
    
    return NextResponse.json({
      success: true,
      data: monitoringData,
    });
  } catch (error) {
    errorCount++;
    return NextResponse.json(
      { success: false, error: '모니터링 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 