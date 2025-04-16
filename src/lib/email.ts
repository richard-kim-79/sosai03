import nodemailer from 'nodemailer';

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('이메일 전송 중 오류 발생:', error);
    throw new Error('이메일 전송에 실패했습니다.');
  }
}

// 위험 상황 알림 이메일 템플릿
export function createEmergencyEmail(userInfo: {
  name: string;
  contact: string;
  address?: string;
}) {
  return {
    subject: '🚨 긴급: 위험 상황 감지',
    text: `
긴급 상황이 감지되었습니다.

사용자 정보:
- 이름: ${userInfo.name}
- 연락처: ${userInfo.contact}
${userInfo.address ? `- 주소: ${userInfo.address}` : ''}

즉시 확인하고 대응해주시기 바랍니다.
    `,
    html: `
      <h2>🚨 긴급: 위험 상황 감지</h2>
      <p>긴급 상황이 감지되었습니다.</p>
      <h3>사용자 정보:</h3>
      <ul>
        <li>이름: ${userInfo.name}</li>
        <li>연락처: ${userInfo.contact}</li>
        ${userInfo.address ? `<li>주소: ${userInfo.address}</li>` : ''}
      </ul>
      <p>즉시 확인하고 대응해주시기 바랍니다.</p>
    `,
  };
}

export function createEmergencyEmailMessage(
  name: string,
  phone: string,
  location?: string,
  message?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">🚨 위기 상황 알림</h2>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>전화번호:</strong> ${phone}</p>
        ${location ? `<p><strong>위치:</strong> ${location}</p>` : ''}
        ${message ? `<p><strong>메시지:</strong> ${message}</p>` : ''}
      </div>
      <p style="color: #6c757d; font-size: 0.9em; margin-top: 20px;">
        이 이메일은 자동으로 발송되었습니다. 즉시 조치가 필요합니다.
      </p>
    </div>
  `;
} 