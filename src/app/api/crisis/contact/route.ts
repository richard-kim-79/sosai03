import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { encrypt } from '@/lib/encryption';

const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  contact: z.string().min(1, '연락처를 입력하세요.'),
  address: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // 데이터 암호화
    const encryptedData = {
      name: encrypt(validatedData.name),
      contact: encrypt(validatedData.contact),
      address: validatedData.address ? encrypt(validatedData.address) : null,
    };

    // 연락처 정보 저장
    const contact = await prisma.crisisContact.create({
      data: {
        ...encryptedData,
        userId: 'anonymous', // TODO: 실제 사용자 ID로 교체
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    console.error('연락처 정보 저장 중 오류 발생:', error);
    return NextResponse.json(
      { error: '연락처 정보 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
} 