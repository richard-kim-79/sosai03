import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        emergencyContacts: true,
        emergencyAlerts: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: '사용자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: '사용자 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 