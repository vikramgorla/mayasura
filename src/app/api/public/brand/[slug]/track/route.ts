import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, trackPageView } from '@/lib/db';
import { nanoid } from 'nanoid';
import { Brand } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const brand = getBrandBySlug(slug) as Brand | undefined;
    
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();

    trackPageView({
      id: nanoid(12),
      brand_id: brand.id,
      page: body.page || '/',
      referrer: body.referrer,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ ok: true }); // Don't fail on tracking errors
  }
}
