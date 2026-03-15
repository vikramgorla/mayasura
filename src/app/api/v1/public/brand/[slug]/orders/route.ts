import { NextRequest } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db/client";
import { brands, orders, orderItems, products, discountCodes } from "@/lib/db/schema";
import { createOrderSchema } from "@/lib/validation/order";
import { success, error, created } from "@/lib/api/response";

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

    if (!brand || brand.status !== "launched") {
      return error("Brand not found", 404);
    }

    const body: unknown = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { items, discountCode, ...customerData } = parsed.data;

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Validate and apply discount
    let discountAmount = 0;
    let appliedCode: string | null = null;

    if (discountCode) {
      const discount = db
        .select()
        .from(discountCodes)
        .where(
          and(
            eq(discountCodes.brandId, brand.id),
            eq(discountCodes.code, discountCode.toUpperCase())
          )
        )
        .get();

      if (discount && discount.active) {
        const now = new Date().toISOString();
        const notExpired = !discount.expiresAt || discount.expiresAt > now;
        const hasUses =
          !discount.maxUses || discount.usedCount < discount.maxUses;
        const meetsMinimum =
          !discount.minOrder || subtotal >= discount.minOrder;

        if (notExpired && hasUses && meetsMinimum) {
          if (discount.type === "percentage") {
            discountAmount = subtotal * (discount.value / 100);
          } else {
            discountAmount = Math.min(discount.value, subtotal);
          }
          appliedCode = discount.code;

          // Increment usage
          db.update(discountCodes)
            .set({ usedCount: sql`${discountCodes.usedCount} + 1` })
            .where(eq(discountCodes.id, discount.id))
            .run();
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount);
    const now = new Date().toISOString();
    const orderId = nanoid();

    // Create order
    const order = {
      id: orderId,
      brandId: brand.id,
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone || null,
      shippingAddress: customerData.shippingAddress,
      items: JSON.stringify(items),
      subtotal,
      discountCode: appliedCode,
      discountAmount,
      total,
      currency: customerData.currency,
      status: "pending" as const,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(orders).values(order).run();

    // Create order items
    for (const item of items) {
      // Verify product exists
      const product = db
        .select({ id: products.id })
        .from(products)
        .where(
          and(eq(products.id, item.productId), eq(products.brandId, brand.id))
        )
        .get();

      db.insert(orderItems)
        .values({
          id: nanoid(),
          orderId,
          productId: product ? item.productId : null,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })
        .run();
    }

    return created({
      id: orderId,
      total,
      subtotal,
      discountAmount,
      discountCode: appliedCode,
      status: "pending",
    });
  } catch (err) {
    console.error("Create order error:", err);
    return error("Internal server error", 500);
  }
}
