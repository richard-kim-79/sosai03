import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedApiKey = process.env.MCP_API_KEY;

  if (!apiKey || apiKey !== expectedApiKey) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 