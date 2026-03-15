import { NextRequest, NextResponse } from 'next/server';
import { generateCopy } from '@/lib/ai';
import { requireAuth } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { brandName, industry, brandVoice, type, context } = body;

    if (!brandName || !industry || !type) {
      return NextResponse.json({ error: 'brandName, industry, and type are required' }, { status: 400 });
    }

    const validTypes = ['hero', 'tagline', 'about', 'product', 'meta-description'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }

    const result = await generateCopy({ brandName, industry, brandVoice, type, context });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating copy:', error);
    return NextResponse.json({ error: 'Failed to generate copy' }, { status: 500 });
  }
}
