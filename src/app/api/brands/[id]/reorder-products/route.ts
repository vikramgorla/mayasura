import { NextRequest, NextResponse } from 'next/server';
import { reorderProducts } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

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
