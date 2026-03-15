import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, discountCodes } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const brand = db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand) return error("Brand not found", 404);

    const body = (await request.json()) as { code?: string; subtotal?: number };
    const code = body.code?.toUpperCase()?.trim();
    const subtotal = body.subtotal || 0;

    if (!code) return error("Discount code is required", 400);

    const discount = db
      .select()
      .from(discountCodes)
      .where(
        and(
          eq(discountCodes.brandId, brand.id),
          eq(discountCodes.code, code)
        )
      )
      .get();

    if (!discount) return error("Invalid discount code", 404);
    if (!discount.active) return error("This discount code is inactive", 400);

    const now = new Date().toISOString();
    if (discount.expiresAt && discount.expiresAt < now) {
      return error("This discount code has expired", 400);
    }
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return error("This discount code has reached its usage limit", 400);
    }
    if (discount.minOrder && subtotal < discount.minOrder) {
      return error(
        `Minimum order of ${discount.minOrder} required for this code`,
        400
      );
    }

    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = subtotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, subtotal);
    }

    return success({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount: Math.round(discountAmount * 100) / 100,
    });
  } catch (err) {
    console.error("Validate discount error:", err);
    return error("Internal server error", 500);
  }
}
