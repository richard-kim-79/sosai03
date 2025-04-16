import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emergencyAlertSchema, emergencyAlertUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

/**
 * @swagger
 * /api/emergency-alerts:
 *   get:
 *     summary: 특정 사용자의 비상 알림 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 비상 알림 목록 조회 성공
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

    const alerts = await prisma.emergencyAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('비상 알림 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '비상 알림 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/emergency-alerts:
 *   post:
 *     summary: 새로운 비상 알림을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: 비상 알림 생성 성공
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
    const validatedData = emergencyAlertSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    const alert = await prisma.emergencyAlert.create({
      data: {
        ...validatedData,
        status: 'pending',
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('비상 알림 생성 중 오류 발생:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '비상 알림 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/emergency-alerts:
 *   patch:
 *     summary: 비상 알림의 상태를 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, resolved, cancelled]
 *     responses:
 *       200:
 *         description: 비상 알림 상태 업데이트 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 비상 알림을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validatedData = emergencyAlertUpdateSchema.parse(body);

    const alert = await prisma.emergencyAlert.findUnique({
      where: { id: validatedData.id },
    });

    if (!alert) {
      return NextResponse.json(
        { error: '존재하지 않는 비상 알림입니다.' },
        { status: 404 }
      );
    }

    const updatedAlert = await prisma.emergencyAlert.update({
      where: { id: validatedData.id },
      data: { status: validatedData.status },
    });

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('비상 알림 상태 업데이트 중 오류 발생:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '비상 알림 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
} 