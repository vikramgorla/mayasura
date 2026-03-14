import { NextRequest, NextResponse } from 'next/server';
import { getBrand, updateBrand, deleteBrand } from '@/lib/db';
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

    deleteBrand(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
