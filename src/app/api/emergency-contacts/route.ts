import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emergencyContactSchema } from '@/lib/validations';
import { z } from 'zod';

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    const contacts = await prisma.emergencyContact.findMany({
      where: { userId },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('비상 연락처 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '비상 연락처 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = emergencyContactSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    const contact = await prisma.emergencyContact.create({
      data: validatedData,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('비상 연락처 생성 중 오류 발생:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '비상 연락처 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 