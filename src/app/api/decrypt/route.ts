import { NextResponse } from 'next/server';
import { decrypt } from '@/utils/security';

export async function POST(request: Request) {
  try {
    const { encryptedData } = await request.json();
    
    if (!encryptedData) {
      return NextResponse.json(
        { error: 'Encrypted data is required' },
        { status: 400 }
      );
    }

    const decryptedData = JSON.parse(decrypt(encryptedData));
    
    return NextResponse.json(
      { data: decryptedData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: 'Failed to decrypt data' },
      { status: 500 }
    );
  }
} 