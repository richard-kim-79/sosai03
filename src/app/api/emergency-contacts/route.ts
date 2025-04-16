import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emergencyContactSchema } from '@/lib/validations';
import { z } from 'zod';

/**
 * @swagger
 * /api/emergency-contacts:
 *   get:
 *     summary: 특정 사용자의 비상 연락처 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 비상 연락처 목록 조회 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /api/emergency-contacts:
 *   post:
 *     summary: 새로운 비상 연락처를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *               - phone
 *               - relationship
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *                 pattern: ^01[0-9]{1}-[0-9]{3,4}-[0-9]{4}$
 *               relationship:
 *                 type: string
 *     responses:
 *       201:
 *         description: 비상 연락처 생성 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
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