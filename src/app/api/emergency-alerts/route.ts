import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const alerts = await prisma.emergencyAlert.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json(
      { error: '비상 알림 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, location } = body;

    const alert = await prisma.emergencyAlert.create({
      data: {
        userId,
        location,
        status: 'pending',
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: '비상 알림 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const alert = await prisma.emergencyAlert.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: '비상 알림 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
} 