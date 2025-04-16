import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Discord 봇 로그인
client.login(process.env.DISCORD_BOT_TOKEN);

export async function sendDiscordMessage(channelId: string, message: string) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel?.isTextBased()) {
      await channel.send(message);
    }
  } catch (error) {
    console.error('Discord 메시지 전송 중 오류 발생:', error);
  }
}

export function createEmergencyDiscordMessage(
  name: string,
  contact: string,
  address?: string,
  message?: string
) {
  return `
🚨 위기 상황 알림

이름: ${name}
연락처: ${contact}
${address ? `주소: ${address}` : ''}
${message ? `\n메시지: ${message}` : ''}
  `.trim();
} 