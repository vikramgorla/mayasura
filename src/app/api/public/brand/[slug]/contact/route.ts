import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, createContactSubmission } from '@/lib/db';
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
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    createContactSubmission({
      id: nanoid(12),
      brand_id: brand.id,
      name,
      email,
      message,
    });

    return NextResponse.json({ success: true, message: 'Thank you for your message!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
