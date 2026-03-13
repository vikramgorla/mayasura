import { NextRequest, NextResponse } from 'next/server';
import { createBrand, getAllBrands } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const brands = getAllBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const id = nanoid(12);
    createBrand({
      id,
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      logo_url: body.logo_url,
      primary_color: body.primary_color,
      secondary_color: body.secondary_color,
      accent_color: body.accent_color,
      font_heading: body.font_heading,
      font_body: body.font_body,
      brand_voice: body.brand_voice,
      channels: body.channels ? JSON.stringify(body.channels) : undefined,
      status: body.status || 'draft',
    });

    const brand = { id, ...body };
    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
