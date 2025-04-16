import { prisma } from './prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RiskFactors {
  suicidalIdeation: boolean;
  depression: boolean;
  anxiety: boolean;
  selfHarm: boolean;
  isolation: boolean;
  substanceAbuse: boolean;
  violence: boolean;
  other: string[];
}

interface RiskAnalysis {
  riskLevel: 'LOW' | 'MID' | 'HIGH';
  riskFactors: RiskFactors;
  confidence: number;
  explanation: string;
}

export async function analyzeMessageRisk(message: string): Promise<RiskAnalysis> {
  try {
    const prompt = `다음 메시지를 분석하여 위험도를 평가해주세요.
메시지: "${message}"

위험도는 LOW, MID, HIGH 중 하나로 평가하고, 다음 위험 요소들을 확인해주세요:
- 자살 생각 (suicidalIdeation)
- 우울증 (depression)
- 불안 (anxiety)
- 자해 (selfHarm)
- 고립감 (isolation)
- 약물 남용 (substanceAbuse)
- 폭력 (violence)
- 기타 위험 요소 (other)

JSON 형식으로 응답해주세요:
{
  "riskLevel": "위험도",
  "riskFactors": {
    "suicidalIdeation": boolean,
    "depression": boolean,
    "anxiety": boolean,
    "selfHarm": boolean,
    "isolation": boolean,
    "substanceAbuse": boolean,
    "violence": boolean,
    "other": string[]
  },
  "confidence": 0.0-1.0,
  "explanation": "위험도 판단 근거"
}`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "당신은 전문적인 위기 상담가입니다. 사용자의 메시지를 분석하여 위험도를 평가하고, 위험 요소를 식별하는 것이 당신의 임무입니다."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const result = JSON.parse(response.data.choices[0].message?.content || '{}');
    return result as RiskAnalysis;
  } catch (error) {
    console.error('위험도 분석 중 오류 발생:', error);
    throw new Error('위험도 분석에 실패했습니다.');
  }
}

export async function saveChatMessage(sessionId: string, content: string, role: 'user' | 'assistant') {
  const analysis = await analyzeMessageRisk(content);
  
  const message = await prisma.chatMessage.create({
    data: {
      content,
      role,
      sessionId,
      riskLevel: analysis.riskLevel,
      riskFactors: JSON.stringify(analysis.riskFactors),
    },
  });

  await prisma.riskAnalysis.create({
    data: {
      sessionId,
      messageId: message.id,
      riskLevel: analysis.riskLevel,
      riskFactors: JSON.stringify(analysis.riskFactors),
      confidence: analysis.confidence,
    },
  });

  return { message, analysis };
}

export async function getSessionRiskHistory(sessionId: string) {
  return prisma.riskAnalysis.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    include: { message: true },
  });
}

export async function generateGPTResponse(message: string, analysis: RiskAnalysis): Promise<string> {
  try {
    const systemPrompt = `당신은 전문적인 위기 상담가입니다. 
사용자의 위험도는 ${analysis.riskLevel}이며, 다음과 같은 위험 요소가 감지되었습니다:
${Object.entries(analysis.riskFactors)
  .filter(([_, value]) => value === true)
  .map(([key]) => `- ${key}`)
  .join('\n')}

위험도에 따른 응답 가이드라인:
- HIGH: 즉각적인 위기 개입이 필요합니다. 사용자를 안정시키고, 전문가와의 연결을 도와주세요.
- MID: 우려되는 상황입니다. 사용자의 감정을 공감하고, 추가적인 지원을 제공하세요.
- LOW: 일반적인 상담이 가능합니다. 사용자의 이야기를 경청하고, 필요한 지원을 제공하세요.

항상 다음 원칙을 지켜주세요:
1. 공감과 이해를 보여주세요
2. 판단이나 비난을 피하세요
3. 전문적인 도움을 권장하세요
4. 긍정적인 방향으로 유도하세요
5. 구체적인 행동 계획을 제시하세요`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message?.content || "죄송합니다. 응답을 생성하는 데 문제가 발생했습니다.";
  } catch (error) {
    console.error('GPT 응답 생성 중 오류 발생:', error);
    throw new Error('GPT 응답 생성에 실패했습니다.');
  }
} 