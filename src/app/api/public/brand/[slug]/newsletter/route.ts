import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, addNewsletterSubscriber } from '@/lib/db';
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
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    addNewsletterSubscriber(brand.id, email.toLowerCase().trim(), name?.trim());

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
