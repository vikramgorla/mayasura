import { NextRequest, NextResponse } from 'next/server';
import { getBrandSettings, setBrandSetting } from '@/lib/db';
import { requireBrandOwner, sanitizeInput } from '@/lib/api-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const settings = getBrandSettings(id);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    const body = await request.json();

    // Support single key-value pair
    if (body.key) {
      setBrandSetting(id, sanitizeInput(body.key), body.value ? sanitizeInput(body.value) : '');
    }

    // Support bulk settings update: { settings: { key1: val1, key2: val2 } }
    if (body.settings && typeof body.settings === 'object') {
      for (const [key, value] of Object.entries(body.settings)) {
        setBrandSetting(id, sanitizeInput(key), value ? sanitizeInput(String(value)) : '');
      }
    }

    const settings = getBrandSettings(id);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
