import { NextResponse } from 'next/server';
import { getChannels } from '@/lib/slack';

export async function GET() {
  try {
    const result = await getChannels();

    if (!result.success) {
      return NextResponse.json(
        { error: `채널 목록 가져오기에 실패했습니다: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ channels: result.channels });
  } catch (error) {
    console.error('채널 목록 가져오기 중 오류가 발생했습니다:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 