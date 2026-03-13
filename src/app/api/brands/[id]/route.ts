import { NextRequest, NextResponse } from 'next/server';
import { getBrand, updateBrand, deleteBrand } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = getBrand(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
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
    const brand = getBrand(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // If channels is an array, stringify it
    if (Array.isArray(body.channels)) {
      body.channels = JSON.stringify(body.channels);
    }

    updateBrand(id, body);
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
    const brand = getBrand(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    deleteBrand(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
