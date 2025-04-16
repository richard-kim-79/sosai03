import { WebClient } from '@slack/web-api';
import axios from 'axios';

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

interface SlackMessage {
  text: string;
  blocks?: any[];
}

// Slack 메시지 전송 함수
export async function sendSlackMessage(message: SlackMessage) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('Slack 웹훅 URL이 설정되지 않았습니다.');
    }

    await axios.post(webhookUrl, message);
  } catch (error) {
    console.error('Slack 메시지 전송 중 오류 발생:', error);
    throw new Error('Slack 메시지 전송에 실패했습니다.');
  }
}

// 긴급 상황 메시지 생성 함수
export function createEmergencySlackMessage(
  name: string,
  phone: string,
  location?: string,
  message?: string
) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🚨 위기 상황 알림',
        emoji: true
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*이름:*\n${name}`
        },
        {
          type: 'mrkdwn',
          text: `*전화번호:*\n${phone}`
        }
      ]
    }
  ];

  if (location) {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*위치:*\n${location}`
        }
      ]
    });
  }

  if (message) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*메시지:*\n${message}`
      }
    });
  }

  return {
    text: '위기 상황 알림',
    blocks
  };
} 