import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendSlackMessage, createEmergencySlackMessage } from '@/lib/slack';

const responseSchema = z.object({
  message: z.string().min(1, '메시지를 입력하세요.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = responseSchema.parse(body);

    // 위험도 분석 (예시: 단순 키워드 기반)
    const riskLevel = analyzeRiskLevel(validatedData.message);

    // 응답 저장
    const response = await prisma.crisisResponse.create({
      data: {
        userId: 'anonymous', // TODO: 실제 사용자 ID로 교체
        message: validatedData.message,
        riskLevel,
        status: 'pending',
      },
    });

    // HIGH 위험도인 경우 Slack 알림 전송
    if (riskLevel === 'HIGH') {
      const slackMessage = createEmergencySlackMessage(
        '익명 사용자',
        '알 수 없음',
        undefined,
        validatedData.message
      );
      await sendSlackMessage(slackMessage);
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    console.error('응답 저장 중 오류 발생:', error);
    return NextResponse.json(
      { error: '응답 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}

function analyzeRiskLevel(message: string): 'LOW' | 'MID' | 'HIGH' {
  const highRiskKeywords = ['자살', '죽고 싶다', '끝내고 싶다', '살고 싶지 않다'];
  const midRiskKeywords = ['힘들다', '도와줘', '외롭다', '우울하다'];

  const hasHighRisk = highRiskKeywords.some(keyword => message.includes(keyword));
  const hasMidRisk = midRiskKeywords.some(keyword => message.includes(keyword));

  if (hasHighRisk) return 'HIGH';
  if (hasMidRisk) return 'MID';
  return 'LOW';
} 