import { NextRequest, NextResponse } from 'next/server';
import { analyzeSEO } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, industry } = body;

    if (!title || !industry) {
      return NextResponse.json({ error: 'title and industry are required' }, { status: 400 });
    }

    const result = await analyzeSEO({ title, description, content, industry });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    return NextResponse.json({ error: 'Failed to analyze SEO' }, { status: 500 });
  }
}
