import { NextResponse } from 'next/server';

// 알림 데이터를 저장할 배열 (전역 변수로 선언)
declare global {
  var alerts: any[];
}

if (!global.alerts) {
  global.alerts = [];
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = params.id;
    
    // 알림 찾기
    const alertIndex = global.alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex === -1) {
      return NextResponse.json(
        { success: false, error: '알림을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 알림을 읽음으로 표시
    global.alerts[alertIndex] = {
      ...global.alerts[alertIndex],
      isRead: true,
    };
    
    return NextResponse.json({
      success: true,
      data: global.alerts[alertIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '알림을 읽음으로 표시하는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 