import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Mocked response from the backend
    const botResponse = `You said: "${message}". How can I assist further?`;

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}