import { NextRequest, NextResponse } from 'next/server';
import {
  getDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  validateDiscountCode,
  getDiscountCodeByCode,
  getBrand,
} from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/brands/[id]/discounts — list all discount codes
export async function GET(_req: NextRequest, { params }: Params) {
  const { id: brandId } = await params;
  try {
    const { error } = await requireBrandOwner(brandId);
    if (error) return error;
    const discounts = getDiscountCodes(brandId);
    return NextResponse.json({ discounts });
  } catch {
    return NextResponse.json({ error: 'Failed to load discounts' }, { status: 500 });
  }
}

// POST /api/brands/[id]/discounts — create or validate
export async function POST(req: NextRequest, { params }: Params) {
  const { id: brandId } = await params;
  const body = await req.json().catch(() => ({}));

  // Public validate endpoint — no auth needed
  if (body.action === 'validate') {
    const { code, orderTotal = 0 } = body;
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });
    const discount = validateDiscountCode(brandId, String(code), Number(orderTotal));
    if (!discount) return NextResponse.json({ valid: false, error: 'Invalid or expired discount code' });
    const savings =
      discount.type === 'percentage'
        ? (Number(orderTotal) * discount.value) / 100
        : Math.min(discount.value, Number(orderTotal));
    return NextResponse.json({ valid: true, discount, savings: Math.round(savings * 100) / 100 });
  }

  // Create — requires auth
  try {
    const { error } = await requireBrandOwner(brandId);
    if (error) return error;
    const brand = getBrand(brandId);
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const { code, type = 'percentage', value, min_order, max_uses, active = 1, starts_at, expires_at } = body;
    if (!code) return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    if (!value || isNaN(Number(value))) return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    if (type === 'percentage' && (Number(value) <= 0 || Number(value) > 100)) {
      return NextResponse.json({ error: 'Percentage must be 1-100' }, { status: 400 });
    }

    // Check uniqueness
    const existing = getDiscountCodeByCode(brandId, code);
    if (existing) return NextResponse.json({ error: 'Discount code already exists' }, { status: 409 });

    const id = crypto.randomUUID();
    createDiscountCode({
      id,
      brand_id: brandId,
      code,
      type,
      value: Number(value),
      min_order: min_order ? Number(min_order) : null,
      max_uses: max_uses ? Number(max_uses) : null,
      active: Number(active),
      starts_at: starts_at || null,
      expires_at: expires_at || null,
    });

    const discounts = getDiscountCodes(brandId);
    return NextResponse.json({ success: true, discounts }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}

// PUT /api/brands/[id]/discounts — update
export async function PUT(req: NextRequest, { params }: Params) {
  const { id: brandId } = await params;
  try {
    const { error } = await requireBrandOwner(brandId);
    if (error) return error;
    const body = await req.json().catch(() => ({}));
    const { discountId, ...updates } = body;
    if (!discountId) return NextResponse.json({ error: 'discountId required' }, { status: 400 });
    updateDiscountCode(discountId, updates);
    const discounts = getDiscountCodes(brandId);
    return NextResponse.json({ success: true, discounts });
  } catch {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

// DELETE /api/brands/[id]/discounts — delete
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id: brandId } = await params;
  try {
    const { error } = await requireBrandOwner(brandId);
    if (error) return error;
    const body = await req.json().catch(() => ({}));
    const { discountId } = body;
    if (!discountId) return NextResponse.json({ error: 'discountId required' }, { status: 400 });
    deleteDiscountCode(discountId);
    const discounts = getDiscountCodes(brandId);
    return NextResponse.json({ success: true, discounts });
  } catch {
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
