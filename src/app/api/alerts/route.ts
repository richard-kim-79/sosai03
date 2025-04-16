import { NextResponse } from 'next/server';

// 알림 데이터를 저장할 배열
let alerts: any[] = [];

// 알림 생성 함수
function createAlert(type: 'error' | 'warning' | 'info', message: string) {
  const newAlert = {
    id: Date.now().toString(),
    type,
    message,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  alerts.push(newAlert);
  return newAlert;
}

// 시스템 상태를 모니터링하고 알림 생성
function monitorSystem() {
  const cpuUsage = Math.random() * 100;
  const memoryUsage = Math.random() * 100;
  const errorRate = Math.random() * 5;

  if (cpuUsage > 80) {
    createAlert('warning', `CPU 사용률이 높습니다: ${Math.round(cpuUsage)}%`);
  }

  if (memoryUsage > 80) {
    createAlert('warning', `메모리 사용률이 높습니다: ${Math.round(memoryUsage)}%`);
  }

  if (errorRate > 3) {
    createAlert('error', `에러율이 높습니다: ${Math.round(errorRate * 100) / 100}%`);
  }
}

// 5초마다 시스템 모니터링
setInterval(monitorSystem, 5000);

export async function GET() {
  try {
    // 최근 50개의 알림만 반환
    const recentAlerts = alerts.slice(-50).reverse();
    
    return NextResponse.json({
      success: true,
      data: recentAlerts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '알림 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { type, message } = await request.json();
    
    if (!type || !message) {
      return NextResponse.json(
        { success: false, error: '알림 타입과 메시지는 필수입니다.' },
        { status: 400 }
      );
    }

    const newAlert = createAlert(type, message);
    
    return NextResponse.json({
      success: true,
      data: newAlert,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '알림을 생성하는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 