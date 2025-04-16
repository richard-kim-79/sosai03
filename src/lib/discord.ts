import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

// Discord 클라이언트 초기화
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Discord 봇 로그인
client.login(process.env.DISCORD_BOT_TOKEN);

// Discord 메시지 전송 함수
export async function sendDiscordMessage(channelId: string, message: string) {
  try {
    const channel = await client.channels.fetch(channelId) as TextChannel;
    if (!channel) {
      throw new Error('채널을 찾을 수 없습니다.');
    }

    await channel.send(message);
    return { success: true };
  } catch (error) {
    console.error('Discord 메시지 전송 중 오류가 발생했습니다:', error);
    return { success: false, error };
  }
}

// 위험 상황 알림 메시지 생성
export function createEmergencyDiscordMessage(userInfo: {
  name: string;
  contact: string;
  address?: string;
}) {
  return `
🚨 **긴급: 위험 상황 감지**

**사용자 정보:**
- 이름: ${userInfo.name}
- 연락처: ${userInfo.contact}
${userInfo.address ? `- 주소: ${userInfo.address}` : ''}

즉시 확인하고 대응해주시기 바랍니다.
  `;
} 