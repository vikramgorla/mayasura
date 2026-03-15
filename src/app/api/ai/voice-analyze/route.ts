import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceCharacteristics } from '@/lib/ai';
import { requireAuth } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { sampleText } = body;

    if (!sampleText || typeof sampleText !== 'string') {
      return NextResponse.json(
        { error: 'sampleText is required and must be a string' },
        { status: 400 }
      );
    }

    if (sampleText.trim().length < 20) {
      return NextResponse.json(
        { error: 'sampleText must be at least 20 characters for meaningful analysis' },
        { status: 400 }
      );
    }

    if (sampleText.length > 5000) {
      return NextResponse.json(
        { error: 'sampleText must be under 5000 characters' },
        { status: 400 }
      );
    }

    const analysis = await analyzeVoiceCharacteristics(sampleText);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in voice-analyze:', error);
    return NextResponse.json({ error: 'Voice analysis failed' }, { status: 500 });
  }
}
