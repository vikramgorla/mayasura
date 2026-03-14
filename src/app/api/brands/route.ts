import { NextRequest, NextResponse } from 'next/server';
import { createBrand, getAllBrands } from '@/lib/db';
import { requireAuth, sanitizeInput, validateLength } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const brands = getAllBrands(session.userId);
    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    // Sanitize inputs
    const name = sanitizeInput(body.name);
    const tagline = body.tagline ? sanitizeInput(body.tagline) : undefined;
    const description = body.description ? sanitizeInput(body.description) : undefined;

    // Validate lengths
    const nameErr = validateLength(name, 'Brand name', 200);
    if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });
    if (description) {
      const descErr = validateLength(description, 'Description', 5000);
      if (descErr) return NextResponse.json({ error: descErr }, { status: 400 });
    }

    const id = nanoid(12);

    createBrand({
      id,
      name,
      tagline,
      description,
      industry: body.industry ? sanitizeInput(body.industry) : undefined,
      logo_url: body.logo_url,
      primary_color: body.primary_color,
      secondary_color: body.secondary_color,
      accent_color: body.accent_color,
      font_heading: body.font_heading,
      font_body: body.font_body,
      brand_voice: body.brand_voice ? sanitizeInput(body.brand_voice) : undefined,
      channels: body.channels ? JSON.stringify(body.channels) : undefined,
      status: body.status || 'draft',
      user_id: session.userId,
    });

    const brand = { id, ...body, name, tagline, description };
    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    const message = error instanceof Error ? error.message : 'Failed to create brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
