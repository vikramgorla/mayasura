import { NextRequest, NextResponse } from 'next/server';
import { requireBrandOwner } from '@/lib/api-auth';
import { getDb } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const db = getDb();
    const setting = db.prepare(
      'SELECT value FROM brand_settings WHERE brand_id = ? AND key = ?'
    ).get(id, 'chatbot-tone') as { value: string } | undefined;

    return NextResponse.json({ value: setting?.value || 'friendly' });
  } catch {
    return NextResponse.json({ value: 'friendly' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const { value } = await request.json();
    if (!['friendly', 'professional', 'playful'].includes(value)) {
      return NextResponse.json({ error: 'Invalid tone' }, { status: 400 });
    }

    const db = getDb();
    // Upsert
    const existing = db.prepare(
      'SELECT id FROM brand_settings WHERE brand_id = ? AND key = ?'
    ).get(id, 'chatbot-tone');

    if (existing) {
      db.prepare(
        'UPDATE brand_settings SET value = ? WHERE brand_id = ? AND key = ?'
      ).run(value, id, 'chatbot-tone');
    } else {
      db.prepare(
        'INSERT INTO brand_settings (id, brand_id, key, value) VALUES (?, ?, ?, ?)'
      ).run(crypto.randomUUID(), id, 'chatbot-tone', value);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save tone error:', error);
    return NextResponse.json({ error: 'Failed to save tone' }, { status: 500 });
  }
}
