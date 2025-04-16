import { NextResponse } from 'next/server';
import { encrypt } from '@/utils/security';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    
    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    const encryptedData = encrypt(JSON.stringify(data));
    
    return NextResponse.json(
      { encryptedData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Failed to encrypt data' },
      { status: 500 }
    );
  }
} 