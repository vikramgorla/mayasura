import { NextRequest, NextResponse } from 'next/server';
import {
  addNewsletterSubscriber,
  getNewsletterSubscribers,
  getNewsletterSubscriberCount,
  getActiveSubscriberCount,
  removeNewsletterSubscriber,
} from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    const subscribers = getNewsletterSubscribers(id) as Array<{
      id: string;
      brand_id: string;
      email: string;
      name?: string;
      status?: string;
      subscribed_at: string;
    }>;
    const total = getNewsletterSubscriberCount(id);
    const active = getActiveSubscriberCount(id);

    // CSV export
    if (format === 'csv') {
      const header = 'Email,Name,Status,Subscribed At\n';
      const rows = subscribers
        .map(s => `"${s.email}","${s.name || ''}","${s.status || 'active'}","${s.subscribed_at}"`)
        .join('\n');
      const csv = header + rows;
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="subscribers-${id}.csv"`,
        },
      });
    }

    return NextResponse.json({
      subscribers,
      total,
      active,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    const { email, name } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    addNewsletterSubscriber(id, email.toLowerCase().trim(), name?.trim());

    return NextResponse.json({
      success: true,
      message: 'Subscriber added successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    removeNewsletterSubscriber(id, email);

    return NextResponse.json({
      success: true,
      message: 'Subscriber removed',
    });
  } catch (error) {
    console.error('Error removing subscriber:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
