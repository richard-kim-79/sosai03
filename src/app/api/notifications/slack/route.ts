import { NextResponse } from 'next/server';
import { sendSlackMessage, createEmergencySlackMessage } from '@/lib/slack';

export async function POST(request: Request) {
  try {
    const { userInfo } = await request.json();

    if (!userInfo || !userInfo.name || !userInfo.contact) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const message = createEmergencySlackMessage(userInfo);
    const result = await sendSlackMessage(
      process.env.SLACK_CHANNEL_ID || '',
      message
    );

    if (!result.success) {
      console.error('Slack 메시지 전송 실패:', result.error);
      return NextResponse.json(
        { error: `Slack 메시지 전송에 실패했습니다: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Slack 알림 처리 중 오류가 발생했습니다:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 