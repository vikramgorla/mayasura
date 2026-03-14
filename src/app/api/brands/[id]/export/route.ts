import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBrand, getContentByBrand } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand } = await requireBrandOwner(id);
    if (error) return error;

    const products = getProductsByBrand(id);
    const content = getContentByBrand(id);

    const exportData = {
      brand,
      products,
      content,
      exportedAt: new Date().toISOString(),
      version: '2.0',
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mayasura-brand-${id}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting brand:', error);
    return NextResponse.json({ error: 'Failed to export brand' }, { status: 500 });
  }
}
