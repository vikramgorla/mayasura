import { NextRequest, NextResponse } from 'next/server';
import { requireBrandOwner } from '@/lib/api-auth';
import { getReviewsByBrand, updateReviewStatus } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const status = req.nextUrl.searchParams.get('status') || undefined;
    const reviews = getReviewsByBrand(id, status);

    // Group counts
    const allReviews = getReviewsByBrand(id);
    const counts = {
      total: allReviews.length,
      pending: allReviews.filter(r => r.status === 'pending').length,
      approved: allReviews.filter(r => r.status === 'approved').length,
      rejected: allReviews.filter(r => r.status === 'rejected').length,
    };

    return NextResponse.json({ reviews, counts });
  } catch (error) {
    console.error('GET brand reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await req.json();
    const { reviewId, reviewIds, action } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    // Bulk action
    const ids: string[] = reviewIds || (reviewId ? [reviewId] : []);
    if (ids.length === 0) {
      return NextResponse.json({ error: 'reviewId or reviewIds required' }, { status: 400 });
    }

    for (const rid of ids) {
      updateReviewStatus(rid, status);
    }

    return NextResponse.json({ success: true, updated: ids.length });
  } catch (error) {
    console.error('PUT brand reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
