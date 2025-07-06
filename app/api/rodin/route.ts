// Enhanced Rodin API route with improved error handling
import { NextRequest, NextResponse } from 'next/server';

const RODIN_API_BASE = process.env.RODIN_API_URL || 'https://api.hyperhuman.deemos.com';
const RODIN_API_KEY = process.env.RODIN_API_KEY;

if (!RODIN_API_KEY) {
  console.warn('RODIN_API_KEY not found in environment variables');
}

export async function POST(request: NextRequest) {
  if (!RODIN_API_KEY) {
    return NextResponse.json(
      { error: 'Rodin API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`${RODIN_API_BASE}/rodin/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RODIN_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Rodin API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Rodin API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}