import { NextRequest, NextResponse } from 'next/server';
import { createProduct, getProductsByBrand, updateProduct, deleteProduct, deleteProductBatch } from '@/lib/db';
import { requireBrandOwner, sanitizeInput, sanitizeObject } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const products = getProductsByBrand(id);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const productId = nanoid(12);
    createProduct({
      id: productId,
      brand_id: id,
      name: sanitizeInput(body.name),
      description: body.description ? sanitizeInput(body.description) : undefined,
      price: body.price,
      currency: body.currency,
      image_url: body.image_url,
      category: body.category ? sanitizeInput(body.category) : undefined,
    });

    return NextResponse.json({ product: { id: productId, ...body, brand_id: id } }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
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
    if (!body.productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    const { productId, ...updates } = body;
    updateProduct(productId, sanitizeObject(updates));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const batchIds = searchParams.get('ids');

    if (batchIds) {
      const ids = batchIds.split(',').filter(Boolean);
      if (ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
      }
      deleteProductBatch(ids);
      return NextResponse.json({ success: true, deleted: ids.length });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    deleteProduct(productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
