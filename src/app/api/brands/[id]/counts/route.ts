import { NextRequest, NextResponse } from 'next/server';
import { getBrandRelatedCounts } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const counts = getBrandRelatedCounts(id);
    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Error fetching brand counts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
