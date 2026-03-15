import { NextRequest, NextResponse } from 'next/server';
import { generateCompetitorPositioning } from '@/lib/ai';
import { requireAuth } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { brandName, industry } = body;

    if (!brandName || typeof brandName !== 'string') {
      return NextResponse.json(
        { error: 'brandName is required' },
        { status: 400 }
      );
    }

    if (!industry || typeof industry !== 'string') {
      return NextResponse.json(
        { error: 'industry is required' },
        { status: 400 }
      );
    }

    const positioning = await generateCompetitorPositioning(
      brandName.trim(),
      industry.trim()
    );

    return NextResponse.json({ positioning });
  } catch (error) {
    console.error('Error in competitor positioning:', error);
    return NextResponse.json(
      { error: 'Competitor analysis failed' },
      { status: 500 }
    );
  }
}
