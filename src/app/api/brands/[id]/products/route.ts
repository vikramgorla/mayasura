import { NextRequest, NextResponse } from 'next/server';
import { getBrand, createProduct, getProductsByBrand, updateProduct, deleteProduct } from '@/lib/db';
import { nanoid } from 'nanoid';

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
    const brand = getBrand(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const productId = nanoid(12);
    createProduct({
      id: productId,
      brand_id: id,
      name: body.name,
      description: body.description,
      price: body.price,
      currency: body.currency,
      image_url: body.image_url,
      category: body.category,
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
    await params;
    const body = await request.json();
    if (!body.productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    updateProduct(body.productId, body);
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
    await params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
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
