import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, getPublicReviews, getReviewStats, createReview, incrementReviewHelpful } from '@/lib/db';
import { randomUUID } from 'crypto';

type Params = { params: Promise<{ slug: string; productId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug, productId } = await params;
    const brand = getBrandBySlug(slug) as { id: string } | null;
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const reviews = getPublicReviews(brand.id, productId);
    const stats = getReviewStats(brand.id, productId);

    // Mask emails in public response
    const safeReviews = reviews.map(r => ({
      id: r.id,
      author_name: r.author_name,
      rating: r.rating,
      title: r.title,
      body: r.body,
      verified_purchase: r.verified_purchase,
      helpful_count: r.helpful_count,
      created_at: r.created_at,
    }));

    return NextResponse.json({ reviews: safeReviews, stats });
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug, productId } = await params;
    const brand = getBrandBySlug(slug) as { id: string } | null;
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const body = await req.json();

    // Honeypot spam filter
    if (body.website || body.url || body.hp_field) {
      // Silently accept (don't tell bots they failed)
      return NextResponse.json({ success: true });
    }

    const { author_name, author_email, rating, title, review_body } = body;

    if (!author_name || typeof author_name !== 'string' || author_name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!author_email || typeof author_email !== 'string' || !author_email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }
    if (!review_body || typeof review_body !== 'string' || review_body.trim().length < 5) {
      return NextResponse.json({ error: 'Review body must be at least 5 characters' }, { status: 400 });
    }

    createReview({
      id: randomUUID(),
      brand_id: brand.id,
      product_id: productId,
      author_name: author_name.trim().slice(0, 100),
      author_email: author_email.trim().slice(0, 200),
      rating: Math.round(rating),
      title: title ? String(title).trim().slice(0, 200) : undefined,
      body: review_body.trim().slice(0, 2000),
    });

    return NextResponse.json({ success: true, message: 'Review submitted for moderation' }, { status: 201 });
  } catch (error) {
    console.error('POST review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { slug, productId } = await params;
    const brand = getBrandBySlug(slug) as { id: string } | null;
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const body = await req.json();
    if (!body.reviewId) return NextResponse.json({ error: 'reviewId required' }, { status: 400 });

    // Mark as helpful (public action)
    incrementReviewHelpful(body.reviewId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT review helpful error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
