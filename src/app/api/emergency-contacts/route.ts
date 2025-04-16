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

    const contacts = await prisma.emergencyContact.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: '비상 연락처 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, relationship } = body;

    const contact = await prisma.emergencyContact.create({
      data: {
        userId,
        name,
        phone,
        relationship,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { error: '비상 연락처 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 