import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, orders, orderItems } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ slug: string; orderId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug, orderId } = await params;

    const brand = db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand) return error("Brand not found", 404);

    const order = db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.brandId, brand.id)))
      .get();

    if (!order) return error("Order not found", 404);

    const items = db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .all();

    return success({
      ...order,
      items,
    });
  } catch (err) {
    console.error("Get order error:", err);
    return error("Internal server error", 500);
  }
}
