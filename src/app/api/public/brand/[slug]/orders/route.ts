import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, createOrder, getOrder } from '@/lib/db';
import { nanoid } from 'nanoid';
import { Brand } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const brand = getBrandBySlug(slug) as Brand | undefined;
    
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const { customer_name, customer_email, shipping_address, items, total, currency } = body;

    if (!customer_name || !customer_email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = nanoid(12);

    createOrder({
      id: orderId,
      brand_id: brand.id,
      customer_email,
      customer_name,
      shipping_address: shipping_address || null,
      items: JSON.stringify(items),
      total: total || 0,
      currency: currency || 'USD',
      status: 'pending',
    });

    const order = getOrder(orderId);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
