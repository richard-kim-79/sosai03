import { WebClient } from '@slack/web-api';

// Slack 클라이언트 초기화 (봇 토큰 사용)
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// 채널 목록 가져오기
export async function getChannels() {
  try {
    const result = await slack.conversations.list({
      types: 'public_channel,private_channel',
    });
    
    if (!result.ok) {
      console.error('채널 목록 가져오기 실패:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, channels: result.channels };
  } catch (error) {
    console.error('채널 목록 가져오기 중 오류가 발생했습니다:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
}

// Slack 메시지 전송 함수
export async function sendSlackMessage(channelId: string, message: string) {
  try {
    console.log('Slack 메시지 전송 시도:', { channelId, message });
    
    const result = await slack.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log('Slack API 응답:', result);
    
    if (!result.ok) {
      console.error('Slack API 오류:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Slack 메시지 전송 중 오류가 발생했습니다:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
}

// 긴급 상황 메시지 생성 함수
export function createEmergencySlackMessage(userInfo: {
  name: string;
  contact: string;
  location?: string;
  additionalInfo?: string;
}) {
  return `🚨 긴급 상황 발생!\n\n` +
    `이름: ${userInfo.name}\n` +
    `연락처: ${userInfo.contact}\n` +
    (userInfo.location ? `위치: ${userInfo.location}\n` : '') +
    (userInfo.additionalInfo ? `추가 정보: ${userInfo.additionalInfo}\n` : '') +
    `\n즉시 대응이 필요합니다!`;
} 