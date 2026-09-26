import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error in verify-otp proxy:', error);
    return NextResponse.json({ error: error.message || 'Failed to communicate with auth backend' }, { status: 500 });
  }
}
