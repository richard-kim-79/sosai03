import { NextResponse } from 'next/server';
import { sendDiscordMessage, createEmergencyDiscordMessage } from '@/lib/discord';

export async function POST(request: Request) {
  try {
    const { userInfo } = await request.json();

    if (!userInfo || !userInfo.name || !userInfo.contact) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const message = createEmergencyDiscordMessage(userInfo);
    const result = await sendDiscordMessage(
      process.env.DISCORD_CHANNEL_ID || '',
      message
    );

    if (!result.success) {
      return NextResponse.json(
        { error: 'Discord 메시지 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discord 알림 처리 중 오류가 발생했습니다:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 