import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { saveChatMessage, getSessionRiskHistory, generateGPTResponse } from '@/lib/ai';
import { sendSlackMessage, createEmergencySlackMessage } from '@/lib/slack';

const chatSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = chatSchema.parse(body);

    // 사용자 메시지 저장 및 위험도 분석
    const { message: userMessage, analysis } = await saveChatMessage(
      validatedData.sessionId,
      validatedData.message,
      'user'
    );

    // HIGH 위험도인 경우 Slack 알림 전송
    if (analysis.riskLevel === 'HIGH') {
      const slackMessage = createEmergencySlackMessage(
        '익명 사용자',
        '알 수 없음',
        undefined,
        validatedData.message
      );
      await sendSlackMessage(slackMessage);
    }

    // GPT-4 응답 생성
    const gptResponse = await generateGPTResponse(validatedData.message, analysis);
    
    // AI 응답 저장
    await saveChatMessage(
      validatedData.sessionId,
      gptResponse,
      'assistant'
    );

    return NextResponse.json({
      message: gptResponse,
      riskLevel: analysis.riskLevel,
      riskFactors: analysis.riskFactors,
    });
  } catch (error) {
    console.error('채팅 API 오류:', error);
    return NextResponse.json(
      { error: '채팅 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: '세션 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const history = await getSessionRiskHistory(sessionId);
    return NextResponse.json(history);
  } catch (error) {
    console.error('채팅 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '채팅 기록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

async function generateGPTResponse(message: string, analysis: any) {
  return await generateGPTResponse(message, analysis);
} 