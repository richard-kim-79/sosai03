import { NextResponse } from 'next/server';
import { sendEmail, createEmergencyEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { userInfo, adminEmail } = await request.json();

    if (!userInfo || !adminEmail) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 위험 상황 알림 이메일 생성
    const emailContent = createEmergencyEmail(userInfo);

    // 관리자에게 이메일 전송
    const result = await sendEmail({
      to: adminEmail,
      ...emailContent,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '이메일이 성공적으로 전송되었습니다.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 