import { NextRequest, NextResponse } from 'next/server';
import { generateColorPalette } from '@/lib/ai';
import { requireAuth } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { industry, mood, style } = body;

    if (!industry) {
      return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
    }

    const palettes = await generateColorPalette({ industry, mood, style });
    return NextResponse.json({ palettes });
  } catch (error) {
    console.error('Error generating color palette:', error);
    return NextResponse.json({ error: 'Failed to generate color palette' }, { status: 500 });
  }
}
