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

export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('이메일이 성공적으로 전송되었습니다:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('이메일 전송 중 오류가 발생했습니다:', error);
    return { success: false, error };
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