import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin') || '';

  // 허용된 도메인 목록
  const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(domain => domain.trim());
  
  // 요청 도메인이 허용 목록에 있는지 확인
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  // OPTIONS 요청 처리
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 