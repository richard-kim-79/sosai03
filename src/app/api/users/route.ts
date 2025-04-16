import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userSchema } from '@/lib/validations';
import { z } from 'zod';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 목록을 조회합니다.
 *     description: 사용자와 관련된 비상 연락처 및 알림 정보를 포함하여 반환합니다.
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *       500:
 *         description: 서버 오류
 */
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
    console.error('사용자 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '사용자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 새로운 사용자를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *       400:
 *         description: 잘못된 요청
 *       409:
 *         description: 이메일 중복
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일 주소입니다.' },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: validatedData,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('사용자 생성 중 오류 발생:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '사용자 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 