import { NextRequest, NextResponse } from 'next/server';
import { getBrand, reorderProducts } from '@/lib/db';

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

    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array required' }, { status: 400 });
    }

    reorderProducts(items.map((item: { id: string }, index: number) => ({
      id: item.id,
      sort_order: index,
    })));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json({ error: 'Failed to reorder products' }, { status: 500 });
  }
}
