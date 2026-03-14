import { NextRequest, NextResponse } from 'next/server';
import { getBrand, updateBrand, deleteBrandCascade, isSlugAvailable } from '@/lib/db';
import { requireBrandOwner, sanitizeObject } from '@/lib/api-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand } = await requireBrandOwner(id);
    if (error) return error;
    return NextResponse.json({ brand });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
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

    // If channels is an array, stringify it
    if (Array.isArray(body.channels)) {
      body.channels = JSON.stringify(body.channels);
    }

    // Validate slug if being changed
    if (body.slug) {
      const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-|-$/g, '');
      if (slug.length < 2) {
        return NextResponse.json({ error: 'Slug must be at least 2 characters' }, { status: 400 });
      }
      if (slug.length > 64) {
        return NextResponse.json({ error: 'Slug must be under 64 characters' }, { status: 400 });
      }
      if (!isSlugAvailable(slug, id)) {
        return NextResponse.json({ error: 'Slug is already taken' }, { status: 409 });
      }
      body.slug = slug;
    }

    // Sanitize string inputs
    const sanitized = sanitizeObject(body);
    updateBrand(id, sanitized);
    const updated = getBrand(id);
    return NextResponse.json({ brand: updated });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const counts = deleteBrandCascade(id);
    return NextResponse.json({ success: true, deleted: counts });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
