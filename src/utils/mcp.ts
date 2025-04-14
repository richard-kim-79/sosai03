import { MCPClient } from '@modelcontextprotocol/mcp';

const mcpClient = new MCPClient({
  serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:3000',
  apiKey: process.env.MCP_API_KEY,
  modelId: process.env.MCP_MODEL_ID || 'gpt-4',
  maxTokens: parseInt(process.env.MCP_MAX_TOKENS || '4096'),
  temperature: parseFloat(process.env.MCP_TEMPERATURE || '0.7'),
});

export const analyzeRisk = async (text: string) => {
  try {
    const response = await mcpClient.generate({
      prompt: `다음 대화 내용의 위험도를 분석해주세요. 위험도는 LOW, MID, HIGH 중 하나로 분류해주세요.
      
      대화 내용: ${text}
      
      위험도 분석 결과를 JSON 형식으로 반환해주세요:
      {
        "level": "위험도",
        "score": "0-100 사이의 점수",
        "keywords": ["위험 키워드 배열"],
        "reason": "위험도 판단 이유"
      }`,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('위험도 분석 중 오류 발생:', error);
    return {
      level: 'LOW',
      score: 0,
      keywords: [],
      reason: '분석 중 오류가 발생했습니다.',
    };
  }
};

export const generateResponse = async (text: string) => {
  try {
    const response = await mcpClient.generate({
      prompt: `다음 대화 내용에 대해 공감적이고 도움이 되는 응답을 생성해주세요.
      
      대화 내용: ${text}
      
      응답은 다음 형식을 따라주세요:
      1. 공감과 이해
      2. 구체적인 조언
      3. 추가 도움 제안`,
    });

    return response.text;
  } catch (error) {
    console.error('응답 생성 중 오류 발생:', error);
    return '죄송합니다. 현재 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.';
  }
}; 